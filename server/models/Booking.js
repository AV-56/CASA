import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    property_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property', // Ye Property table se jud raha hai
        required: true
    },
    tenant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Ye User (Tenant) table se jud raha hai
        required: true
    },
    check_in_date: { type: Date, required: true },
    check_out_date: { type: Date, required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'rejected'],
        default: 'pending'
    },
    // 👇---- Payment Gateway ki Fields ----👇
    payment_status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    transaction_id: {
        type: String // Jab user pay karega toh Razorpay/Stripe se jo digital raseed ki ID aayegi wo yahan save hogi
    },
    amount_paid: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
