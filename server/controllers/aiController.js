import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

// 1. Gemini ka setup
// Dhyan rahe ki process.env.GEMINI_API_KEY .env me set honi chahiye
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MISSING_API_KEY');

export const generatePropertyDescription = async (req, res) => {
    try {
        const { title, price, location, amenities } = req.body;

        if (!process.env.GEMINI_API_KEY) {
             return res.status(500).json({ 
                message: "Bhai, Gemini ki API key .env me missing hai! Pehle key daalo.",
                description: "Gemini API key is not configured in the backend."
             });
        }

        // 2. Prompt banana (Jo hum AI ko bolenge likhne ke liye)
        const prompt = `
            Act as a professional real estate agent.
            Write an attractive, catchy, and professional property listing description in a mix of English and Hindi (Hinglish).
            It should be 3-4 sentences long. Do not use asterisks or markdown formatting.
            Make it sound very appealing to potential tenants.
            
            Property Details:
            - Title: ${title || 'A beautiful home'}
            - Location: ${location || 'Prime location'}
            - Rent Price: ₹${price || 'Affordable'}/month
            - Amenities: ${amenities || 'Many great facilities'}
            
            Description:
        `;

        // 3. Gemini se model maangna (gemini-flash-latest is fast and good for this)
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // 4. AI se generate karwana
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // 5. Frontend ko wapas bhejna
        res.status(200).json({ 
            message: "Magic Description generated successfully!", 
            description: responseText.trim()
        });
        
    } catch (error) {
        console.error("AI Generation Error:", error.message);
        res.status(500).json({ 
            message: "AI thak gaya hai, baad me try karein!", 
            error: error.message 
        });
    }
};
