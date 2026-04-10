const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 
      'Utilities', 'Rent', 'Education', 'Salary', 'Freelance', 
      'Investment', 'Gift', 'Other'
    ],
  },
  description: {
    type: String,
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Other'],
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);
