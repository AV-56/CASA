import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Path variables for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/ai', aiRoutes);

// YAHAN HAI MAGIC: 'uploads' folder ko Frontend ke liye public khol diya! ✨
// Aapne ye copy karna miss kar diya tha, isiliye images nahi dikh rahi thi
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling middleware taaki Multer ka error user ko dikhe
app.use((err, req, res, next) => {
    if (err) {
        res.status(400).json({ message: err.message });
    }
});

// 🚀 PRODUCTION DEPLOYMENT: Serve React Frontend from Express
// Pehle check karte hain agar production me hai
if (process.env.NODE_ENV === 'production') {
    // 1. Vite ka build folder 'dist' ko public banate hain
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // 2. Agar koi bhi request (jo API nahi hai) aaye, toh seedha index.html bhej do
    // Isse React Router ki aapas ki link navigate ho payegi! (Express 5 fix: using regex /.*/)
    app.get(/.*/, (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
    });
} else {
    // Development mode ke liye default message
    app.get('/', (req, res) => {
        res.send("API is running...");
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});