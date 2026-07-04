import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// Jab bhi bahar se koi '/register' URL par aayega, toh registerUser wala logic chalega
router.post('/register', registerUser);

// NAYA: Login ke liye ek naya raasta bana diya
router.post('/login', loginUser);

export default router;
