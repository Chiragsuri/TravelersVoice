module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //store the url that someone is requesting on the website 
        //and redirect after login
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}