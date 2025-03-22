const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Function to create the first admin user
const createAdminUser = async () => {
  const adminUser = {
    username: 'nitin',
    password: 'nitin', // Plain text password (will be hashed by the User model)
    role: 'admin',
  };

  // Check if the admin user already exists
  const existingAdmin = await User.findOne({ username: 'nitin' });
  if (existingAdmin) {
    console.log('Admin user already exists. Deleting and recreating...');
    await User.deleteOne({ username: 'admin' }); // Delete the existing admin user
  }

  // Create the admin user
  await User.create(adminUser);
  console.log('Admin user created successfully.');
};

// Run the script
createAdminUser().then(() => mongoose.connection.close());