const asyncHandler = require("express-async-handler");
const { Post, validatePost } = require("../models/Post");
const { Category } = require("../models/Category");
const { cloudinaryUpload, cloudinaryRemove } = require("../utils/cloudinary");
const path = require("path");
const fs = require("fs");

// ======== Create a post ========
// @desc    Create a post
// @route   POST /api/posts
// @access  Private only for logged in users
// @return  The created post
// @note    This is a protected route
// ===================================

module.exports.createPost = asyncHandler(async (req, res) => {
  // Validate the image
  if (!req.file) {
    return res.status(400).json({ message: "Please upload an image" });
  }

  // Validate the data
  const { error } = validatePost(req.body);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }

  // Upload the image
  const imagePath = path.join(
    __dirname,
    `../assets/uploads/${req.file.filename}`
  );
  const result = await cloudinaryUpload(imagePath);

  // Find the category
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(400).json("Invalid category");
  }

  // Create the post and save it in the database
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    user: req.user.id,
    category: req.body.category,
    image: {
      url: result.secure_url,
      public_id: result.public_id,
    },
  });
  await post.save();

  // Send the post
  res.status(201).json(post);

  // Remove the image from the server
  fs.unlinkSync(imagePath);
});
