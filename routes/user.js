const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/user');


router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.createUser))


router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: true
    }), users.login);



router.get('/logout', users.logout)

module.exports = router;