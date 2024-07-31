const router = require("express").Router();
const {
  createCategory,
  getCategories,
} = require("../controllers/CategoryController");
const { verifyTokenAdmin } = require("../middlewares/verifyToken");

// api/categories
router.route("/").post(verifyTokenAdmin, createCategory).get(getCategories);

// export router
module.exports = router;
