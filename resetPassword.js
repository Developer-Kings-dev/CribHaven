const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Adjust the path to your User model

const resetPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/cribhaven', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Define admin email and new password
    const adminEmail = 'admin@example.com'; // Admin's email
    const plainPassword = 'admin123'; // New password to log in with
    const hashedPassword = await bcrypt.hash(plainPassword, 10); // Hash the new password

    // Update the password for the admin user
    const updatedAdmin = await User.findOneAndUpdate(
      { email: adminEmail }, // Find the admin by email
      { password: hashedPassword }, // Set the new hashed password
      { new: true } // Return the updated user document
    );

    if (!updatedAdmin) {
      console.log('Admin user not found.');
    } else {
      console.log(`Admin password reset successfully! Use these credentials to log in:
      Email: ${adminEmail}
      Password: ${plainPassword}`);
    }

    mongoose.disconnect();
  } catch (err) {
    console.error('Error resetting admin password:', err);
    mongoose.disconnect();
  }
};

resetPassword();
