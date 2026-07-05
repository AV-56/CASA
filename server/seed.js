import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import Property from './models/Property.js';
import User from './models/User.js';

dotenv.config();

// Ye kuch sample image URLs hain Unsplash se jo hum download karke aapke uploads folder me save karenge
const houseImages = [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1510627489930-0c1b0bfb6785?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80'
];

// Helper function: Image internet se download karke save karne ke liye
const downloadImage = async (url, filename) => {
    const filePath = path.join(process.cwd(), 'uploads', filename);
    
    // Agar 'uploads' folder nahi hai toh bana do
    if (!fs.existsSync(path.join(process.cwd(), 'uploads'))) {
        fs.mkdirSync(path.join(process.cwd(), 'uploads'));
    }

    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });
        
        return new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`Image download fail ho gayi: ${url}`);
        // Fallback: Agar download fail ho jaye toh koi dummy path de do
    }
};

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ Database connected for Seeding to ${process.env.MONGO_URI}...`);

        // 1. Purana Data Khali Karo
        await Property.deleteMany();
        console.log('🧹 Purani properties delete ho gayi!');

        // 2. Ek dummy Owner dhoondhte hain ya naya banate hain
        let owner = await User.findOne({ role: 'owner' });
        if (!owner) {
            console.log('⚠️ Koi Owner account nahi mila! Ek naya dummy owner bana raha hu...');
            owner = await User.create({
                name: 'Casa Admin (Owner)',
                email: 'admin@casa.com',
                password: 'password123', // Demo ke liye raw
                role: 'owner'
            });
        }

        // 3. Images download karo (Wait for all)
        console.log('⏳ Images download ho rahi hain, please wait...');
        const imagePaths = [];
        for (let i = 0; i < houseImages.length; i++) {
            const filename = `seed-house-${i + 1}.jpg`;
            await downloadImage(houseImages[i], filename);
            imagePaths.push(`/uploads/${filename}`);
        }
        console.log('📸 Images successfully downloads aur uploads folder me save ho gayi!');

        // 4. Nayi Properties banao (Alag-alag location, price, aur amenities)
        const sampleProperties = [
            {
                title: 'Luxury Villa in South Delhi',
                description: 'Ekdum vip ilaake me shandaar villa. Yahan rani aur raja ki tarah raho!',
                price: 75000,
                location: 'Delhi',
                amenities: ['WiFi', 'AC', 'Parking', 'Pool'],
                thumbnail: imagePaths[0],
                images: [imagePaths[1], imagePaths[2]],
                owner_id: owner._id
            },
            {
                title: 'Cozy 2BHK Apartment',
                description: 'Family ke liye ekdum mast aur sasta flat near metro station.',
                price: 18000,
                location: 'Mumbai',
                amenities: ['WiFi', 'Security', 'Lift'],
                thumbnail: imagePaths[1],
                images: [imagePaths[0]],
                owner_id: owner._id
            },
            {
                title: 'Sea Facing Penthouse',
                description: 'Samundar ka nazaara balcony se. Ekdum premium feeling!',
                price: 150000,
                location: 'Mumbai',
                amenities: ['WiFi', 'AC', 'Gym', 'Pool', 'Parking'],
                thumbnail: imagePaths[2],
                images: [imagePaths[3]],
                owner_id: owner._id
            },
            {
                title: 'Student PG - Fully Furnished',
                description: 'Bachelors aur students ke liye sasta aur tikau jugaad.',
                price: 6000,
                location: 'Pune',
                amenities: ['WiFi', 'Food', 'Laundry'],
                thumbnail: imagePaths[3],
                images: [],
                owner_id: owner._id
            },
            {
                title: 'Independent House with Garden',
                description: 'Bada aangan aur garden wala ghar. Pets allowed hain!',
                price: 35000,
                location: 'Bangalore',
                amenities: ['Parking', 'Garden', 'WiFi'],
                thumbnail: imagePaths[4],
                images: [imagePaths[5]],
                owner_id: owner._id
            },
            {
                title: 'IT Park Studio Flat',
                description: 'Office ke paas rehte ho? Toh ye flat tumhare liye hai. Walk to work!',
                price: 22000,
                location: 'Bangalore',
                amenities: ['WiFi', 'AC', 'Security'],
                thumbnail: imagePaths[5],
                images: [imagePaths[4], imagePaths[0]],
                owner_id: owner._id
            }
        ];

        await Property.insertMany(sampleProperties);
        console.log('🎉 6 Nayi Properties database me add ho chuki hain! Maza aa gaya!');

        process.exit();
    } catch (error) {
        console.error('Error in Seeding:', error);
        process.exit(1);
    }
};

seedDatabase();
