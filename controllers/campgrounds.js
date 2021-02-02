const Campground = require('../models/campground');
const {
    cloudinary
} = require('../cloudinary')
const mongoose = require('mongoose');




module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {
        campgrounds
    });
};
module.exports.create = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
};
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};
module.exports.showCampground = async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    res.render('campgrounds/show', {
        campground
    });
};
module.exports.editCampground = async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {
        campground
    });
};
module.exports.updateCampground = async (req, res, next) => {
    const id = req.params.id;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground
    });
    await Campground.updateOne({
        _id: id
    }, {
        $push: {
            images: req.files.map(f => ({
                url: f.path,
                filename: f.filename
            }))
        }
    });
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({
            $pull: {
                images: {
                    filename: {
                        $in: req.body.deleteImages
                    }
                }
            }
        });
    }
    await campground.save();
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${id}`);
};
module.exports.delete = async (req, res, next) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    for (let filename of campground.images.filename) {
        await cloudinary.uploader.destroy(filename);
    }
    await Campground.deleteOne({
        _id: id
    });
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds');
};