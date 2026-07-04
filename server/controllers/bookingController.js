import Booking from '../models/Booking.js';

// Nayi Booking create karne ka logic
export const createBooking = async (req, res) => {
    try {
        const { property_id, tenant_id, check_in_date, check_out_date, amount_paid } = req.body;

        const booking = await Booking.create({
            property_id,
            tenant_id,
            check_in_date,
            check_out_date,
            amount_paid
        });

        res.status(201).json({ message: "Badhai ho! Makaan book ho gaya 🎉", booking });
    } catch (error) {
        res.status(500).json({ message: "Booking fail ho gayi", error: error.message });
    }
};
