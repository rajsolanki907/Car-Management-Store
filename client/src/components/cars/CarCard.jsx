import React from 'react';
import { Link } from 'react-router-dom';

const CarCard = ({ car }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={`http://localhost:3000/${car.image}`}
        alt={car.model}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{car.model}</h3>
        <p className="text-gray-600 mb-2">{car.make}</p>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700">Year: {car.year}</span>
          <span className="text-blue-600 font-bold">${car.price}</span>
        </div>
        <p className="text-gray-500 mb-4 line-clamp-2">{car.description}</p>
        <div className="flex justify-between">
          <Link
            to={`/cars/${car._id}`}
            className="text-blue-600 hover:text-blue-800"
          >
            View Details
          </Link>
          <Link
            to={`/cars/edit/${car._id}`}
            className="text-gray-600 hover:text-gray-800"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard; 