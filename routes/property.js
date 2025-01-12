const express = require('express');
const Property = require('../models/Property');
const verifyToken = require('../middleware/verifyToken');
const verifyRole = require('../middleware/verifyRole');

const router = express.Router();

// Add a new property
router.post('/', verifyToken, verifyRole(['agent', 'landlord']), async (req, res) => {
  try {
    const property = new Property({
      ...req.body,
      listedBy: req.user.id, // User ID from JWT token
    });
    await property.save();
    res.status(201).json({ message: 'Property added successfully', property });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Fetch properties with optional filters
router.get('/', async (req, res) => {
    try {
      const { city, type, minPrice, maxPrice } = req.query;
      const filters = {};
  
      if (city) filters.city = city;
      if (type) filters.type = type;
      if (minPrice && maxPrice) filters.price = { $gte: minPrice, $lte: maxPrice };
  
      const properties = await Property.find(filters);
      res.json(properties);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
  
  //Update Properties
  router.put('/:id', verifyToken, verifyRole(['agent', 'landlord']), async (req, res) => {
    try {
      const property = await Property.findById(req.params.id);
  
      if (!property || property.listedBy.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to update this property' });
      }
  
      const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json({ message: 'Property updated successfully', property: updatedProperty });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

  //Delete Properties
  router.delete('/:id', verifyToken, verifyRole(['agent', 'landlord']), async (req, res) => {
    try {
      const property = await Property.findById(req.params.id);
  
      if (!property || property.listedBy.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to delete this property' });
      }
  
      await property.deleteOne();
      res.json({ message: 'Property deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
  
  module.exports = router;