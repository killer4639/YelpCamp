const Review = require('../models/review');
const Campground = require('../models/campground');
module.exports.create = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review');
    res.redirect(`/campgrounds/${campground._id}`);
};
module.exports.delete = async (req, res, next) => {
    const {
        id,
        reviewId
    } = req.params;
    const campground = await Campground.findById(id);
    await Campground.updateOne({
        _id: id
    }, {
        $pull: {
            reviews: {
                _id: reviewId
            }
        }
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/campgrounds/${campground._id}`);
};