const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  accountNumber: { type: String, required: true, unique: true },
  customerId: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true },
  adhaarNumber: { type: String, required: true },
  dob: { type: Date, required: true },
  accountOpeningFormImage: { type: String, required: true },
  customerPhoto: { type: String, required: true },
  balance: { type: Number, default: 0 },
  debitCard: {
    cardNumber: String,
    expiryDate: Date
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Account', accountSchema);