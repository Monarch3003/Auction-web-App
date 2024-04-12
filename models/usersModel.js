import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import findOrCreate from 'mongoose-findorcreate';
import bcrypt from'bcrypt';

const userSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        index: true,
        unique: true
    },

    fullName: String,
        
    email: String,

    phoneNumber: Number,

    password: String
});

// userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(findOrCreate);


const Model = {
    userModel: mongoose.model('user', userSchema)
}

export default Model.userModel;