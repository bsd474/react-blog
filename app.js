const express = require("express");
const connectDB = require("./config/connectDB");
require("dotenv").config();

// connect to the database
connectDB();

// initialize the app
const app = express();

// middleware
app.use(express.json());

// run the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.MODE_ENV} mode on port ${PORT}`)
);
