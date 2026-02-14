const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const seedAdmin = require('./seed');

dotenv.config();
const app = express();


app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB Atlas");
    await seedAdmin(); 
  })
  .catch(err => {
    console.error("MongoDB Connection Error:", err.message);
  });


app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));