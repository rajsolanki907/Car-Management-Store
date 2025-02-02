import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/solid';

const Review = ({ onReviewAdded }) => {
  const { id } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3000/cars/${id}/reviews`, {
        rating,
        comment
      }, {
        withCredentials: true
      });
      setRating(0);
      setComment('');
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      setError('Failed to submit review');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                <StarIcon className="h-6 w-6" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comment
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={!rating}
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default Review; 