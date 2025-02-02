import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users/favorites', {
        withCredentials: true
      });
      setFavorites(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch favorites');
      setLoading(false);
    }
  };

  const removeFavorite = async (carId) => {
    try {
      await axios.delete(`http://localhost:3000/users/favorites/${carId}`, {
        withCredentials: true
      });
      fetchFavorites();
    } catch (err) {
      setError('Failed to remove from favorites');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Favorites</h2>
      
      {favorites.length === 0 ? (
        <p className="text-gray-600">You haven't added any cars to your favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((car) => (
            <div key={car._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={`http://localhost:3000/${car.image}`}
                alt={car.model}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{car.make} {car.model}</h3>
                <p className="text-gray-600 mb-2">Year: {car.year}</p>
                <p className="text-blue-600 font-bold mb-4">${car.price}</p>
                <div className="flex justify-between">
                  <Link
                    to={`/cars/${car._id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => removeFavorite(car._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites; 