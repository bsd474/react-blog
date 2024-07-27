const router = require('express').Router();
const { getUsers, getUserById, updateUser, getUsersCount } = require('../controllers/UsersController');
const {verifyTokenAdmin, verifyTokenUser} = require('../middlewares/verifyToken');
const validateObjectID = require('../middlewares/validateObjectID');

// /api/users/profile
router.route('/profile').get(verifyTokenAdmin ,getUsers);

// /api/users/:id
router.route('/profile/:id')
    .get(validateObjectID, getUserById)
    .put(validateObjectID, verifyTokenUser, updateUser);

// /api/users/count
router.route('/count').get(verifyTokenAdmin, getUsersCount);

module.exports = router;