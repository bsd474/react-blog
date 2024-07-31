const asyncHandler = require("express-async-handler");
const { Category, validateCategory } = require("../models/Category");

// ======== Create a category ========
// @desc    Create a category
// @route   POST /api/categories
// @access  Private
// @return  The created category
// @note    This is a protected route
// ===================================

module.exports.createCategory = asyncHandler(async (req, res) => {
  const { error } = validateCategory(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let category = new Category({
    name: req.body.name,
  });

  category = await category.save();
  res.send(category);
});

// ======== Create a category ========
// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
// @return  An array of categories
// @note    This is a protected route
// ===================================

module.exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort("name");
  res.send(categories);
});
