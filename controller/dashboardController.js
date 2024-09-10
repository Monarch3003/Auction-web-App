import mongoose from 'mongoose';

import cfg from '../config/cfg.js';

import transactionModel from '../models/transactionsModel.js';
import propertyModel from '../models/propertyModel.js'

const db = cfg.connectDB();
db.on('error', (err) => {
    console.log(err);
});


async function countProperty(userID) {
    let soldCount = 0;
    let boughtCount = 0

    try {
        const sold = await transactionModel.find({sellerID: userID}).select().exec();
        sold.forEach(doc => {
            soldCount = soldCount + 1;
        });

        const bought = await transactionModel.find({bidderID: userID}).select().exec();
        bought.forEach(doc => {
            boughtCount = boughtCount + 1;
        });

        return {soldCount, boughtCount};
    }catch(err) {
        console.log("Error fetching docs: ", err);
    }
}

async function get3properties(userID) {
    const properties = await propertyModel.find({userID: userID}).select().exec();
    return properties;
}

async function getRevenue(userID) {
    let rev = 0;

    const tx = await transactionModel.find({sellerID: userID}).select().exec();
    tx.forEach(t => {
        rev = rev + t.amount;
    });

    return rev;
}

async function renderDashboard(req, res) {
    
    const {email} = req.session;
    const uid = await cfg.userID(email);

    const properties = await get3properties(uid);
    const propertyCount = await countProperty(uid);
    const revenue = await getRevenue(uid);

    console.log(propertyCount);

    res.render('layout', {heading: 'Dashboard', route: 'dashboard', revenue: revenue, properties: properties, counts: propertyCount});
}

export {renderDashboard};