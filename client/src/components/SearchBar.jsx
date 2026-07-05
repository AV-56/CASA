import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [location, setLocation] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    
    const commonAmenities = ['WiFi', 'AC', 'Parking', 'Pool', 'Security', 'Lift', 'Laundry'];
    const [selectedAmenities, setSelectedAmenities] = useState([]);

    const toggleAmenity = (amenity) => {
        if (selectedAmenities.includes(amenity)) {
            setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
        } else {
            setSelectedAmenities([...selectedAmenities, amenity]);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch({ 
            location, 
            minPrice, 
            maxPrice, 
            amenities: selectedAmenities.join(',') 
        });
    };

    const clearFilters = () => {
        setLocation('');
        setMinPrice('');
        setMaxPrice('');
        setSelectedAmenities([]);
        onSearch({}); // Reset search
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-casa-slate/20 mb-10 mt-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-casa-red/5 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none"></div>
            
            <h2 className="text-2xl font-bold text-casa-dark mb-5">Find your perfect home 🔍</h2>
            
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-5">
                <div className="flex-1">
                    <label className="block text-sm font-semibold text-casa-slate mb-1">Where do you want to live?</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Mumbai, Delhi, Bangalore" 
                        className="w-full border-2 border-casa-slate/20 p-3 rounded-xl focus:outline-none focus:border-casa-red bg-casa-light/50 transition-colors"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>
                
                <div className="flex gap-4">
                    <div className="w-full md:w-32">
                        <label className="block text-sm font-semibold text-casa-slate mb-1">Min Price (₹)</label>
                        <input 
                            type="number" 
                            placeholder="0" 
                            className="w-full border-2 border-casa-slate/20 p-3 rounded-xl focus:outline-none focus:border-casa-red bg-casa-light/50 transition-colors"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-32">
                        <label className="block text-sm font-semibold text-casa-slate mb-1">Max Price (₹)</label>
                        <input 
                            type="number" 
                            placeholder="Max" 
                            className="w-full border-2 border-casa-slate/20 p-3 rounded-xl focus:outline-none focus:border-casa-red bg-casa-light/50 transition-colors"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="flex items-end gap-2 mt-2 md:mt-0">
                    <button type="submit" className="bg-casa-red hover:bg-casa-darkred text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md active:scale-95 h-[52px]">
                        Search
                    </button>
                    <button type="button" onClick={clearFilters} className="bg-casa-light hover:bg-casa-slate/20 text-casa-dark font-bold py-3 px-4 rounded-xl transition-colors border border-casa-slate/30 h-[52px]">
                        Reset
                    </button>
                </div>
            </form>

            <div className="pt-4 border-t border-casa-slate/10">
                <label className="block text-sm font-semibold text-casa-slate mb-3">Popular Amenities</label>
                <div className="flex flex-wrap gap-2">
                    {commonAmenities.map(amenity => (
                        <button
                            key={amenity}
                            type="button"
                            onClick={() => toggleAmenity(amenity)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                                selectedAmenities.includes(amenity) 
                                    ? 'bg-casa-dark text-white border-casa-dark shadow-md scale-105' 
                                    : 'bg-white text-casa-slate border-casa-slate/40 hover:border-casa-dark hover:text-casa-dark hover:shadow-sm'
                            }`}
                        >
                            {selectedAmenities.includes(amenity) ? '✓ ' : '+ '}{amenity}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
