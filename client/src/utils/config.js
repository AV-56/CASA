// Yahan hum decide kar rahe hain ki API kahan call karni hai
// Agar Vite me VITE_API_URL set hai (jaise Render pe), toh wo use hoga
// Warna by default localhost:5000 (local testing ke liye) use hoga

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
