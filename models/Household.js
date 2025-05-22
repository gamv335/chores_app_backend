// models/Household.js
const mongoose = require('mongoose');

const HouseholdSchema = new mongoose.Schema({
  name: { type: String, required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin user
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Household members
});

module.exports = mongoose.model('Household', HouseholdSchema);
