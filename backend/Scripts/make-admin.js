const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function makeAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');
    
    // First, list all users
    const allUsers = await User.find({}).select('name email isAdmin');
    console.log('📋 All users in database:', allUsers);
    
    if (allUsers.length === 0) {
      console.log('❌ No users found in database!');
      console.log('💡 Please register a user first via POST /api/auth/register');
      mongoose.connection.close();
      return;
    }
    
    // Make the first user admin
    const userToPromote = allUsers[0];
    userToPromote.isAdmin = true;
    await userToPromote.save();
    
    console.log(`✅ Made ${userToPromote.email} an admin!`);
    console.log('Updated user:', {
      name: userToPromote.name,
      email: userToPromote.email,
      isAdmin: userToPromote.isAdmin
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

makeAdmin();
