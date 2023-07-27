require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer  = require('multer')
const connectDB = require("./config/db");

app.use(bodyParser.json());

// const upload = multer({dest: './public/uploads/'})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // uniqueSuffix = 'a-manzil.jpg'
    cb(null, file.fieldname + '-'  + uniqueSuffix + file.originalname)
  }
})

const upload = multer({ storage: storage })

connectDB();


//routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/products", require("./routes/api/products"));

//?ApI to check connection
app.get("/", (req, res) => {
  res.json({ mesaage: "Welcome to my app" });
});


app. post("/uploads", upload.single("file"), (req,res)=>{
  res.json(req.file)
})

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`The app is running on port ${port}`);
});
