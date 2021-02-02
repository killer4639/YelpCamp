const express = require('express')
const router = express.Router({
    mergeParams: true
});

const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const methodOverride = require('method-override');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const {
    validateReview,
    isloggedin,
    isReviewAuthor
} = require('../middleware');
const reviews = require('../controllers/reviews');






router.post('/', isloggedin, validateReview, catchAsync(reviews.create));
router.delete('/:reviewId', isloggedin, isReviewAuthor, catchAsync(reviews.delete));
module.exports = router;