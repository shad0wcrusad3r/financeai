const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const { protect } = require('../middlewares/authMiddleware');

// Get all goals
router.get('/', protect, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a goal
router.post('/', protect, async (req, res) => {
  try {
    const goal = new Goal({
      ...req.body,
      userId: req.user._id,
    });
    const createdGoal = await goal.save();
    res.status(201).json(createdGoal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a goal
router.put('/:id', protect, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (goal.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a goal
router.delete('/:id', protect, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    if (goal.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await goal.deleteOne();
    res.json({ message: 'Goal removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
