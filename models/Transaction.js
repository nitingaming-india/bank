const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  initiator: {  // Employee who performed the transaction
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  account: {    // Account involved in transaction
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Generate unique transaction ID before saving
transactionSchema.pre('validate', async function(next) {
  if (!this.transactionId) {
    let isUnique = false;
    while (!isUnique) {
      const datePart = Date.now().toString(36);
      const randPart = Math.random().toString(36).substr(2, 6);
      const candidateId = `TXN-${datePart}-${randPart}`.toUpperCase();
      
      // Check if ID already exists
      const exists = await this.constructor.findOne({ transactionId: candidateId });
      if (!exists) {
        this.transactionId = candidateId;
        isUnique = true;
      }
    }
  }
  next();
});
module.exports = mongoose.model('Transaction', transactionSchema);