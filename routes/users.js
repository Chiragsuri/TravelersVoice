const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');


//default page of /register
router.route('/register')
    //default page of /register
    .get(users.renderRegister)
    //Post req of /register which will process the username email and Hash the password
    //It will even check if there already exist a user with same Credentials
    .post(catchAsync(users.register));



router.route('/login')
    //this is a login route after registering
    .get(users.renderLogin)
    //checking login Credentials of a User
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)





//login out a user OR terminating a session
router.get('/logout', users.logout)

module.exports = router;