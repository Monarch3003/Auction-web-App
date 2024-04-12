
import cfg from "../config/cfg.js";

import approvalsModel from "../models/approvalsModel.js";
import {updateTxStatus} from '../controller/transactionController.js';

cfg.connectDB().on('error', (err) => {
    console.log(err);
});



async function updateApprovalStatus(txID) {
    const approvals = await approvalsModel.find({transactionID: txID}).select().exec();
    approvals.forEach(async approval => {
        if(approval.buyerApproved == true && approval.sellerApproved == true ) {
            await approvalsModel.updateOne({transactionID: txID}, {status: 'COMPLETED'});
            await updateTxStatus(txID);
        }
    });
}

async function buyerApprove(txID) {
    await approvalsModel.updateOne({transactionID: txID}, {buyerApproved: true});
}

async function sellerApprove(txID) {
    await approvalsModel.updateOne({transactionID: txID},{sellerApproved: true});
}

async function createApproval (details) {
    const {propertyID, seller, buyer, transactionID, buyerApproved, sellerApproved} = details;
    const approval = new approvalsModel({
        transactionID: transactionID,
        propertyID: propertyID,
        seller: seller,
        buyer: buyer,
        buyerApproved: false,
        sellerApproved: false
    });

    approval.save();
}


export {buyerApprove, sellerApprove, createApproval, updateApprovalStatus};