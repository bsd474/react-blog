const mongoose = require("mongoose");

// validate object id
module.exports = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }
  next();
};
