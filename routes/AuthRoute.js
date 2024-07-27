const router = require('express').Router();
const { signup, signin } = require('../controllers/AuthController');

// api/auth/signup
router.post('/signup', signup);

// api/auth/signin
router.post('/signin', signin);


module.exports = router;