import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [myBookings, setMyBookings] = useState([]);
    const [receivedBookings, setReceivedBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchBookings = async () => {
            try {
                // Har user (chahe Tenant ho ya Owner) apni khud ki ki gayi bookings dekh sakta hai
                const myRes = await axios.get(`http://localhost:5000/api/bookings/tenant/${user._id}`);
                setMyBookings(myRes.data);

                // Agar user Owner hai, toh use doosro dwara ki gayi bookings (Received) bhi dikhani hain
                if (user.role === 'owner') {
                    const recRes = await axios.get(`http://localhost:5000/api/bookings/owner/${user._id}`);
                    setReceivedBookings(recRes.data);
                }
            } catch (error) {
                console.error("Dashboard data laane me error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user, navigate]);

    if (!user) return null; // Early return taaki render ke dauran error na aaye jab logout ho raha ho

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-casa-dark text-xl font-bold">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-casa-red mr-3"></div>
                Loading Dashboard...
            </div>
        );
    }

    // Ek chota sa component banate hain taaki code repeat na ho
    const BookingList = ({ bookings, isReceived }) => {
        if (bookings.length === 0) {
            return (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-casa-slate/20 text-center mb-10">
                    <p className="text-casa-slate text-lg italic">
                        {isReceived
                            ? "Aapki properties par abhi tak koi booking nahi aayi hai."
                            : "Aapne abhi tak koi property book nahi ki hai."}
                    </p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {bookings.map((booking) => (
                    <div key={booking._id} className="bg-white rounded-xl shadow-md border border-casa-slate/20 overflow-hidden flex flex-col md:flex-row transition-transform hover:-translate-y-1 hover:shadow-lg">

                        <div className="md:w-2/5 h-48 md:h-auto bg-casa-light relative">
                            {booking.property_id && booking.property_id.thumbnail ? (
                                <img src={`http://localhost:5000${booking.property_id.thumbnail}`} alt="Property" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-casa-slate italic">No Image</div>
                            )}
                            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
                                Confirmed
                            </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold text-casa-dark mb-1">
                                {booking.property_id ? booking.property_id.title : 'Property Deleted'}
                            </h3>
                            <p className="text-casa-slate text-sm mb-4"><span className="mr-1">📍</span> {booking.property_id ? booking.property_id.location : 'N/A'}</p>

                            {isReceived && booking.tenant_id && (
                                <div className="bg-blue-50 border border-blue-100 p-2 rounded-lg mb-3">
                                    <p className="text-sm font-semibold text-blue-800">👤 Booked By: {booking.tenant_id.name}</p>
                                </div>
                            )}

                            <div className="flex justify-between text-sm text-casa-dark mb-2">
                                <div><span className="font-semibold text-casa-slate">Check-in:</span><br /> {new Date(booking.check_in_date).toLocaleDateString()}</div>
                                <div className="text-right"><span className="font-semibold text-casa-slate">Check-out:</span><br /> {new Date(booking.check_out_date).toLocaleDateString()}</div>
                            </div>

                            <div className="mt-auto pt-4 border-t border-casa-slate/10 flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-casa-slate uppercase font-bold tracking-wider mb-0.5">Amount Paid</p>
                                    <p className="text-xl font-extrabold text-casa-darkred">₹{booking.amount_paid}</p>
                                </div>
                                <div className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-sm font-bold border border-green-200">
                                    Payment ✅
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            {user.role === 'owner' && (
                <>
                    <h1 className="text-3xl font-extrabold text-casa-dark mb-6 border-b pb-4">Received Bookings (On My Properties)</h1>
                    <BookingList bookings={receivedBookings} isReceived={true} />
                </>
            )}

            <h1 className="text-3xl font-extrabold text-casa-dark mb-6 border-b pb-4">
                {user.role === 'owner' ? 'My Bookings (Properties I Booked)' : 'My Bookings'}
            </h1>
            <BookingList bookings={myBookings} isReceived={false} />
        </div>
    );
};

export default Dashboard;
