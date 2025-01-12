const express = require('express');
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const verifyToken = require('../middleware/verifyToken');
const verifyRole = require('../middleware/verifyRole.js');

const router = express.Router();

router.post('/', verifyToken, verifyRole(['tenant']), async (req, res) => {
  try {
    const { propertyId } = req.body;

    const property = await Property.findById(propertyId);
    if (!property || property.status === 'booked') {
      return res.status(400).json({ message: 'Property unavailable' });
    }

    const booking = new Booking({
      property: propertyId,
      tenant: req.user.id,
    });

    property.status = 'booked';
    await property.save();
    await booking.save();

    res.status(201).json({ message: 'Booking successful', booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;