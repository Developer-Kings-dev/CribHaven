const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'landlord', 'tenant', 'agent'], default: 'tenant' },
  createdAt: { type: Date, default: Date.now },
  roommatePreferences: {
    gender: { type: String },
    location: { type: String },
    budget: { type: String },
    essentials: [String],
  },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
});

// Password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
