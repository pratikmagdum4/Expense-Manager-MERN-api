const express = require("express");
const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Add Expense
router.post("/", authMiddleware, async (req, res) => {
  const { category, amount, comments } = req.body;

  try {
    const expense = new Expense({
      user: req.user.id,
      category,
      amount,
      comments,
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Expenses
router.get("/", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Edit Expense
router.put("/:id", authMiddleware, async (req, res) => {
  const { category, amount, comments } = req.body;

  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { category, amount, comments, updatedAt: Date.now() },
      { new: true }
    );
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete Expense
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
