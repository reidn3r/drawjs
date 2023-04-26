const express = require('express');
const router = express.Router();

//jwt auth
const verifyJWT = require('../middleware/jwtController');

//GET Method Routes
router.get('/',require('../controllers/GET/homeController'));
router.get('/draw', verifyJWT, require('../controllers/GET/drawController'));
router.get('/about', require('../controllers/GET/aboutController'));
router.get('/login', require('../controllers/GET/loginController'));
router.get('/register', require('../controllers/GET/registerController'));

//POST Method Routes
router.post('/login', require('../controllers/POST/loginPostController'));
router.post('/register', require('../controllers/POST/registerPostController'));

//Default
router.get('/*', (req, res) => {
    res.redirect('/');
})

module.exports = router;