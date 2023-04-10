const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const Campground = require('../models/campground');



router.route('/')

    //index page of campgrounds view directory
    .get(catchAsync(campgrounds.index))

    //POST REQ OF NEW CAMPGROUNDS
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

/* ORDER DOES MATTER NUB */

//Add new campground using campgrounds view directory
router.get('/new', isLoggedIn, campgrounds.renderNewForm)



router.route('/:id')
    //Show page of campgrounds view directory
    .get(catchAsync(campgrounds.showCampground))
    //PUT REQ of EDIT REQ of campground
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    //DELETE A CAMPGROUND
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

//EDIT REQ OF CAMPGROUNDS
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))




module.exports = router;