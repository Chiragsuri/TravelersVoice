//ALL REQUIRED DEPENDENCIES
const express = require('express')
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema } = require('./schemas.js');



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

//creating a valdate campground function which checks as schemas inputs
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


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




//index page of campgrounds view directory
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));

/* ORDER DOES MATTER NUB */

//Add new campground using campgrounds view directory
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

//POST REQ OF NEW CAMPGROUNDS
app.post('/campgrounds', validateCampground, catchAsync(async (req, res) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

//Show page of campgrounds view directory
app.get('/campgrounds/:id', catchAsync(async (req, res,) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', { campground });
}));

//EDIT REQ OF CAMPGROUNDS
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
}));

//PUT REQ of EDIT REQ of campground
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
}));

//DELETE A CAMPGROUND
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));


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