import Booking from '../models/Booking.js';
import Property from '../models/Property.js';

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

// Tenant ke Dashoard ke liye Bookings nikalna
export const getTenantBookings = async (req, res) => {
    try {
        const tenant_id = req.params.tenant_id;
        // Populate se hum property ki puri detail (image, title, etc) manga rahe hain
        const bookings = await Booking.find({ tenant_id }).populate('property_id').sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Tenant bookings laane me error aayi", error: error.message });
    }
};

// Owner ke Dashboard ke liye Bookings nikalna
export const getOwnerBookings = async (req, res) => {
    try {
        const owner_id = req.params.owner_id;
        
        // Step 1: Pehle is owner ke saare ghar dhoondo
        const properties = await Property.find({ owner_id });
        const propertyIds = properties.map(p => p._id);

        // Step 2: Ab in saare gharon par jo bhi bookings hain, unhe dhoondo
        const bookings = await Booking.find({ property_id: { $in: propertyIds } })
            .populate('property_id')
            .populate('tenant_id', 'name email phone') // Tenant ka naam/email bhi chahiye
            .sort({ createdAt: -1 });
        
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Owner bookings laane me error aayi", error: error.message });
    }
};
