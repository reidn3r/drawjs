const express = require('express');
const router = express.Router();
const verifyJWT = require('../controllers/auth/jwtController');


// router.post('/login', require('../controllers/auth/loginApi'));
router.post('/register', require('../controllers/auth/registerApi'));

module.exports = router;