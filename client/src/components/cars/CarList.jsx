import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CarCard from './CarCard';
import SearchBar from './SearchBar';

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    make: '',
    minYear: '',
    maxPrice: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const carsPerPage = 6;

  const fetchCars = async () => {
    try {
      const response = await axios.get('http://localhost:3000/cars', {
        params: {
          page: currentPage,
          limit: carsPerPage,
          sort: sortBy,
          ...filters
        },
        withCredentials: true
      });
      setCars(response.data.cars || []);
      setTotalPages(Math.ceil(response.data.total / carsPerPage));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError('Failed to fetch cars');
      setCars([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [currentPage, sortBy, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchBar onSearch={(term) => setFilters(prev => ({ ...prev, search: term }))} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <select
            name="make"
            value={filters.make}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="">All Makes</option>
            <option value="Toyota">Toyota</option>
            <option value="Honda">Honda</option>
            <option value="Ford">Ford</option>
            {/* Add more options based on your data */}
          </select>

          <input
            type="number"
            name="minYear"
            value={filters.minYear}
            onChange={handleFilterChange}
            placeholder="Min Year"
            className="p-2 border rounded"
          />

          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            placeholder="Max Price"
            className="p-2 border rounded"
          />
        </div>

        <select
          value={sortBy}
          onChange={handleSortChange}
          className="mt-4 p-2 border rounded"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(cars) && cars.length > 0 ? (
          cars.map((car) => (
            <CarCard key={car._id} car={car} onUpdate={fetchCars} />
          ))
        ) : (
          <div className="col-span-3 text-center py-10">
            No cars found
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CarList; 