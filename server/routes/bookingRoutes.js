import express from 'express';
import { createBooking, getTenantBookings, getOwnerBookings } from '../controllers/bookingController.js';
import { verifyPayment } from '../controllers/paymentController.js';

const router = express.Router();

// Purana normal booking route
router.post('/new', createBooking);

// Naya Dummy Payment route 💸
router.post('/verify-payment', verifyPayment);

// Dashboard routes 📊
router.get('/tenant/:tenant_id', getTenantBookings);
router.get('/owner/:owner_id', getOwnerBookings);

export default router;
