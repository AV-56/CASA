import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  // Context ke dimaag se user ka data aur logout function nikala
  const { user, logout } = useAuth();

  return (
    <nav className="bg-casa-dark p-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">

        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="Casa Logo" className="h-16 w-auto object-contain hover:opacity-80 transition-opacity" />
        </Link>

        <div className="space-x-6 flex items-center">
          {/* Yahan magic ho raha hai! 👇 */}
          {user ? (
            <>
              <span className="text-casa-light font-semibold hidden md:inline-block">
                Hi, <span className="text-casa-red">{user.name}</span>
              </span>
              <Link to="/dashboard" className="text-casa-light hover:text-white font-medium px-2 transition-colors">
                Dashboard
              </Link>
              {/* Agar user owner hai, toh use naya property add karne ka option do */}
              {user.role === 'owner' && (
                <Link to="/add-property" className="text-casa-red hover:text-casa-darkred font-bold px-4 transition-colors">
                  + Add Property
                </Link>
              )}

              <button
                onClick={logout}
                className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-md font-medium transition-colors border border-gray-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-casa-light hover:text-casa-red font-medium transition-colors">Login</Link>
              <Link to="/register" className="bg-casa-red hover:bg-casa-darkred text-white px-6 py-2.5 rounded-md font-semibold transition-colors shadow-sm">
                Get Started
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
