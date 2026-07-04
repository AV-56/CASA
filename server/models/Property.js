import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    amenities: [{ type: String }], // Array of strings jaise ki ['WiFi', 'AC', 'Food']
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
