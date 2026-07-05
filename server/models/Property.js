import mongoose from "mongoose";

// Ek naya chota sa structure sirf Reviews ke liye
const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true }, // Jisne review diya uska naam
    rating: { type: Number, required: true }, // 1 se 5 stars
    comment: { type: String, required: true } // Feedback
}, {
    timestamps: true
});

const propertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    amenities: [{ type: String }], // Array of strings jaise ki ['WiFi', 'AC', 'Food']
    // YAHAN AAYEGA MAGIC: Humne 4 naye fields add kar diye! ✨
    thumbnail: { type: String, required: true }, // Makaan ki main bahar wali photo
    images: [{ type: String }], // Andar dikhane ke liye baki photos ka array

    reviews: [reviewSchema], // Saare reviews ki ek list array
    averageRating: { type: Number, default: 0 }, // Total milakar average rating
    numReviews: { type: Number, default: 0 }, // Kitne logo ne review diya
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Yaad hai dbdiagram me line banayi thi? Ye wahi User table se link kar raha hai!
        required: true
    }
}, {
    timestamps: true
});

const Property = mongoose.model("Property", propertySchema);
export default Property;
