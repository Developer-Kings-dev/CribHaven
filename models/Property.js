const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  city: { type: String, required: true },
  type: { type: String, enum: ['apartment', 'house', 'office'], required: true },
  location: { type: String },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  amenities: [String],
  listedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Agent/Landlord ID
  status: { type: String, enum: ['available', 'booked'], default: 'available' },
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
