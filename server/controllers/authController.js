import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// User Registration ka ashiqua (Logic)
export const registerUser = async (req, res) => {
    try {
        // 1. Frontend se aane wala data receive karna
        const { name, email, password, role } = req.body;

        // 2. Check karna ki user pehle se exist toh nahi karta
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Bhai ye email pehle se registered hai!" });
        }

        // 3. Password ko encrypt (hash) karna taaki DB me safe rahe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Naya User Database me create karna
        const user = await User.create({
            name,
            email,
            password: hashedPassword, // Hamesha hash wala password save karna chahiye
            role
        });

        // 5. Agar user ban gaya, toh success message bhejna
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                message: "Badhai ho! Naya user successfully register ho gaya 🎉"
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Server me kuch gadbad hai", error: error.message });
    }
};



// User Login ka Logic
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check karo ki is email ka user database me hai bhi ya nahi
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Bhai is email se koi account nahi hai!" });
        }

        // 2. Check karo ki password sahi hai ya galat (bcrypt dono ko compare karega)
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Galat password daala hai aapne!" });
        }

        // 3. Agar email/pass dono sahi hain, toh usko ek 'Ticket' (JWT Token) de do
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d' // Ye ticket 30 din tak chalegi
        });

        // 4. Success hone par Response bhej do
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: token,
            message: "Login Successful! Welcome back 🎉"
        });

    } catch (error) {
        res.status(500).json({ message: "Server me kuch gadbad hai", error: error.message });
    }
};

