const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{
    public_id: String,
    url: String
  }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [{ type: String }], // e.g., ["SUV", "Toyota", "Dealership A"]
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Car', CarSchema);