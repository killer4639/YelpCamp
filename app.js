if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const ejsMate = require('ejs-mate');
const {
    captureRejectionSymbol
} = require('events');
const methodOverride = require('method-override');
const {
    findByIdAndDelete
} = require('./models/campground');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const {
    campgroundSchema
} = require('./schemas.js');
const review = require('./models/review');
const Review = require('./models/review');
const {
    reviewSchema
} = require('./schemas');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const session = require('express-session');
const {
    date
} = require('joi');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const userRoutes = require('./routes/user');
const {
    isloggedin
} = require('./middleware')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
const MongoDBStore = require('connect-mongo')(session);
//'mongodb://localhost:27017/yelp-camp'
mongoose.connect(
    dbUrl, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
mongoose.set('useFindAndModify', false);
app.use(express.urlencoded({
    extended: true
}));
app.use(methodOverride('_method'));
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
const secret = process.env.SECRET || 'thisishivagupta';
const store = new MongoDBStore({
    url: dbUrl,
    secret: secret,
    touchAfter: 24 * 60 * 60
});
store.on("error", function (e) {
    console.log("Session store error", e);
});
const sessionConfig = {
    store,
    name: 'session',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure:true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: (1000 * 60 * 60 * 24 * 7)

    }
};
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(mongoSanitize());
app.use(helmet({
    contentSecurityPolicy: false
}));





passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
















app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});
app.get('/', (req, res) => {
    res.render('home')
});
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});
app.use((err, req, res, next) => {
    const {
        statusCode = 500
    } = err;
    if (!err.message) {
        err.message = "Something went Wrong";
    }
    res.status(statusCode).render('error', {
        err
    });
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});