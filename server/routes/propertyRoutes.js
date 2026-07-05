import express from 'express';
import { createProperty, getProperties, getPropertyById, addPropertyReview } from '../controllers/propertyController.js';
import upload from '../middleware/upload.js';
const router = express.Router();

// Naya makaan add karne ke liye POST request
router.post('/add', upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 5 }
]), createProperty);

// Saare makaan dekhne ke liye GET request (Kyunki hum data maang rahe hain, de nahi rahe)
router.get('/all', getProperties);

// Kisi specific makaan ka detail nikalne ka route
router.get('/:id', getPropertyById);

// Review aur Rating add karne ke liye naya route 
router.post('/:id/reviews', addPropertyReview);

export default router;
