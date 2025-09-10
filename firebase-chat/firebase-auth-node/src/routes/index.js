const express = require('express');
const router = express.Router();
//const verifyToken = require('../middleware');

const firebaseAuthController = require('../controllers/firebase-auth-controller');
//const PostsController = require('../controllers/posts-controller.js');
const usersController = require('../controllers/users-controller.js');


// Auth routes
router.post('/firebase/auth/register', firebaseAuthController.registerUser);
router.post('/firebase/auth/login', firebaseAuthController.loginUser);
router.post('/firebase/auth/logout', firebaseAuthController.logoutUser);
router.post('/firebase/auth/reset-password', firebaseAuthController.resetPassword);

//posts routes
//router.get('/api/posts', verifyToken, PostsController.getPosts);

// User routes
router.post('/firebase/user/getUserbyUID', usersController.getUserbyUID);
router.post('/firebase/user/getUserbyEmail', usersController.getUserbyEmail);
router.post('/firebase/user/getAllUsers', usersController.getAllUsers);

module.exports = router;