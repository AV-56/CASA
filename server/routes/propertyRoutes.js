import express from 'express';
import { createProperty, getProperties } from '../controllers/propertyController.js';

const router = express.Router();

// Naya makaan add karne ke liye POST request
router.post('/add', createProperty);

// Saare makaan dekhne ke liye GET request (Kyunki hum data maang rahe hain, de nahi rahe)
router.get('/all', getProperties);

export default router;
