const express = require('express');
const router = express.Router();

//jwt auth
const verifyJWT = require('../middleware/jwtMiddleware');

//GET Method Routes
router.get('/',require('../controllers/homeController'));
router.get('/draw', verifyJWT, require('../controllers/drawController'));
router.get('/login', require('../controllers/loginPageController'));
router.get('/register', require('../controllers/registerController'));

//POST Method Routes
router.post('/login', require('../controllers/authController'));
router.post('/register', require('../controllers/registerPostController'));

//Default
router.get('/*', (req, res) => {
    res.redirect('/');
})

module.exports = router;