import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Naya search function
  const fetchProperties = (searchParams = {}) => {
    setLoading(true);
    // Convert object to query string (jaise ?location=Delhi&minPrice=5000)
    const queryString = new URLSearchParams(searchParams).toString();
    
    axios.get(`http://localhost:5000/api/properties/all?${queryString}`)
      .then((response) => {
        setProperties(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching properties", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProperties(); // Pehli baar bina filter ke saari properties layega
  }, []);

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      
      {/* Search Bar Component */}
      <SearchBar onSearch={fetchProperties} />

      <div className="flex justify-between items-end mb-8 border-b border-casa-slate/20 pb-4">
        <h1 className="text-3xl font-extrabold text-casa-dark border-l-4 border-casa-red pl-4">
          {properties.length > 0 ? 'Featured Properties' : 'No Properties Found'}
        </h1>
        {properties.length > 0 && (
          <span className="text-casa-slate font-medium bg-casa-light px-3 py-1 rounded-full text-sm">
            {properties.length} Results
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-casa-red"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <div key={property._id} className="bg-white rounded-xl overflow-hidden hover:-translate-y-1 transition-transform duration-300 border border-casa-slate/30 shadow-sm hover:shadow-lg flex flex-col">

              {/* ASLI PHOTO YAHAN DIKHEGI ✨ */}
              <div className="h-56 bg-casa-slate/20 flex items-center justify-center relative overflow-hidden">
                {property.thumbnail ? (
                  <img
                    src={`http://localhost:5000${property.thumbnail}`}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-casa-slate text-6xl">🏠</span>
                )}

                <div className="absolute top-4 right-4 bg-casa-red text-white text-xs font-bold px-3 py-1 rounded shadow-sm">
                  FOR RENT
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h2 className="text-xl font-bold text-casa-dark leading-tight">{property.title}</h2>
                  <span className="text-casa-darkred font-bold text-lg whitespace-nowrap">
                    ₹{property.price}<span className="text-sm font-normal text-casa-slate">/mo</span>
                  </span>
                </div>

                <div className="flex items-center text-casa-slate text-sm mb-4 font-medium justify-between">
                  <div><span className="mr-1.5">📍</span> {property.location}</div>

                  {/* STAR RATING ✨ */}
                  <div className="flex items-center text-yellow-500 font-bold bg-yellow-50 px-2 py-0.5 rounded border border-yellow-200">
                    <span className="mr-1">⭐</span>
                    {property.averageRating > 0 ? property.averageRating.toFixed(1) : "New"}
                    <span className="text-casa-slate text-xs ml-1 font-normal">({property.numReviews})</span>
                  </div>
                </div>

                <p className="text-casa-dark/80 text-sm mb-6 line-clamp-2 flex-1">{property.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {property.amenities.map((amenity, index) => (
                    <span key={index} className="bg-casa-light text-casa-dark text-xs px-2.5 py-1 rounded border border-casa-slate/20 font-medium">
                      {amenity}
                    </span>
                  ))}
                </div>

                <Link to={`/property/${property._id}`} className="mt-4 block text-center w-full bg-casa-red hover:bg-casa-darkred text-white font-bold py-2.5 px-3.5 rounded-xl transition-all shadow-md active:scale-95">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
