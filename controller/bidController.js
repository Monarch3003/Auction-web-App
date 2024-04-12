
import cfg from '../config/cfg.js'

import bidModel from '../models/bidsModel.js';
import auctionModel from '../models/liveAuctionsModel.js';

const db = cfg.connectDB();
db.on('error', (err) => {
    console.log(err);
});

async function getCurrentBidCount(auctionId) {
    const count = await bidModel.find({auctionID: auctionId}).select({bidCount: 1}).exec();
    if(count.length > 0) {
        console.log(count);
        return count[0].bidCount;
    }else {
        return 0;
        
    }
    
}

async function getCurrentBidPrice(auctionId) {
    let price = await bidModel.find({auctionID: auctionId}).select({currentBidPrice: 1}).exec();
    if(price.length > 0) {
        return price[0].currentBidPrice;
    }else {
        price = await auctionModel.find({auctionID: auctionId}).select({initialPrice: 1}).exec();
        if(price.length > 0) {
            return price[0].initialPrice;
        }
    }
    
}

async function openBid(req, res, auctionId, price, bidder) {
    const currentBidPrice = await getCurrentBidPrice(auctionId);
    // console.log(currentBidPrice);
    if(price < currentBidPrice)  {
        res.render('layout', {heading: 'Bids', route: 'bids', message: "Your Bid is lower than the current Bid" ,error: true});
    }else {

        let bidCounts = await getCurrentBidCount(auctionId);
        bidCounts = bidCounts + 1;
        await bidModel.updateOne({auctionID: auctionId}, {bidCount: bidCounts, currentBidPrice: price, currentBidder: bidder});
        res.redirect(`/api/bid/viewBids?auctionID=${auctionId}`);
    }
}

async function getBids(req, res, auctionID) {
    const bids = await bidModel.find({auctionID: auctionID}).select({auctionID: 1, bidCount: 1, currentBidPrice: 1, currentBidder: 1}).exec();
    // console.log(bids);
    res.render('layout', {heading: 'Bids', route: 'bids', bids: bids, error: false});
}

async function updateBids(req, res, auctionID) {
    const bids = await bidModel.find({auctionID: auctionID}).select({auctionID: 1, bidCount: 1, currentBidPrice: 1, currentBidder: 1}).exec();
    // console.log(bids);
    res.json(bids);
}

export {openBid, getBids, updateBids}