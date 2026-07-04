import express from 'express';
import { createBooking } from '../controllers/bookingController.js';

const router = express.Router();

// Booking karne ke liye POST request
router.post('/new', createBooking);

export default router;
