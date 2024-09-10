import express from 'express';

import {createAuction, viewAuctions, search} from '../controller/auctionsController.js';

const router = express.Router();

router.post('/createAuction', (req, res) => {

    const {price, propertyID, propertyName} = req.body;
    // console.log(price, propertyID);
    createAuction(req, res, price, propertyID, propertyName);
});

router.get('/market', (req, res) => {
    viewAuctions(req, res);
});

router.get('/search', search);

export default router;