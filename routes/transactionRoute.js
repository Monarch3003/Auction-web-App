import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import propertyModel from '../models/propertyModel.js';
import transactionsModel from '../models/transactionsModel.js';

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // console.log(req);
        const destinationFolder = path.join('soldAuctions/', req.session.verifyTxID);
        // console.log(destinationFolder);
        // Create the folder if it doesn't exist
        fs.mkdirSync(destinationFolder, { recursive: true });

        cb(null, destinationFolder);
    },
    filename: async function (req, file, cb) {

        const {verifyTxID} = req.session;

        // Get the original filename
        const uniqueName = Date.now() + '-' + file.originalname;

        //get file path
        const filePath = path.join('soldAuctions/', verifyTxID, uniqueName);

        //find propertyID
        const tx = await transactionsModel.findOne({transactionID: verifyTxID}).select().exec();

        //save filepath to database
        await propertyModel.updateOne({propertyID: tx.propertyID},{originalPath: filePath});


        // Use the original filename for the uploaded file
        cb(null, uniqueName);
    }
})

const upload = multer({storage: storage})


import { viewTransaction, makeTransaction, verifyTransaction, viewAllTransaction } from '../controller/transactionController.js';
import cfg from '../config/cfg.js';


const router = express.Router();


router.get('/all', async (req, res) => {
    const {email} = req.session;
    const uid = await cfg.userID(email);
    viewAllTransaction(req, res, uid);
});

router.get('/', async (req, res) => {
    const {email} = req.session;
    const {transactionID} = req.query;
    const uid = await cfg.userID(email);
    viewTransaction(req, res, uid, transactionID);
});

router.get('/makeTransaction/:txID', (req, res) => {
    const {txID} = req.params;
    req.session.makeTxID = txID;
    res.render('makeTransaction', {heading: 'Transactions'});
});

router.get('/verifyTransaction/:txID', (req, res) => {
    const {txID} = req.params;
    req.session.verifyTxID = txID;
    res.render('verifyTransaction', {heading: 'Transactions'});
});

router.post('/complete', async (req, res) => {
    // console.log(transactionID);
    const {makeTxID} = req.session;
    await makeTransaction(req, res, makeTxID);
});

router.post('/verify', upload.single('file'), async (req, res) => {
    const {verifyTxID} = req.session;
    await verifyTransaction(req, res, verifyTxID);
    
});

export default router;