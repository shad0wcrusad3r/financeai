const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { protect } = require('../middlewares/authMiddleware');

// Get summary
router.get('/summary', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ date: -1 });

    let totalIncome = 0;
    let totalExpenses = 0;
    const expensesByCategory = {};
    const monthlyTrendData = {};

    transactions.forEach((tx) => {
      const month = new Date(tx.date).toLocaleString('default', { month: 'short' });
      
      if (!monthlyTrendData[month]) {
        monthlyTrendData[month] = { name: month, income: 0, expense: 0, sortDate: new Date(tx.date).setDate(1) };
      }

      if (tx.type === 'income') {
        totalIncome += tx.amount;
        monthlyTrendData[month].income += tx.amount;
      } else {
        totalExpenses += tx.amount;
        monthlyTrendData[month].expense += tx.amount;
        
        if (expensesByCategory[tx.category]) {
          expensesByCategory[tx.category] += tx.amount;
        } else {
          expensesByCategory[tx.category] = tx.amount;
        }
      }
    });

    const expensesArray = Object.keys(expensesByCategory).map(key => ({
      name: key,
      value: expensesByCategory[key]
    }));

    const monthlyTrend = Object.values(monthlyTrendData)
      .sort((a, b) => a.sortDate - b.sortDate)
      .slice(-6);

    const recentTransactions = transactions.slice(0, 5);

    res.json({
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      expensesByCategory: expensesArray,
      monthlyTrend,
      recentTransactions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all transactions
router.get('/', protect, async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;
    let query = { userId: req.user._id };

    if (type) query.type = type;
    if (category) query.category = category;
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a transaction
router.post('/', protect, async (req, res) => {
  try {
    const transaction = new Transaction({
      ...req.body,
      userId: req.user._id,
    });
    const createdTransaction = await transaction.save();
    res.status(201).json(createdTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a transaction
router.put('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a transaction
router.delete('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await transaction.deleteOne();
    res.json({ message: 'Transaction removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
