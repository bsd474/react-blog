const mongoose = require('mongoose');
const joi = require('joi');
const jwt = require('jsonwebtoken');

// Define the schema - This is the structure of the document that is stored in the database.
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 20,
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 8,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 70,
    },
    profilePic: {
        type: Object,
        default: {
            url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
            public_id: null,
        },
    },
    bio: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    },{
    timestamps: true,
    });


// generate a token
UserSchema.methods.generateToken = function() {
    return jwt.sign({id: this._id, isAdmin: this.isAdmin}, process.env.JWT_SECRET);
}

// Export the model
const User = mongoose.model('User', UserSchema);

// Validate Sign up user - This validation is done on the server side to ensure that the data is valid before it is saved to the database.
function validateSignupUser(obj) {
   const schema = joi.object({
       username: joi.string().trim().min(3).max(20).required(),
       password: joi.string().trim().min(8).required(),
       email: joi.string().trim().min(5).max(70).required().email(),
   });
    return schema.validate(obj);
}

// Validate Sign in user - This validation is done on the server side to ensure that the data is valid before it is saved to the database.
function validateSignInUser(obj) {
    const schema = joi.object({
        password: joi.string().trim().min(8).required(),
        email: joi.string().trim().min(5).max(70).required().email(),
    });
    return schema.validate(obj);
}

// Validate Update user - This validation is done on the server side to ensure that the data is valid before it is saved to the database.
function validateUpdateUser(obj) {
    const schema = joi.object({
        username: joi.string().trim().min(3).max(20),
        password: joi.string().trim().min(8),
        bio: joi.string().max(500),
    });
    return schema.validate(obj);
}

module.exports = {
    User,
    validateSignupUser,
    validateSignInUser,
    validateUpdateUser
}