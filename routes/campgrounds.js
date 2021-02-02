const express = require('express');
const app = express();
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const methodOverride = require('method-override');
const ExpressError = require('../utils/ExpressError');
const flash = require('connect-flash');
const {
    campgroundSchema
} = require('../schemas.js');
const mongoose = require('mongoose');
const {
    isloggedin,
    isAuthor,
    validateCampground
} = require('../middleware');

const campgrounds = require('../controllers/campgrounds');
const {
    storage
} = require('../cloudinary');
const multer = require('multer');
const upload = multer({
    storage
});










router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isloggedin, upload.array('image'), validateCampground, catchAsync(campgrounds.create))

router.get('/new', isloggedin, campgrounds.renderNewForm);
router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isloggedin, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isloggedin, isAuthor, catchAsync(campgrounds.delete))




router.get('/:id/edit', isloggedin, isAuthor, catchAsync(campgrounds.editCampground));



module.exports = router;