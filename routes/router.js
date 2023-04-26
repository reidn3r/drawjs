const express = require('express');
const router = express.Router();

//jwt auth
const verifyJWT = require('../controllers/auth/jwtController');

router.get('/',require('../controllers/pages/home'));
router.get('/draw', verifyJWT, require('../controllers/pages/draw'));
router.get('/about', require('../controllers/pages/about'));
router.get('/login', require('../controllers/pages/loginGet'));
router.post('/login', require('../controllers/pages/loginPost'));
router.get('/register', require('../controllers/pages/register'));

router.get('/*', (req, res) => {
    res.redirect('/');
})

module.exports = router;