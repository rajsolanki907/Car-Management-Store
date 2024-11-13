import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function CarList() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get('http://localhost:3000/cars', { withCredentials: true });
        setCars(response.data);
      } catch (error) {
        alert(error.response.data.error);
      }
    };
    fetchCars();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/cars/${id}`, { withCredentials: true });
      setCars(cars.filter(car => car._id !== id));
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Car List</h2>
      <Link to="/add-car" className="bg-blue-500 text-white p-2 rounded">Add Car</Link>
      <ul className="mt-4">
        {cars.map(car => (
          <li key={car._id} className="mb-4 p-4 border rounded">
            <h3 className="text-xl">{car.title}</h3>
            <p>{car.description}</p>
            <p>{car.tags.join(', ')}</p>
            <button onClick={() => handleDelete(car._id)} className="bg-red-500 text-white p-2 rounded mr-2">Delete</button>
            <Link to={`/update-car/${car._id}`} className="bg-green-500 text-white p-2 rounded">Update</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CarList;