const mongoose = require("mongoose");
const joi = require("joi");

// Create a schema
const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
  },
  { timestamps: true }
);

// Create a model
const Category = mongoose.model("Category", categorySchema);

// Validate category
function validateCategory(obj) {
  const schema = joi.object({
    category: joi.string().trim().min(2).max(50).required(),
  });

  return schema.validate(obj);
}

// Export the model and validate function
module.exports = { Category, validateCategory };
