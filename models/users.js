const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: { type: Boolean, default: false },
  score: { type: Number, default: 0 },
  strength: { type: String, default: 'Weak' },
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
