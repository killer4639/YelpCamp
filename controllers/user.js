const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};
module.exports.createUser = async (req, res) => {
    try {
        const {
            email,
            username,
            password
        } = req.body;
        const user = new User({
            email,
            username
        });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to Yelp Camp');
            const redirectURL = req.session.returnTo || '/campgrounds';
            delete req.session.returnTo;
            res.redirect(redirectURL);
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
};
module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};
module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectURL = req.session.returnTo || '/campgrounds';
    res.redirect(redirectURL);
};
module.exports.logout = (req, res) => {
    req.logOut();
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
};