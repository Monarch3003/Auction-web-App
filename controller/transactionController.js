import mongoose from 'mongoose';
import {v4 as uuidv4} from 'uuid';


import cfg from '../config/cfg.js';
import { buyerApprove, sellerApprove, updateApprovalStatus } from './approvalsController.js';

import transactionModel from '../models/transactionsModel.js';
import bidsModel from '../models/bidsModel.js';

const db = cfg.connectDB();
db.on('error', (err) => {
    console.log(err);
});

async function viewTransaction(req, res, userID, txID) {

        const transactions = await transactionModel.find({sellerID: userID, transactionID: txID}).exec();
        // console.log(transactions);
        transactions.forEach((transaction) => {
            if (transaction.sellerID == userID) {
                res.render('layout', {heading: 'Transactions', route: 'transactions', transactions: transactions, seller: true, buyer: false});
            }else if(transaction.bidderID == userID) {
                res.render('layout', {heading: 'Transactions', route: 'transactions', transactions: transactions, buyer: true, seller: false});
            }
        });
    
}

async function viewAllTransaction(req, res, userID) {

        const transactions = await transactionModel.find({}).exec();
        // console.log(transactions) 
        const role = getRole(transactions, userID);    
        // console.log(role);
        res.render('layout', {heading: 'Transactions', route: 'transactions', transactions: role});
    
}

function getRole(txs, userId) {
    try {

        // Filter transactions where the user is either the buyer or the seller
        const userTransactions = txs.filter(transaction => {
            return transaction.sellerID === userId || transaction.bidderID === userId;
        });

        // Determine the role of the user in each transaction
        const userTransactionsWithRoles = userTransactions.map(transaction => {
            let role;
            if (transaction.sellerID === userId) {
                role = "SELLER";
            } else if (transaction.bidderID === userId) {
                role = "BUYER";
            }
            return { ...transaction.toObject(), role };
        });

        return userTransactionsWithRoles;
    } catch (error) {
        // Handle error
        console.error("Error fetching user transactions:", error);
        return []; // Return an empty array or handle the error as needed
    }

}

async function createTransaction(details) {
    let amount, bidder;
    const {
        transactionID,
        auctionID,
        seller,
        propertyID
    } = details;

    const bids = await bidsModel.find({auctionID: auctionID}).exec();
    bids.forEach(bid => {
        amount = bid.currentBidPrice;
        bidder = bid.currentBidder;
    });

    const tx =  new transactionModel({
        transactionID: transactionID,
        auctionID: auctionID,
        sellerID: seller,
        bidderID: bidder,
        propertyID: propertyID,
        amount: amount,
    });

    await tx.save();
}

async function makeTransaction(req, res, transactionID) {
    //made by the buyer who pushes the funds
    await transactionModel.updateOne({transactionID: transactionID}, {transactionDate: Date.now()});
    await buyerApprove(transactionID);
    // updateApprovalStatus(transactionID);
    res.redirect('/api/transactions/all');
}

async function verifyTransaction(req, res, transactionID) {
    //transaction verified by seller thus 
    //uploading the file too
    
    await sellerApprove(transactionID);
    // updateApprovalStatus(transactionID);
    res.redirect('/api/transactions/all');
}

async function getTxStatus(auctionID) {
    const tx = await transactionModel.findOne({auctionID: auctionID}).select().exec();
    // tx.forEach(transaction => {
    //     return transaction.status;
    // });
    // console.log(tx);
    return tx.status;
}

async function updateTxStatus(txID) {
    const txs = await transactionModel.find({transactionID: txID}).select({transactionID: 1, auctionID: 1, sellerID: 1, buyerID: 1, status: 1}).exec();
    txs.forEach(async tx => {
        if(tx.status === 'PENDING') {
            // console.log(tx);
            try {
                await transactionModel.updateOne({transactionID: txID}, {status: 'COMPLETED'});
                console.log(`Transaction of ID ${txID} set to COMPLETED`);
            }catch(err) {
                console.log(err);
            } 
        }
    });
 
}

export {viewTransaction, makeTransaction, createTransaction, verifyTransaction, getTxStatus, viewAllTransaction, updateTxStatus}