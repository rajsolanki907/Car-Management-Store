import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [userCars, setUserCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserCars();
  }, []);

  const fetchUserCars = async () => {
    try {
      const response = await axios.get('http://localhost:3000/cars/user', {
        withCredentials: true
      });
      setUserCars(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch your cars');
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Username</p>
            <p className="font-semibold">{user.username}</p>
          </div>
          <div>
            <p className="text-gray-600">Email</p>
            <p className="font-semibold">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Your Cars</h3>
        {userCars.length === 0 ? (
          <p className="text-gray-600">You haven't added any cars yet.</p>
        ) : (
          <div className="space-y-4">
            {userCars.map((car) => (
              <div key={car._id} className="border-b pb-4">
                <h4 className="font-semibold">{car.make} {car.model}</h4>
                <p className="text-gray-600">Year: {car.year}</p>
                <p className="text-blue-600">${car.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 