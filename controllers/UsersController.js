const asyncHandler = require('express-async-handler');
const { User, validateUpdateUser } = require('../models/User');
const bcrypt = require('bcryptjs');
const path = require('path');
const { cloudinaryUploadAvatar, cloudinaryRemoveAvatar } = require('../utils/cloudinary');
const fs = require('fs');


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


// ==============================================
// @desc    Upload user avatar
// @route   POST= /api/users/profile/upload-avatar
// @access  Private (only authenticated users can access it)
// ==============================================
module.exports.uploadAvatar = asyncHandler(async (req, res) => {
    // check if the request contains a file
    if(!req.file) {
        return res.status(400).json({ message: 'Please upload an image' });
    }

    // get the path of the uploaded file
    const imagePath = path.join(__dirname, `../assets/uploads/avatars/${req.file.filename}`);
    // console.log(imagePath);

    // upload the image to the cloud storage
    const result = await cloudinaryUploadAvatar(imagePath);
    // console.log(result);

    // get the user 
    const user = await User.findById(req.user.id);

    // delete the previous avatar if exists
    if (user.profilePic.public_id !== null) {
        await cloudinaryRemoveAvatar(user.profilePic.public_id);
    }

    // change the avatar in the database
    user.profilePic = {
        url: result.secure_url,
        public_id: result.public_id
        
    };
    await user.save();

    // send the response 
    res.status(200).json({ 
        message: 'Avatar uploaded successfully',
        profilePic: {
            url: result.secure_url,
            public_id: result.public_id
        }
     });

    // delete the image from the server
    fs.unlinkSync(imagePath);
});

// ==============================================
// @desc    Delete user Account 
// @route   DELETE= /api/users/profile/:id
// @access  Private (only authenticated users can access it and admin)
// ==============================================

module.exports.deleteUser = asyncHandler(async (req, res) => {
    
    // Get the user
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    // @TODO: get all posts of the user
    // @TODO: get all public ids of the posts
    // @TODO: delete all posts images from cloudinary
    // @TODO: delete the user posts and comments

    // delete avatar from cloudinary
            await cloudinaryRemoveAvatar(user.profilePic.public_id);

    // delete the user
    //  Model.findByIdAndDelete(conditions) // delete the first document that matches the conditions
    //   findByIdAndDelete(id) is a shorthand for findOneAndDelete({ _id: id })
             await User.findByIdAndDelete(req.params.id);
    

    // send the response
    res.status(200).json({ message: 'User deleted successfully' });
});