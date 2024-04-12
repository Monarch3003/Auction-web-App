import express from 'express';

import {addProperty, viewProperties, deleteProperty, downloadProperty} from '../controller/propertyController.js';

const router = express.Router();

router.post('/upload',(req, res) => {
    // console.log(req.body)
    const {propertyName, propertyDescription} = req.body;
    addProperty(req, res, propertyName, propertyDescription);
    // next();
});

router.get('/removeProperty', (req, res) => {
    deleteProperty(req, res, req.body.propertyID);
});

router.get('/', (req, res) => {
    viewProperties(req, res);
});

router.get('/download/:propertyID', (req, res) => {
    const {propertyID} = req.params;
    downloadProperty(req, res, propertyID);
})

export default router;