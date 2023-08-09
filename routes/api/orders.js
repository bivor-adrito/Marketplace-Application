const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const authenticateToken = require("../../middleware/auth");
const Product = require("../../models/Product");
const Order = require("../../models/Order");

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
      const orderObj = {
        userId: id,
        productId: product._id,
        qty: req.body.qty ?? 1,
        purchaseDate: new Date(),
        expectedDeliveryDate: new Date(),
        status: "in-progress",
        // total:total,
        location: req.body.location ?? "",
      };

      orderObj.total = product.price * orderObj.qty;

      const order = new Order(orderObj);
      await order.save();
      res.status(201).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something is wrong" });
    }
  }
);

router.get("/", authenticateToken, async (req, res) => {
  try {
    const id = req.user.id;
    const order = await Order.find({ userId: id });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Something is wrong" });
  }
});

router.put(
  "/status/:id",
  [
    authenticateToken,
    [
      body("status", "status is required").notEmpty(),
      body("status", "give your valid status").isIn([
        "delivered",
        "in-progress",
      ]),
    ],
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const id = req.params.id;

      const status = req.body.status;
      const order = await Task.findOneAndUpdate(
        { _id: id },
        { status: status },
        { new: true }
      );
      if (order) {
        res.json(order);
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something is wrong" });
    }
  }
);

router.put(
  "/:id",
  [
    authenticateToken,
    [
      body("status", "give your valid status").isIn([
        "delivered",
        "in-progress",
      ]),
    ],
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const id = req.params.id;

      const body = req.body;
      const order = await Order.findOneAndUpdate({ _id: id }, body, {
        new: true,
      });
      if (order) {
        res.json(order);
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something is wrong" });
    }
  }
);

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;

    const order = await Order.findOne({ _id: id });
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something is wrong" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findOneAndDelete({ _id: id });
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something is wrong" });
  }
});

module.exports = router;
