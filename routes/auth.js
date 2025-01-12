const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Sign-up
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Create new user
    const user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find user
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: 'Invalid email or password' });

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

//     // Generate JWT
//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.json({
//       message: 'Login successful',
//       token,
//       user: { id: user._id, name: user.name, email: user.email, role: user.role },
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login Attempt: ', { email, password }); // Log the email and password input

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email); // Log if no user is found
      return res.status(404).json({ message: 'Invalid email or password.' });
    }

    console.log('User Found:', user); // Log the retrieved user document

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for email:', email); // Log if passwords don't match
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Login Successful for:', email); // Log successful login

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// Logout (optional, for token revocation)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
