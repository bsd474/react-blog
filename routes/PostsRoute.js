const router = require("express").Router();
const { valid } = require("joi");
const {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
  getPostsCount,
} = require("../controllers/PostController");
const handleUpload = require("../middlewares/uploadImages");
const { verifyToken } = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");

// api/posts/count
router.route("/count").get(getPostsCount);

// api/posts
router
  .route("/")
  .post(verifyToken, handleUpload.single("image"), createPost)
  .get(getAllPosts);

// api/posts/:id
router
  .route("/:id")
  .get(validateObjectId, getPost)
  .put(validateObjectId, verifyToken, updatePost)
  .delete(validateObjectId, verifyToken, deletePost);

// export router
module.exports = router;
