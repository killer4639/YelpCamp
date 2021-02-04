const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/user');
const Campground = require('../models/campground');


router.get('/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    const campgrounds = await Campground.find({
        'author': userId
    });
    res.render('users/show', {
        user,
        campgrounds
    });
});
router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.createUser))


router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: true
    }), users.login);

// router.get('/user/:userId', catchAsync((req, res, next) => {
//     res.send(`working`);
// }));

router.get('/logout', users.logout)

module.exports = router;