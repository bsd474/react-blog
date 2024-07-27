const asyncHandler = require('express-async-handler');
const { User, validateUpdateUser } = require('../models/User');
const bcrypt = require('bcryptjs');

// ==============================================
// @desc    Get all users
// @route   GET= /api/users
// @access  Private (only authenticated users can access it)
// ==============================================

module.exports.getUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password');
    res.status(200).json(users);
});


// ==============================================
// @desc    Get user by ID
// @route   GET= /api/users/:id
// @access  public (anyone can access it)
// ==============================================

module.exports.getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
});

// ==============================================
// @desc    Update user by ID
// @route   PUT= /api/users/:id
// @access  Private (only authenticated users can access it)
// ==============================================

module.exports.updateUser = asyncHandler(async (req, res) => {
    // validate the request
    const {error } = validateUpdateUser(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    // hash the password
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    // update the user
    const user = await User.findByIdAndUpdate(req.params.id, {
        $set: {
            username: req.body.username,
            password: req.body.password,
            bio: req.body.bio
        }
    }, 
    // return the updated user
    { new: true }).select('-password');
    res.status(200).json(user);
});

// ==============================================
// @desc    Get users count
// @route   GET= /api/users/count
// @access  Private (only authenticated users can access it)
// ==============================================
module.exports.getUsersCount = asyncHandler(async (req, res) => {
    const usersCount = await User.countDocuments(); // Use countDocuments() instead of count()
    res.status(200).json({ count: usersCount });
});