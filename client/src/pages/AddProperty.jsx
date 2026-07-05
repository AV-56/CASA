import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AddProperty = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Agar Kirayedar (tenant) is page pe galti se url daal kar aa jaye toh block kar do
    if (!user || user.role !== 'owner') {
        return <div className="p-20 text-center text-2xl text-casa-darkred font-bold">Bhai ye page sirf Makaan Maliko ke liye hai! 🛑</div>;
    }

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        amenities: ''
    });

    // PHOTOS KE LIYE NAYE STATES ✨
    const [thumbnail, setThumbnail] = useState(null);
    const [gallery, setGallery] = useState([]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleThumbnailChange = (e) => {
        setThumbnail(e.target.files[0]);
    };

    const handleGalleryChange = (e) => {
        setGallery(e.target.files); // Multiple files ko array me store karega
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!thumbnail) {
            alert("Bhai kam se kam ek main photo (thumbnail) toh daalo!");
            return;
        }

        try {
            // Jab photo bhejte hain, toh JSON ki jagah FormData use hota hai
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('location', formData.location);
            data.append('owner_id', user._id);

            // Amenities string ko alag alag items me array banakar append karna
            const amenitiesArray = formData.amenities.split(',').map(item => item.trim());
            amenitiesArray.forEach(item => {
                if (item) data.append('amenities', item);
            });

            // Photos append karna ✨
            data.append('thumbnail', thumbnail);

            for (let i = 0; i < gallery.length; i++) {
                data.append('images', gallery[i]);
            }

            // Headers me hum backend ko batate hain ki hum file bhej rahe hain (multipart/form-data)
            await axios.post('http://localhost:5000/api/properties/add', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('Badhai ho! Makaan photos ke sath list ho gaya 🎉');
            navigate('/');
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.message || 'Property add karne me error aayi!';
            alert(errorMsg);
        }
    };

    return (
        <div className="flex justify-center items-center py-10 px-4">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-casa-slate/20 w-full max-w-2xl">
                <h2 className="text-3xl font-bold text-casa-dark mb-6 text-center">List Your Property 🏠📸</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-casa-dark font-medium mb-1">Property Title</label>
                        <input type="text" name="title" value={formData.title} className="w-full border border-casa-slate/40 rounded-lg p-3 bg-casa-light/30 focus:outline-none focus:border-casa-red" onChange={handleChange} required placeholder="e.g. Luxury 2BHK in Bandra" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-casa-dark font-medium mb-1">Rent per month (₹)</label>
                            <input type="number" name="price" value={formData.price} className="w-full border border-casa-slate/40 rounded-lg p-3 bg-casa-light/30 focus:outline-none focus:border-casa-red" onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-casa-dark font-medium mb-1">Location</label>
                            <input type="text" name="location" value={formData.location} className="w-full border border-casa-slate/40 rounded-lg p-3 bg-casa-light/30 focus:outline-none focus:border-casa-red" onChange={handleChange} required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-casa-dark font-medium mb-1">Amenities (comma se alag karein)</label>
                        <input type="text" name="amenities" value={formData.amenities} className="w-full border border-casa-slate/40 rounded-lg p-3 bg-casa-light/30 focus:outline-none focus:border-casa-red" onChange={handleChange} required placeholder="WiFi, AC, Food, Laundry" />
                    </div>

                    {/* ✨ AI MAGIC BUTTON ✨ */}
                    <div className="bg-casa-dark/5 p-4 rounded-lg border border-casa-slate/20">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-casa-dark font-medium">Description</label>
                            <button 
                                type="button" 
                                onClick={async () => {
                                    if(!formData.title) return alert("Pehle thoda title toh likho bhai!");
                                    try {
                                        const res = await axios.post('http://localhost:5000/api/ai/generate-description', {
                                            title: formData.title,
                                            price: formData.price,
                                            location: formData.location,
                                            amenities: formData.amenities
                                        });
                                        setFormData({...formData, description: res.data.description});
                                    } catch (error) {
                                        alert("AI chutti par hai, manually likh lo ya API key check karo!");
                                    }
                                }}
                                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:shadow-lg transition-all"
                            >
                                ✨ Auto-Generate with AI
                            </button>
                        </div>
                        <textarea name="description" value={formData.description} rows="3" className="w-full border border-casa-slate/40 rounded-lg p-3 bg-white focus:outline-none focus:border-purple-500" onChange={handleChange} required placeholder="Property ke baare me achhi baatein likho, ya AI se likhwao..."></textarea>
                    </div>
                    {/* PHOTOS INPUTS - NAYA MAGIC! ✨ */}
                    <div className="bg-casa-light/50 p-4 rounded-lg border-2 border-dashed border-casa-slate/50 mt-4">
                        <div className="mb-4">
                            <label className="block text-casa-dark font-bold mb-1">📸 Main Photo (Thumbnail) *</label>
                            {/* accept="image/*" ka matlab sirf photos select hogi */}
                            <input type="file" accept="image/*" onChange={handleThumbnailChange} className="w-full text-sm text-casa-slate file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-casa-red file:text-white hover:file:bg-casa-darkred cursor-pointer" required />
                        </div>
                        <div>
                            <label className="block text-casa-dark font-bold mb-1">🖼️ Gallery Photos (Max 5)</label>
                            {/* multiple ka matlab ek se jyada photo select kar sakte hain */}
                            <input type="file" accept="image/*" multiple onChange={handleGalleryChange} className="w-full text-sm text-casa-slate file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-casa-slate file:text-white hover:file:bg-gray-600 cursor-pointer" />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-casa-red hover:bg-casa-darkred text-white font-bold py-3 rounded-lg transition-colors mt-6 shadow-sm text-lg">
                        Publish Listing With Photos
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProperty;
