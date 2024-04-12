import mongoose from 'mongoose';
import {v4 as uuidv4} from 'uuid';
import cfg from '../config/cfg.js'
import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

import propertyModel from '../models/propertyModel.js'

const db = cfg.connectDB();
db.on('error', (err) => {
    console.log(err);
});

async function viewProperties(req, res) {
    const { email } = req.session;
    const uid = await cfg.userID(email);
    const properties = await propertyModel.find({userID: uid}).select().exec();

    res.render('layout', {heading: 'Property', route: 'property', properties: properties, active: true});
}

async function addProperty(req, res, name, description) {
    // console.log(req.session);
    const { email } = req.session;
    // console.log(email);
    const uid = await cfg.userID(email);
    const property = new propertyModel({
        propertyID: uuidv4(),
        userID: uid,
        propertyName: name,
        propertyDescription: description,
        origin: 'UPLOADED'
    });

    await property.save();
    res.redirect('/api/property');
    // mongoose.connection.close();
}

async function deleteProperty(req, res, propID) {
    await propertyModel.deleteOne({propertyID: propID});
}

async function downloadProperty(req, res, propertyID) {

    //find path from database
    const property = await propertyModel.findOne({propertyID: propertyID}).select().exec();

    //construct the fullPath
    const propertyPath = property.originalPath;
    const fullPath = path.join(__dirname, propertyPath)

    // console.log(fullPath);

    fs.access(fullPath, fs.constants.F_OK, (err) => {
        if(err) {
            res.render('txError', {message: "ERROR 404: File Not Found"});
        }

        res.download(fullPath);
    });
}

export {addProperty, viewProperties, deleteProperty, downloadProperty};