const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    comment: {
      type: String,
    },
    biddingAmount: {
      type: Number,
    },
    biddingDate: {
      type: Date,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = Comment = mongoose.model("Comment", CommentSchema);
