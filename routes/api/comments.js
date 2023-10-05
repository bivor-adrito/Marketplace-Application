const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const authenticateToken = require("../../middleware/auth");
const Product = require("../../models/Product");
const Comment = require("../../models/Comment");

router.post(
  "/",
  [authenticateToken, [body("productId", "productId is required").notEmpty()]],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const id = req.user.id;

      const product = await Product.findById(req?.body?.productId);
      if (!product) {
        return res.status(400).json({ message: "Product not found" });
      }
      // const total = product.price*req.body.qty
      const commentObj = {
        userId: id,
        productId: product._id,
        comment: req.body.comment ?? "",
        biddingAmount: req.body.biddingAmount ?? 0,
        biddingDate: new Date(),
      };

      const comment = new Comment(commentObj);
      await comment.save();
      res.status(201).json(comment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something is wrong" });
    }
  }
);
// GET:localhost:3001/api/comments/by-product/
router.get("/by-product/:id", authenticateToken, async (req, res) => {
  try {
    // const id = req.user.id;
    const comment = await Comment.find({ productId: id });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: "Something is wrong" });
  }
});





router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;

    const comment = await Comment.findOne({ _id: id });
    if (comment) {
      res.json(comment);
    } else {
      res.status(404).json({ message: "Comment not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something is wrong" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const comment = await Comment.findOneAndDelete({ _id: id });
    if (comment) {
      res.json(comment);
    } else {
      res.status(404).json({ message: "Comment not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something is wrong" });
  }
});

module.exports = router;
