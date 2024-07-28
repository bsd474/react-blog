const router = require('express').Router();
const { getUsers, getUserById, updateUser, getUsersCount, uploadAvatar, deleteUser } = require('../controllers/UsersController');
const { verifyTokenAdmin, verifyTokenUser, verifyUserAccess, verifyUserAndAdmin } = require('../middlewares/verifyToken');
const validateObjectID = require('../middlewares/validateObjectID');
const handleAvatarUpload = require('../middlewares/uploadAvatar');

// /api/users/profile
router.route('/profile').get(verifyTokenAdmin, getUsers);

// /api/users/profile/:id
router.route('/profile/:id')
    .get(validateObjectID, getUserById)
    .put(validateObjectID, verifyTokenUser, verifyUserAccess, updateUser)
    .delete(validateObjectID, verifyUserAndAdmin, deleteUser);

// /api/users/profile/upload-avatar
router.route('/profile/upload-avatar').post(verifyTokenUser, handleAvatarUpload.single("image"), uploadAvatar);

// /api/users/count
router.route('/count').get(verifyTokenAdmin, getUsersCount);

module.exports = router;
