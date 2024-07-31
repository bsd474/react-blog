const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// Create a schema
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    image: {
      type: Object,
      default: {
        url: "",
        public_id: "",
      },
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Create a model
const Post = mongoose.model("Post", postSchema);

// Validate post
function validatePost(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().min(2).max(100).required(),
    description: Joi.string().trim().min(10).required(),
    category: Joi.objectId().required(),
  });

  return schema.validate(obj);
}

// Validate post update
function validatePostUpdate(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().min(2).max(100),
    description: Joi.string().trim().min(10),
    category: Joi.objectId(),
  });

  return schema.validate(obj);
}

// Export the model
module.exports = {
  Post,
  validatePost,
  validatePostUpdate,
};
