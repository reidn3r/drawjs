const path = require('path');
const fs = require('fs');
const Jimp = require('jimp');
const tf = require('@tensorflow/tfjs-node');

const express = require('express');
const router = express.Router();

router.get('/', require('../controllers/home'));
router.get('/draw', require('../controllers/draw'));
router.get('/about', require('../controllers/about'));

module.exports = router;