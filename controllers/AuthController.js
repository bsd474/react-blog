const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { User, validateSignupUser, validateSignInUser } = require('../models/User');

// ==============================================
// @desc    Sign up a new user
// @route   POST= /api/auth/signup
// @access  Public
// ==============================================

module.exports.signup = asyncHandler(async (req, res) => {

    // validate the request
    const { error } = validateSignupUser(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // check if the user already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // save the user
    user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    });
    await user.save();

    // @TODO: send email verification link

    // return the response
    res.status(201).json({ message: 'User created successfully' });
});

// ==============================================
// @desc    Sign in a user
// @route   POST= /api/auth/signin
// @access  Public
// ==============================================

module.exports.signin = asyncHandler(async (req, res) => {
    // validate the request
    const { error } = validateSignInUser(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // check if the user exists
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    // check if the password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid email or password' });

    // create a token
    const token = user.generateToken(); // createToken(user._id);


    // @TODO: send email verification link if the user is not verified


    // return the response
    res.status(200).json({
        token: token,
        user: {
            _id: user._id,
            profilePic: user.profilePic,
            isAdmin: user.isAdmin,
        },
    });
});