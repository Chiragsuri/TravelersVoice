const User = require('../models/user');

//default page of /register
module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

//Post req of /register which will process the username email and Hash the password
//It will even check if there already exist a user with same Credentials
module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

//this is a login route after registering
module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

//checking login Credentials of a User
module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

//login out a user OR terminating a session
module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/campgrounds');
    });
}