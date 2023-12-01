const express = require('express');
const router = express.Router();

//jwt auth
const verifyJWT = require('../middleware/jwtMiddleware');
const deleteToken = require('../middleware/deleteToken');
const checkLogin = require('../middleware/checkAuth');

//GET Method Routes
router.get('/', deleteToken, require('../controllers/homeController'));
router.get('/draw', verifyJWT, require('../controllers/drawController'));
router.get('/login', checkLogin, require('../controllers/loginPageController'));
router.get('/register', checkLogin, require('../controllers/registerController'));
router.get('/recruiter', require('../controllers/recruiterAuthController'));

//POST Method Routes
router.post('/login', require('../controllers/authController'));
router.post('/register', require('../controllers/registerPostController'));

//Default
router.get('/*', (req, res) => {
    res.redirect('/');
})

module.exports = router;