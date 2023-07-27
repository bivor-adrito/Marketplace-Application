const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const authenticateToken = require("../../middleware/auth");
const Product = require("../../models/Product");
const File = require("../../models/File");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //   cb(null, './public/uploads/')
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // uniqueSuffix = 'a-manzil.jpg'
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/uploads", upload.single("file"), async (req, res) => {
  const fileObj = {
    name: req.file.filename,
    path: req.file.path,
  };

  const file = new File(fileObj);
  await file.save();
  res.status(201).json(file);
  // res.json(req.file)
});

router.post(
  "/",
  [authenticateToken, [body("name", "name is required").notEmpty()]],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (req?.user?.type != "admin") {
        return res.status(400).json({ message: "You are not admin" });
      }

      const id = req.user.id;
      const productObj = {
        name: req.body.name,
        desc: req.body.desc ?? "",
        madeIn: req.body.madeIn ?? "",
        price: req.body.price ?? "",
        fileId: req.body.fileId ?? "",
        // expireAt: req.body.expireAt ?? "",
        // expireAt:new Date(req.body.expireAt ?? ""),
        expireAt: new Date(),
        userId: id,
      };
      const product = new Product(productObj);
      await product.save();
      if (product?.fileId) {
        const createdProduct = await Product.findById(product._id)
          .populate(["fileId", "userId"])
          .exec();
        res.status(201).json(createdProduct);
      }
      // res.status(201).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something is wrong" });
    }
  }
);

router.get("/", authenticateToken, async (req, res) => {
  try {
    const product = await Product.find({});
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Something is wrong" });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    if (req?.user?.type != "admin") {
      return res.status(400).json({ message: "You are not admin" });
    }
    const id = req.params.id;
    const userId = req.user.id;
    const body = req.body;
    const product = await Product.findOneAndUpdate(
      { _id: id, userId: userId },
      body,
      { new: true }
    );
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something is wrong" });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const product = await Product.findOne({ _id: id, userId: userId });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something is wrong" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    if (req?.user?.type != "admin") {
      return res.status(400).json({ message: "You are not admin" });
    }
    const id = req.params.id;
    const userId = req.user.id;
    const product = await Product.findOneAndDelete({ _id: id, userId: userId });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something is wrong" });
  }
});

module.exports = router;
