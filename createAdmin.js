// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const User = require('./models/User'); // Update the path to your User model

// const createAdmin = async () => {
//   try {
//     await mongoose.connect('mongodb://localhost:27017/cribhaven', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     const hashedPassword = await bcrypt.hash('King1234', 10); // Replace 'admin123' with your password

//     const adminUser = new User({
//       name: 'Admin',
//       email: 'admin@example.com',
//       password: hashedPassword,
//       role: 'admin',
//     });

//     await adminUser.save();
//     console.log('Admin user created successfully!');
//     mongoose.disconnect();
//   } catch (err) {
//     console.error('Error creating admin user:', err);
//   }
// };

// createAdmin();


const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Adjust the path to your User model

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/cribhaven', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Define admin credentials
    const adminEmail = 'admin@example.com';
    const plainPassword = 'admin123'; // Use this password to log in
    const hashedPassword = await bcrypt.hash(plainPassword, 10); // Hash the password for secure storage

    // Check if an admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin);
      return mongoose.disconnect();
    }

    // Create a new admin user
    const adminUser = new User({
      name: 'Admin User',
      email: adminEmail,
      password: hashedPassword, // Save the hashed password
      role: 'admin',
    });

    await adminUser.save();
    console.log(`Admin user created successfully! Use these credentials to log in:
    Email: ${adminEmail}
    Password: ${plainPassword}`);
    
    // Disconnect from MongoDB
    mongoose.disconnect();
  } catch (err) {
    console.error('Error creating admin user:', err);
    mongoose.disconnect();
  }
};

createAdmin();
