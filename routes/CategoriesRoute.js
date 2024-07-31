const router = require("express").Router();
const {
  createCategory,
  getCategories,
  getCategoriesCount,
} = require("../controllers/CategoryController");
const { verifyTokenAdmin } = require("../middlewares/verifyToken");

// api/categories
router.route("/").post(verifyTokenAdmin, createCategory).get(getCategories);

// api/categories/count
router.route("/count").get(getCategoriesCount);
// export router
module.exports = router;
