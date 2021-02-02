const Campground = require('./models/campground');
const ExpressError = require('./utils/ExpressError');
const {
    campgroundSchema,
    reviewSchema
} = require('./schemas.js');
const Review = require('./models/review');
const isloggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in');
        return res.redirect('/login');
    }
    next();
};
const validateReview = (req, res, next) => {
    const result = reviewSchema.validate(req.body);
    if (result.error) {
        const msg = result.error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}
const validateCampground = (req, res, next) => {
    const result = campgroundSchema.validate(req.body);
    if (result.error) {
        const msg = result.error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

const isAuthor = async (req, res, next) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};
const isReviewAuthor = async (req, res, next) => {
    const {
        id,
        reviewId
    } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        req.flash('error', 'Review not found');
        return res.redirect(`/campgrounds/${id}`);
    }
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};
module.exports.isloggedin = isloggedin;
module.exports.isReviewAuthor = isReviewAuthor;
module.exports.isAuthor = isAuthor;
module.exports.validateCampground = validateCampground;
module.exports.validateReview = validateReview;