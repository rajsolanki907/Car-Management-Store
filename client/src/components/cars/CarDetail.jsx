import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  const fetchCarDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/cars/${id}`, {
        withCredentials: true
      });
      setCar(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch car details');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await axios.delete(`http://localhost:3000/cars/${id}`, {
          withCredentials: true
        });
        navigate('/cars');
      } catch (err) {
        setError('Failed to delete car');
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!car) return <div className="text-center py-10">Car not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          src={`http://localhost:3000/${car.image}`}
          alt={car.model}
          className="w-full h-96 object-cover"
        />
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">{car.model}</h1>
            <span className="text-2xl font-bold text-blue-600">${car.price}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600">Make</p>
              <p className="font-semibold">{car.make}</p>
            </div>
            <div>
              <p className="text-gray-600">Year</p>
              <p className="font-semibold">{car.year}</p>
            </div>
          </div>
          <div className="mb-6">
            <p className="text-gray-600 mb-2">Description</p>
            <p className="text-gray-800">{car.description}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/cars/edit/${id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail; 