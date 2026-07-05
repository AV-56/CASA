import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../utils/config';

const PropertyDetails = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewError, setReviewError] = useState('');

    const [mainImage, setMainImage] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);

    // --- Booking Dates & Modal ---
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [showBookingModal, setShowBookingModal] = useState(false);

    // Naya Magic: Dummy Loading State ⏳
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchProperty();
    }, [id]);

    const fetchProperty = () => {
        axios.get(`${API_BASE_URL}/api/properties/${id}`)
            .then(res => {
                setProperty(res.data);
                setMainImage(res.data.thumbnail);
                setGalleryImages(res.data.images || []);
            })
            .catch(err => console.error("Property laane me error:", err));
    };

    const handleBookingClick = () => {
        if (!user) {
            alert("Bhai pehle Login toh kar lo!");
            return navigate('/login');
        }
        if (user._id === property.owner_id) {
            alert("Makaan malik apna hi makaan thodi book karega bhai!");
            return;
        }
        setShowBookingModal(true);
    };

    // Dummy Payment Logic ✨
    const confirmBookingAndPay = async () => {
        if (!checkIn || !checkOut) return alert("Bhai Check-in aur Check-out dates select karo!");

        setIsProcessing(true); // Button ko 'Processing...' me badal do

        // 2 seconds ka dummy natak taaki asli jaisa feel aaye
        setTimeout(async () => {
            try {
                const verifyRes = await axios.post(`${API_BASE_URL}/api/bookings/verify-payment`, {
                    property_id: property._id,
                    tenant_id: user._id,
                    check_in_date: checkIn,
                    check_out_date: checkOut,
                    amount_paid: property.price
                });

                alert(verifyRes.data.message); // Success
                setShowBookingModal(false);
            } catch (err) {
                alert("Booking server me save nahi ho paayi! Error: " + (err.response?.data?.message || err.message));
            } finally {
                setIsProcessing(false); // Loading band kar do
            }
        }, 2000);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) return navigate('/login');
        try {
            await axios.post(`${API_BASE_URL}/api/properties/${id}/reviews`, { rating, comment, user_id: user._id, user_name: user.name });
            alert('Aapka review add ho gaya! 🌟');
            setComment('');
            fetchProperty();
        } catch (error) {
            setReviewError(error.response?.data?.message || 'Review add karne me error');
        }
    };

    const handleImageSwap = (index) => {
        const clickedImage = galleryImages[index];
        const newGallery = [...galleryImages];
        newGallery[index] = mainImage;
        setMainImage(clickedImage);
        setGalleryImages(newGallery);
    };

    if (!property) return <div className="text-center p-20 text-xl font-bold text-casa-dark flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-casa-red mr-3"></div>Loading Makaan Details...</div>;

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl relative">

            {/* --- Booking Modal Popup --- */}
            {showBookingModal && (
                <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full relative border border-casa-slate/20">
                        {!isProcessing && (
                            <button onClick={() => setShowBookingModal(false)} className="absolute top-4 right-4 text-casa-slate hover:text-casa-red font-bold text-xl">X</button>
                        )}
                        <h2 className="text-2xl font-bold mb-6 text-casa-dark text-center">Select Booking Dates</h2>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block mb-1 font-medium text-casa-dark">Check-in Date</label>
                                <input type="date" disabled={isProcessing} className="w-full border border-casa-slate/40 p-3 rounded-lg bg-casa-light/30 focus:outline-none focus:border-casa-red"
                                    value={checkIn} onChange={e => setCheckIn(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium text-casa-dark">Check-out Date</label>
                                <input type="date" disabled={isProcessing} className="w-full border border-casa-slate/40 p-3 rounded-lg bg-casa-light/30 focus:outline-none focus:border-casa-red"
                                    value={checkOut} onChange={e => setCheckOut(e.target.value)} min={checkIn || new Date().toISOString().split('T')[0]} />
                            </div>
                        </div>

                        <button onClick={confirmBookingAndPay} disabled={isProcessing} className={`w-full text-white py-4 rounded-xl font-bold text-lg shadow-md flex items-center justify-center ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-casa-red hover:bg-casa-darkred transition-transform active:scale-95'}`}>
                            {isProcessing ? "Processing Payment... ⏳" : `Pay ₹${property.price} to Confirm`}
                        </button>
                        <p className="text-center text-xs text-casa-slate mt-3">Mock Secure System 🔒</p>
                    </div>
                </div>
            )}

            {/* --- UPPER SECTION: PROPERTY INFO & GALLERY --- */}
            <div className="bg-white rounded-xl shadow-lg border border-casa-slate/20 overflow-hidden mb-10 flex flex-col md:flex-row">

                <div className="md:w-1/2 p-4 flex flex-col">
                    {mainImage && (
                        <img src={`${API_BASE_URL}${mainImage}`} alt="Main" className="w-full h-80 object-cover rounded-lg shadow-sm mb-4 bg-casa-slate/20 transition-all duration-300 ease-in-out" />
                    )}
                    {galleryImages && galleryImages.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                            {galleryImages.map((img, index) => (
                                <img key={index} src={`${API_BASE_URL}${img}`} alt="Gallery" onClick={() => handleImageSwap(index)} className="w-full h-20 object-cover rounded shadow-sm hover:opacity-75 hover:scale-105 transition-all duration-200 cursor-pointer bg-casa-slate/20 border-2 border-transparent hover:border-casa-red" />
                            ))}
                        </div>
                    )}
                </div>

                <div className="md:w-1/2 p-8 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <h1 className="text-3xl font-extrabold text-casa-dark">{property.title}</h1>
                        <div className="flex items-center text-yellow-500 font-bold bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                            <span className="mr-1">⭐</span> {property.averageRating > 0 ? property.averageRating.toFixed(1) : "New"}
                        </div>
                    </div>

                    <p className="text-casa-slate mb-6 flex items-center text-lg"><span className="mr-2">📍</span> {property.location}</p>

                    <div className="bg-casa-light/50 p-6 rounded-lg mb-6 border border-casa-slate/20 shadow-inner">
                        <p className="text-4xl font-bold text-casa-darkred">₹{property.price}<span className="text-lg text-casa-slate font-normal"> / month</span></p>
                    </div>

                    <div className="mb-6 flex-1">
                        <h3 className="font-bold text-casa-dark text-xl mb-2">Description</h3>
                        <p className="text-casa-slate leading-relaxed text-lg">{property.description}</p>
                    </div>

                    <div className="mb-8">
                        <h3 className="font-bold text-casa-dark text-xl mb-3">Amenities</h3>
                        <div className="flex flex-wrap gap-2">
                            {property.amenities.map((item, index) => (
                                <span key={index} className="bg-casa-dark text-casa-light px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">{item}</span>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto">
                        <button onClick={handleBookingClick} className="w-full bg-casa-red hover:bg-casa-darkred text-white font-bold py-4 rounded-xl transition-transform active:scale-95 shadow-md text-xl">
                            Book This Property Now
                        </button>
                    </div>
                </div>
            </div>

            {/* --- LOWER SECTION: REVIEWS WALA MAGIC ⭐️ --- */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-casa-slate/20">
                <h2 className="text-2xl font-bold text-casa-dark mb-6 border-b pb-4">Guest Reviews ({property.numReviews})</h2>
                {property.reviews.length === 0 ? (
                    <p className="text-casa-slate mb-8 italic text-lg">Abhi tak kisi ne review nahi diya. Aap pehle ban sakte ho!</p>
                ) : (
                    <div className="space-y-6 mb-10">
                        {property.reviews.map((review, index) => (
                            <div key={index} className="bg-casa-light/30 p-5 rounded-lg border border-casa-slate/20">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold text-casa-dark text-lg">{review.name}</h4>
                                    <div className="text-yellow-500 font-bold">{'⭐'.repeat(review.rating)}</div>
                                </div>
                                <p className="text-casa-slate">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                )}
                {user && user.role !== 'owner' && (
                    <div className="bg-casa-light p-6 rounded-lg border border-casa-slate/20">
                        <h3 className="font-bold text-casa-dark text-lg mb-4">Write a Review</h3>
                        {reviewError && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm font-bold">{reviewError}</div>}
                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                            <div>
                                <label className="block text-casa-dark font-medium mb-1">Rating</label>
                                <select className="w-full md:w-1/3 border border-casa-slate/40 rounded-lg p-3 bg-white focus:outline-none focus:border-casa-red" value={rating} onChange={(e) => setRating(e.target.value)}>
                                    <option value="5">5 - Excellent (⭐⭐⭐⭐⭐)</option>
                                    <option value="4">4 - Very Good (⭐⭐⭐⭐)</option>
                                    <option value="3">3 - Good (⭐⭐⭐)</option>
                                    <option value="2">2 - Fair (⭐⭐)</option>
                                    <option value="1">1 - Poor (⭐)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-casa-dark font-medium mb-1">Comment</label>
                                <textarea className="w-full border border-casa-slate/40 rounded-lg p-3 bg-white focus:outline-none focus:border-casa-red" rows="3" required placeholder="Aapko ye property kaisi lagi?" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                            </div>
                            <button type="submit" className="bg-casa-dark hover:bg-black text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-sm">Submit Review</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PropertyDetails;
