import express from 'express'
import { renderDashboard } from '../controller/dashboardController.js';

const router = express.Router();

router.get('/', renderDashboard);

export default router;