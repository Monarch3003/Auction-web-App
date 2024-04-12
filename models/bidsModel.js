import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
    auctionID: {
        type: String,
        required: true
    },

    bidCount: Number,

    currentBidPrice: Number,

    currentBidder: String
});


const Model = {
    bidModel: mongoose.model('bid',bidSchema)
}

export default Model.bidModel;