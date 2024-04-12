import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
    propertyID: {
        type: String,
        required: true
    },

    userID: {
        type: String,
        required: true
    },

    propertyName: String,

    propertyDescription: String,

    origin: {
        type: String,
        enum: ['UPLOADED', 'BOUGHT']
    },

    samplePath: String,

    originalPath: String

});


const Model = {
    propertyModel: mongoose.model('Property',propertySchema)
}

export default Model.propertyModel;