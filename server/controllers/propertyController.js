import Property from '../models/Property.js';

// 1. Naya Makaan (Property) list karne ka logic
export const createProperty = async (req, res) => {
    try {
        const { title, description, price, location, amenities, owner_id } = req.body;

        const property = await Property.create({
            title, description, price, location, amenities, owner_id
        });

        res.status(201).json({ message: "Makaan successfully list ho gaya!", property });
    } catch (error) {
        res.status(500).json({ message: "Property save nahi hui", error: error.message });
    }
};

// 2. Database se saare Makaan nikal kar lane ka logic (Homepage par dikhane ke liye)
export const getProperties = async (req, res) => {
    try {
        const properties = await Property.find();
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
