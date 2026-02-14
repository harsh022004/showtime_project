const router = require('express').Router();
const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json("Unauthorized");
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json("Invalid Token");
    req.user = decoded; 
    next();
  });
};


router.post('/', verifyToken, async (req, res) => {
  const { movie, showtime, seats, total } = req.body;
  try {
    const existingBookings = await Booking.find({
      movie: movie,
      showtime: showtime,
      seats: { $in: seats } 
    });

    if (existingBookings.length > 0) {
      const takenSeats = existingBookings.flatMap(b => b.seats).filter(s => seats.includes(s));
      return res.status(400).json(`Seats already booked: ${takenSeats.join(", ")}`);
    }

    const newBooking = new Booking({
      movie,
      showtime,
      seats,
      total,
      userId: req.user.id
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(500).json("Server Error: " + err.message);
  }
});


router.get('/booked-seats', async (req, res) => {
  const { movie, showtime } = req.query;
  try {
    const bookings = await Booking.find({ movie, showtime });
    const allBookedSeats = bookings.flatMap(b => b.seats);
    res.status(200).json(allBookedSeats);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/history', verifyToken, async (req, res) => {
  try {
    const history = await Booking.find({ userId: req.user.id });
    res.status(200).json(history); 
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/all', verifyToken, async (req, res) => {
  try {
    
    if (req.user.role !== 'admin') {
      return res.status(403).json("Access denied: Admins only");
    }
    
    
    const allBookings = await Booking.find().populate('userId', 'name email');
    res.status(200).json(allBookings);
  } catch (err) {
    res.status(500).json("Error fetching admin data: " + err.message);
  }
});

module.exports = router;