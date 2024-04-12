import mongoose from "mongoose";


const transactionSchema =  new mongoose.Schema({
    transactionID: String,
    auctionID: String,
    sellerID: String,
    bidderID: String,
    propertyID: String,
    amount: Number,
    transactionDate: Date,
    status: {
        type: String, 
        enum: ['PENDING', 'COMPLETED'], 
        default: 'PENDING'
    }
});

const Model = {
    transactionModel: mongoose.model('transaction', transactionSchema)
}

export default Model.transactionModel;