import mongoose from 'mongoose';
import {v4 as uuidv4} from 'uuid';
import cfg from '../config/cfg.js'

import auctionModel from '../models/liveAuctionsModel.js'
import bidsModel from '../models/bidsModel.js';

cfg.connectDB().on('error', (err) => {
    console.log(err);
});

async function viewAuctions(req, res) {
    const auctions = await auctionModel.find({}).select({auctionID: 1, owner:1, propertyName:1, initialPrice: 1 ,propertyID: 1, status: 1,_id: 0}).exec();
    // console.log(auctions);
    res.render('layout', {heading: 'Market', route: 'market', auctions: auctions ,active: true});
}

async function createAuction(req, res, price, propID, propertyName) {
    const {email} = req.session;
    const uid = await cfg.userID(email);

    const auction = new auctionModel({
        auctionID: uuidv4(),

        owner: uid,

        initialPrice: price,

        propertyID: propID,

        propertyName: propertyName,
        // startDate: startAuction,

        // endDate: endAuction
        
    });

    const bid = new bidsModel({
        auctionID: auction.auctionID,
        bidCount: 0,
        currentBidPrice: auction.initialPrice,
    });

    await bid.save();
    await auction.save();
    res.redirect('/api/auctions/market');
    // mongoose.connection.close();
}

export {createAuction, viewAuctions};