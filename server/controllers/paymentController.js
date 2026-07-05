import Booking from '../models/Booking.js';

// Dummy Order Create
export const createOrder = async (req, res) => {
    res.status(200).json({ id: `dummy_order_${Date.now()}`, amount: req.body.amount * 100 });
};

// Dummy Payment Verify aur Database Save (Bina kisi Razorpay key ke)
export const verifyPayment = async (req, res) => {
    try {
        const { property_id, tenant_id, check_in_date, check_out_date, amount_paid } = req.body;

        // Direct Booking save kar lo
        const booking = await Booking.create({
            property_id,
            tenant_id,
            check_in_date,
            check_out_date,
            amount_paid,
            status: 'confirmed',
            payment_status: 'completed', // Dummy completed
            transaction_id: `txn_dummy_${Date.now()}`
        });

        res.status(200).json({ message: "Dummy Payment successful aur Booking confirm ho gayi! 🎉", booking });
    } catch (error) {
        res.status(500).json({ message: "Booking confirm karne me error aayi", error: error.message });
    }
};
