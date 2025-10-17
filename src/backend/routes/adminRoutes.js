import express from 'express';
import { createAdmin, loginAdmin, getAllAdmins } from '../controllers/adminController.js';
import { get } from 'mongoose';

const router = express.Router();

router.post('/create', createAdmin);
router.post('/login', loginAdmin);
router.get('/all', getAllAdmins);

export default router;