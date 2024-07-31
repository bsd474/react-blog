const express = require("express");
const connectDB = require("./config/connectDB");
require("dotenv").config();

// connect to the database
connectDB();

// initialize the app
const app = express();

// middleware
app.use(express.json());

// routes
app.use("/api/auth", require("./routes/AuthRoute"));
app.use("/api/users", require("./routes/UsersRoute"));
app.use("/api/categories", require("./routes/CategoriesRoute"));
app.use("/api/posts", require("./routes/PostsRoute"));

// run the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.MODE_ENV} mode on port ${PORT}`)
);
