
//ENV//
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


//ALL REQUIRED DEPENDENCIES
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

//Setting UP MONGOOSE
mongoose.set('strictQuery', true);

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log("DATABASE CONNECTED")
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


//All npm callbacks
const app = express();


//all set and use conditons for npm packages
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

//session function
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

//calling the session and flash functions
app.use(session(sessionConfig))  //**This session function should be always called before other session function
app.use(flash());

//calling the passport function
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//how to get user to stay or not stay in a session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//using flash 
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})



//importing contents of route folders
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)


//Default Home Page GET request
app.get('/', (req, res) => {
    res.render('home')
})


//making new campground
// app.get('/makecampground', async (req, res) => {
//     const camp = new Campground({ title: '!!My Backyard', description: 'cheap camping!' });
//     await camp.save();
//     res.send(camp);
// })
//


//creating a 404 error handler
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})


//making default error validator
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})


// SERVER LISTENING ON PORT
app.listen(3000, () => {
    console.log('SERVING ON PORT 3000!')
})