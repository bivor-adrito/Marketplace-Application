require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const connectDB = require("./config/db");

app.use(bodyParser.json());

connectDB();

//routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/products", require("./routes/api/products"));

//?ApI to check connection
app.get("/", (req, res) => {
  res.json({ mesaage: "Welcome to my app" });
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`The app is running on port ${port}`);
});
