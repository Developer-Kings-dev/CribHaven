const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(express.json());

// Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const propertyRoutes = require('./routes/property');
const bookingRoutes = require('./routes/booking');
const adminRoutes = require('./routes/admin');

// Route Middlewares
app.use('/api/auth', authRoutes);          // User Authentication
app.use('/api/user', userRoutes);          // User Wishlist and Profile
app.use('/api/properties', propertyRoutes); // Property Listings
app.use('/api/bookings', bookingRoutes);   // Booking System
app.use('/api/admin', adminRoutes);        // Admin Insights

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
