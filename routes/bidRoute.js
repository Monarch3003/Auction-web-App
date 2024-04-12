import express from 'express';

import {openBid, getBids, updateBids} from '../controller/bidController.js';
import cfg from '../config/cfg.js';

const router = express.Router();

router.post('/openBid', async (req, res) => {

    const { email, auctionID } = req.session;
    // console.log(auctionID);
    const {price} = req.body;
    const uid = await cfg.userID(email);

    openBid(req, res, auctionID, price, uid);
});

router.get('/viewBids', (req, res) => {
    const {auctionID} = req.query;
    req.session.auctionID = auctionID;

    getBids(req, res, auctionID);
});

router.get('/updateBids', (req, res) => {
    const {auctionID} = req.query;
    updateBids(req, res, auctionID);
});

export default router;