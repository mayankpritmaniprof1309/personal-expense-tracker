const mongoose = require("mongoose");
const Transaction = require("../models/transaction");

// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Private
async function createTransaction(req, res) {
  try {
    const { name, type, amount, isDefault, date } = req.body;

    if (!name || !type || amount === undefined) {
      return res.status(400).json({ message: "Name, type, and amount are required" });
    }

    if (amount < 0) {
      return res.status(400).json({ message: "Amount cannot be negative" });
    }

    // Validate date is not in the future
    if (date) {
      const txDate = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (txDate > today) {
        return res.status(400).json({ message: "Future dates are not allowed" });
      }
    }

    const transaction = await Transaction.create({
      userId: req.user._id, // assumes auth middleware sets req.user
      name,
      type,
      amount,
      isDefault,
      date: date || Date.now(),
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


async function getTransactions(req, res) {
  try {
    const { type, page = 1, limit = 20 } = req.query;

    const filter = { userId: req.user._id };
    if (type && ["income", "expense"].includes(type)) {
      filter.type = type;
    }

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Transaction.countDocuments(filter);

    res.status(200).json({
      transactions,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get a single transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
async function getTransactionById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const transaction = await Transaction.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
async function updateTransaction(req, res) {
  try {
    const { id } = req.params;
    const { name, type, amount, isDefault, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    if (type && !["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Type must be 'income' or 'expense'" });
    }

    if (amount !== undefined && amount < 0) {
      return res.status(400).json({ message: "Amount cannot be negative" });
    }

    // Validate date is not in the future
    if (date) {
      const txDate = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (txDate > today) {
        return res.status(400).json({ message: "Future dates are not allowed" });
      }
    }

    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { $set: { name, type, amount, isDefault, date } },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get income vs expense summary (aggregation) — useful for dashboard charts
// @route   GET /api/transactions/summary
// @access  Private
async function getTransactionSummary(req, res) {
  try {
    const summary = await Transaction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user._id) } },
      {
        $group: {
          _id: "$type",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      income: { totalAmount: 0, count: 0 },
      expense: { totalAmount: 0, count: 0 },
    };

    summary.forEach((item) => {
      result[item._id] = {
        totalAmount: item.totalAmount,
        count: item.count,
      };
    });

    result.balance = result.income.totalAmount - result.expense.totalAmount;

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
};