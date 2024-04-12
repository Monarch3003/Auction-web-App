import {config} from 'dotenv';
config();

import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import schedule from 'node-schedule';
import path from 'path';

const __dirname = path.resolve();

import usersRouter from './routes/usersRoute.js';
import propertyRouter from './routes/propertyRoute.js';
import auctionsRouter from './routes/auctionRoute.js';
import bidRouter from './routes/bidRoute.js';
import dashboardRouter from './routes/dashboardRoute.js';
import transactionRouter from './routes/transactionRoute.js';

import { updateAuctionStatus } from './controller/dealBreaker.js';
import cfg from './config/cfg.js';

const app = express();

app.use('/soldAuctions', express.static(path.join(__dirname, 'soldAuctions')));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));
app.use(cfg.ensureAuthenticated);

app.use('/api/user', usersRouter);
app.use('/api/property', propertyRouter);
app.use('/api/auctions', auctionsRouter);
app.use('/api/bid', bidRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/transactions', transactionRouter);

//cron-auction job every minute
const job = schedule.scheduleJob('* * * * *', () => {
    updateAuctionStatus();
});

app.listen(process.env.PORT, () => {
    console.log(`Server Running on port ${process.env.PORT}`);
});