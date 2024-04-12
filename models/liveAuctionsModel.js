import mongoose from 'mongoose';


const auctionSchema = new mongoose.Schema({
    auctionID: {
        type: String,
        required: true
    },

    owner: {
        type: String,
        required: true
    },

    initialPrice: Number,

    propertyID: String,

    startDate: {type:Date, default: Date.now},

    propertyName: String,

    status: {
        type: String,
        enum: ['OPEN', 'CLOSED'],
        default: 'OPEN'
    }

});


const Model = {
    auctionModel: mongoose.model('Auction',auctionSchema)
}

export default Model.auctionModel;