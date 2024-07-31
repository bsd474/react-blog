const router = require("express").Router();
const { createPost } = require("../controllers/PostController");
const handleUpload = require("../middlewares/uploadImages");
const { verifyToken } = require("../middlewares/verifyToken");

// api/posts
router.route("/").post(verifyToken, handleUpload.single("image"), createPost);

// export router
module.exports = router;
