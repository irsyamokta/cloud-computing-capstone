const express = require('express');
const { registerUser, loginUser, protectedRoute, logoutUser } = require('../controllers/AuthenticateController.js');
const { getUsers, getUserById, updateUser } = require('../controllers/UserController.js');
const { verifyToken } = require('../middleware/AuthMiddleware.js');
const upload = require('../middleware/MulterConfig.js');

const router = express.Router();

router.get('/users', getUsers);
router.get('/user/:id', getUserById);
router.put('/user/:id', upload.single('image'), updateUser);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/protected', verifyToken, protectedRoute);
router.post('/logout', logoutUser);

module.exports = router;
