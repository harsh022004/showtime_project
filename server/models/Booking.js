const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movie: { type: String, required: true },
  showtime: { type: String, required: true },
  seats: [String],
  total: { type: Number, required: true },
  // Ticket expires in 5 hours (18000 seconds)
  createdAt: { type: Date, default: Date.now, expires: 18000 } 
});

module.exports = mongoose.model('Booking', BookingSchema);