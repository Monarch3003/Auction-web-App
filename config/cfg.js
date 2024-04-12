import { config } from 'dotenv';
config();
import mongoose from 'mongoose';
import userModel from '../models/usersModel.js';
import liveAuctionsModel from '../models/liveAuctionsModel.js';


const cfg = {
    connectDB: () => {
        mongoose.connect(process.env.DBHOST);
        return mongoose.connection;
    },
    userID: async (e_mail) => {
        const uid = await userModel.findOne({email: e_mail}).exec();
        // console.log(uid);
        const userID = uid.userID
        return userID;
    },
    // Middleware to check if the user is authenticated
    ensureAuthenticated: (req, res, next) => {
        // Allow access to signup and login routes
        if (req.path === '/api/user/signup' || req.path === '/api/user/login') {
            return next();
        }

        // Check if user is authenticated
        if (req.session && req.session.email) {
            return next();
        }

        // If user is not authenticated, redirect to login page
        res.redirect('/api/user/login');
    },

   
}

export default cfg;