const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const Campground = require('../models/campground');

router.get('/', catchAsync(campgrounds.index));
router.get('/new', isLoggedIn, campgrounds.renderNewForm)
router.post('/', isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))

router.get('/:id', catchAsync(campgrounds.show));
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.edit))
router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCamp));
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCamp));

module.exports = router;