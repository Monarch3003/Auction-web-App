import mongoose from "mongoose";

const approvalSchema = new mongoose.Schema({
    propertyID: {
        type: String,
        required: true
    },

    transactionID: String,

    seller: String,

    sellerApproved: Boolean,

    buyer: String,

    buyerApproved: Boolean,

    status: {type: String, enum: ['PENDING', 'COMPLETED'], default: 'PENDING'},

});

const Model = {
    approvalModel: mongoose.model('approval', approvalSchema)
}

export default Model.approvalModel;