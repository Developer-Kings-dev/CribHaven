const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyAdmin = require('../middleware/verifyAdmin');

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create or update roommate profile
router.put('/profile/roommate', verifyToken, async (req, res) => {
  try {
    const { gender, location, budget, essentials } = req.body;

    // Validate input
    if (!gender || !location || !budget) {
      return res.status(400).json({ message: 'Gender, location, and budget are required.' });
    }

    // Update roommate preferences in the user profile
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        roommatePreferences: {
          gender,
          location,
          budget,
          essentials,
        },
      },
      { new: true } // Return the updated user
    ).select('-password'); // Exclude the password from the response

    res.json({
      message: 'Roommate profile created/updated successfully.',
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Search roommates
router.post('/roommates/search', verifyToken, async (req, res) => {
  try {
    const { gender, location, budget } = req.body;

    const roommates = await User.find({
      'roommatePreferences.gender': gender,
      'roommatePreferences.location': location,
      'roommatePreferences.budget': budget,
    }).select('-password');

    res.json(roommates);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get roommate preferences for the logged-in user
router.get('/profile/roommate', verifyToken, async (req, res) => {
  try {
    // Find the user by their ID from the token
    const user = await User.findById(req.user.id).select('roommatePreferences');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if roommate preferences exist
    if (!user.roommatePreferences || Object.keys(user.roommatePreferences).length === 0) {
      return res.status(404).json({ message: 'No roommate preferences found' });
    }

    // Return roommate preferences
    res.json({
      message: 'Roommate preferences retrieved successfully',
      roommatePreferences: user.roommatePreferences,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

//Add to Wishlist
router.post('/wishlist', verifyToken, async (req, res) => {
  const { propertyId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (user.wishlist.includes(propertyId)) {
      return res.status(400).json({ message: 'Property already in wishlist' });
    }

    user.wishlist.push(propertyId);
    await user.save();

    res.json({ message: 'Property added to wishlist', wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/// PATCH /api/users/:id/role - Update a user's role
router.patch('/:id/role', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params; // Get the user ID from the URL
    const { role } = req.body; // Get the new role from the request body

    // Validate the new role
    if (!role || !['admin', 'landlord', 'tenant', 'agent'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Allowed roles are: admin, landlord, tenant, agent.' });
    }

    // Find and update the user by ID
    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { role }, // Set the new role
      { new: true } // Return the updated user document
    );

    // Check if the user exists
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Return the updated user
    res.json({ message: 'User role updated successfully.', user: updatedUser });
  } catch (err) {
    console.error('Error updating user role:', err.message);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the user by ID
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'User deleted successfully.', user: deletedUser });
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});


module.exports = router;

