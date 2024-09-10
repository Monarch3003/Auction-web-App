import cfg from '../config/cfg.js'

import {v4 as uuidv4} from 'uuid';
import schedule from 'node-schedule';

import {createTransaction, getTxStatus} from '../controller/transactionController.js';
import { createApproval, updateApprovalStatus } from './approvalsController.js';

import auctionModel from '../models/liveAuctionsModel.js'
import bidsModel from '../models/bidsModel.js';
import propertyModel from '../models/propertyModel.js';

cfg.connectDB().on('error', (err) => {
    console.log(err);
});

async function deleteAuction(auctionID) {
    await auctionModel.deleteOne({auctionID: auctionID});
}

async function updateAuctionStatus() {
    const txID = uuidv4();
    const auctions = await auctionModel.find({}).select({auctionID: 1, owner:1, propertyName:1, initialPrice: 1,propertyID: 1, status: 1 ,_id: 1}).exec();
    
    // console.log(auctions);
    auctions.forEach(async auction => {
        const bids = await bidsModel.find({auctionID: auction.auctionID}).select().exec();
        let lastBidCount = bids.bidCount;
        if(auction.status == "OPEN") {
            await auctionModel.updateOne({status: 'OPEN'}, {status: "CLOSED"});
            console.log("Updated");

            await createTransaction({
                transactionID: txID,
                auctionID: auction.auctionID,
                seller: auction.owner,
                propertyID: auction.propertyID
            });
            await createApproval({
                propertyID: auction.propertyID,
                transactionID: txID,
                seller: auction.owner,
                buyer: bids[0].currentBidder
            });

            
            const jobEvery5Minutes = schedule.scheduleJob('*/2 * * * *', async function() {
                console.log('[*EVERY 5 Minutes]: Approving Transactions Status.');
                await updateApprovalStatus(txID);
                // Add your code here for the task every 5 minutes

                // Schedule the second job to run 1 minute after the first job completes
                const jobAfterMinute = schedule.scheduleJob(new Date(Date.now() + 60000), async function() {
                    console.log('[*Next minute]: Closing the deal.');
                    await closeDeal(auction.auctionID);
                    // Add your code here for the task after the first job
                });
            });

        }
    });

}

async function deleteBids(auctionID) {
    await bidsModel.deleteOne({auctionID: auctionID});
}

async function changeOwner(auctionID) {

    const property = await auctionModel.findOne({auctionID: auctionID}).select().exec(); //track propertyID from auctions
    const bidder = await bidsModel.findOne({auctionID: auctionID}).select().exec(); //new owner
    await propertyModel.updateOne({propertyID: property.propertyID}, {userID: bidder.currentBidder, origin: 'BOUGHT'});

    console.log("Ownership change complete. Transaction Completed. Auction Closed.")
}

async function closeDeal(auctionID) {
    const auctions = await auctionModel.findOne({auctionID: auctionID}).select().exec();
    if(auctions != null) {
        const status = await getTxStatus(auctionID);
        if(status == "COMPLETED") {
            await changeOwner(auctionID);
            // await deleteBids(auctionID);
            // deleteAuction(auctionID);
        }
    }
}

export {updateAuctionStatus, closeDeal};