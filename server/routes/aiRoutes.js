import express from 'express';
import { generatePropertyDescription } from '../controllers/aiController.js';

const router = express.Router();

// AI se magic description likhwane wala route
router.post('/generate-description', generatePropertyDescription);

export default router;
