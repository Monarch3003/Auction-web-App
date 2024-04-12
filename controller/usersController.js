import {config } from 'dotenv';
config();
import {v4 as uuidv4} from 'uuid';
import bcrypt, { hash } from 'bcrypt';

import cfg from '../config/cfg.js';


const db = cfg.connectDB();
db.on('error', (err) => {
    console.log(err);
});

import userModel from '../models/usersModel.js';


async function displayAccountDetails(req, res) {

    const {email} = req.session();
    const uid = await cfg.userID(email);
    const account = await userModel.findOne({userID: uid}).select().exec();

    res.render('layout', {heading: 'Account', route: 'account', account: account});
} 

async function signup (req,res) {
    
    const saltRounds = 10;
    const {FullName, user_email, phone_Number, user_password} = req.body;

    bcrypt.hash(user_password, saltRounds, async (err, hashed) => {
        const User = new userModel({
            userID: uuidv4(),
            fullName: FullName,
            email: user_email,
            phoneNumber: phone_Number,
            password: hashed
        });
    
        await User.save();
        req.session.email = user_email;
        res.render('success', {heading: 'Success', route: 'dashboard', message: 'Registration is successful, you can now login with your account details'});
    });

}

async function login(req, res) {
    const { email, password } = req.body;
    
    try {
        const user = await userModel.findOne({email: email});
        if(user) {
            // console.log(user);
            bcrypt.compare(password, user.password, (err, result) => {
                if(result === true) {
                    req.session.email = email; 
                    res.redirect('/api/dashboard');
                }else {
                    res.render('error', {heading: 'ERROR', route: 'error', message: 'Your Login Credentials are incorrect please try again!', error: true,});
                }
            });
        }
    } catch(err) {
        console.log(err);
    }
}

async function updatePassword (req,res){
    const saltRounds = 10;
    const {email} = req.session;
    const uid = cfg.userID(email);
    const {newPassword} = req.body;

    bcrypt.hash(newPassword, saltRounds, async (err, hash) => {

        await userModel.findOneAndUpdate({userID: uid}, {password: hash});
        res.render('updatePasswordSuccess', {heading: 'Success', route: 'dashboard', message: 'Password complete ,you can now login with your account details'})    
    });

    
}

function logout (req,res){
    // Clear session data
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            // Handle error appropriately
            return res.status(500).send('Error logging out');
        }
        // Redirect to login page or any other page after logout
        res.redirect('/login');
    });
}


export {signup, login, updatePassword, logout, displayAccountDetails};