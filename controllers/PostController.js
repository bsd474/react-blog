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

// ======== Get all posts ========
// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
// @return  All posts
// ===================================

module.exports.getAllPosts = asyncHandler(async (req, res) => {
  const POSTS_PER_PAGE = 3;
  const { pageNumber, category } = req.query;
  let posts;

  if (category) {
    const foundCategory = await Category.findOne({ category: category });
    if (!foundCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const categoryId = foundCategory._id;

    if (pageNumber) {
      posts = await Post.find({ category: categoryId })
        .skip((pageNumber - 1) * POSTS_PER_PAGE)
        .limit(POSTS_PER_PAGE)
        .populate("category", "category"); // Ensure 'category' is the field name in the Category schema
    } else {
      posts = await Post.find({ category: categoryId })
        .populate("category", ["-_id"])
        .sort("-createdAt")
        .populate("user", ["-password", "-isVerified"]);
    }
  } else {
    if (pageNumber) {
      posts = await Post.find()
        .skip((pageNumber - 1) * POSTS_PER_PAGE)
        .limit(POSTS_PER_PAGE)
        .populate("category", ["-_id"])
        .sort("-createdAt")
        .populate("user", ["-password", "-isVerified"]);
    } else {
      posts = await Post.find()
        .populate("category", ["-_id"])
        .sort("-createdAt")
        .populate("user", ["-password", "-isVerified"]);
    }
  }
  res.status(200).json(posts);
});

// ======== Get a post ========
// @desc    Get a post
// @route   GET /api/posts/:id
// @access  Public
// @return  The post
// ===================================

module.exports.getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("category", ["-_id"])
    .populate("user", ["-password", "-isVerified"]);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.status(200).json(post);
});

// ======== Update a post ========
// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private only for the post owner
// @return  The updated post
// @note    This is a protected route
// ===================================

module.exports.updatePost = asyncHandler(async (req, res) => {
  const { error } = validatePost(req.body);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }

  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (post.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "You are not authorized" });
  }

  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
    },
    { new: true }
  );
  res.status(200).json(updatedPost);
});

// ======== Delete a post ========
// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private only for the post owner
// @return  The deleted post
// @note    This is a protected route
// ===================================

module.exports.deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (post.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "You are not authorized" });
  }

  await cloudinaryRemove(post.image.public_id);
  await post.deleteOne();

  res.status(200).json({ message: "Post deleted successfully" });
});

// ======== Get posts count ========
// @desc    Get posts count
// @route   GET /api/posts/count
// @access  Public
// @return  The number of posts
// ===================================
module.exports.getPostsCount = asyncHandler(async (req, res) => {
  const postsCount = await Post.countDocuments();
  res.send({ count: postsCount });
});
