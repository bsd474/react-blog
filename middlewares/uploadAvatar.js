const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../assets/uploads/avatars'));
    },
    filename: function (req, file, cb) {
        if (!file) {
            cb(null, false);
        } else {
            const uniqueSuffix = new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname;
            cb(null, uniqueSuffix);
        }
    }
});

// middleware to handle avatar upload
const handleAvatarUpload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!file.mimetype.startsWith('image')) {
            return cb(new Error('Unsupported image format, please try again...'), false);
        } else {
            cb(null, true);
        }
    },
    limits: { fileSize: 1024 * 1024 * 2 } // 2MB
});

module.exports = handleAvatarUpload;
