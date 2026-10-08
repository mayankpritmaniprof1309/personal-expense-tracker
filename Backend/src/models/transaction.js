const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    date: {
      type: Date,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },

    transactionMode: {
      type: String,
      enum: ["cash", "upi"],
      default: "upi",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);