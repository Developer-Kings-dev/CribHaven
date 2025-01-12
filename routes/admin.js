const express = require('express');
const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

const router = express.Router();

// const verifyAdmin = (req, res, next) => {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Admin access required' });
//     }
//     next();
//   };

  router.get('/insights', verifyToken, verifyAdmin, async (req, res) => {
    try {
      const totalProperties = await Property.countDocuments();
      const totalBookings = await Booking.countDocuments();
      const totalUsers = await User.countDocuments();
  
      res.json({
        totalProperties,
        totalBookings,
        totalUsers,
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
  
  module.exports = router;