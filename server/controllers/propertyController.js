import Property from '../models/Property.js';

// 1. Naya Makaan (Property) list karne ka logic
export const createProperty = async (req, res) => {
    try {
        const { title, description, price, location, amenities, owner_id } = req.body;
        // Check karna ki upload hui hai ya nahi (multiple ke liye req.files use hota hai)
        if (!req.files || !req.files.thumbnail) {
            return res.status(400).json({ message: "Bhai property ki main photo (thumbnail) toh daal do!" });
        }

        // Thumbnail ka path set karna
        const thumbnailPath = `/uploads/${req.files.thumbnail[0].filename}`;
        // Baaki images (gallery) ke paths ka array banana
        let imagesPaths = [];
        if (req.files.images) {
            imagesPaths = req.files.images.map(file => `/uploads/${file.filename}`);
        }
        const property = await Property.create({
            title, description, price, location, amenities, owner_id,
            thumbnail: thumbnailPath, // Main photo
            images: imagesPaths // Baki ki gallery photos
        });
        res.status(201).json({ message: "Makaan successfully list ho gaya!", property });
    } catch (error) {
        res.status(500).json({ message: "Property save nahi hui", error: error.message });
    }
};

// 2. Database se saare Makaan nikal kar lane ka logic (Homepage par dikhane ke liye)
export const getProperties = async (req, res) => {
    try {
        const { location, minPrice, maxPrice, amenities } = req.query;
        let query = {};

        // 1. Location Filter (Case Insensitive)
        if (location) {
            query.location = { $regex: location, $options: 'i' }; 
        }

        // 2. Price Filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // 3. Amenities Filter (Agar multiple hain toh comma-separated aayenge)
        if (amenities) {
            const amenitiesArray = amenities.split(',').map(a => a.trim());
            query.amenities = { $all: amenitiesArray }; // Makaan me saari requested amenities honi chahiye
        }

        const properties = await Property.find(query).sort({ createdAt: -1 }); // Nayi upar aayengi
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 3. Kisi ek specific Makaan ki detail nikalne ka logic
export const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: "Property nahi mili bhai!" });
        }
        res.status(200).json(property);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 4. Makaan par Naya Review add karne ka logic ⭐️
export const addPropertyReview = async (req, res) => {
    try {
        const { rating, comment, user_id, user_name } = req.body;
        const property = await Property.findById(req.params.id);
        if (property) {
            const alreadyReviewed = property.reviews.find(
                (r) => r.user.toString() === user_id.toString()
            );
            if (alreadyReviewed) {
                return res.status(400).json({ message: "Aap pehle hi is makaan par review de chuke hain!" });
            }
            const review = {
                name: user_name,
                rating: Number(rating),
                comment,
                user: user_id,
            };
            property.reviews.push(review);
            property.numReviews = property.reviews.length;

            // Average rating ka math
            property.averageRating = property.reviews.reduce((acc, item) => item.rating + acc, 0) / property.reviews.length;
            await property.save();
            res.status(201).json({ message: "Aapka Review add ho gaya!" });
        } else {
            res.status(404).json({ message: "Property hi nahi mili!" });
        }
    } catch (error) {
        res.status(500).json({ message: "Review save nahi hua", error: error.message });
    }
};

