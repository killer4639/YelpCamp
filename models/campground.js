const {
    stringify
} = require("querystring");
const Review = require('./review');
const mongoose = require('mongoose');
const {
    func
} = require("joi");
const Schema = mongoose.Schema;
const ImageSchema = new Schema({
    url: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});
const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    images: [ImageSchema],
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

CampgroundSchema.post('findOneAndDelete', async function (campground) {
    if (campground) {
        await Review.remove({
            _id: {
                $in: campground.reviews
            }
        });
    }
})
const Campground = mongoose.model('Campground', CampgroundSchema);
module.exports = Campground;