import express, { Router } from 'express';

import {signup, login, updatePassword, displayAccountDetails,logout} from '../controller/usersController.js';

const router = express.Router();

router.get('/signup',(req, res) => {
    res.render('signup', {heading: 'Signup'});
});
router.post('/signup', signup);

router.get('/login', (req, res) => {
    res.render('login', {heading: 'Login'});
})
router.post('/login', login); 

router.get('/account', displayAccountDetails)

router.patch('/update', updatePassword);


router.get('/logout', logout);

export default router;
