module.exports = (req, res, next) => {
    if (req.isAuthenticated()) next()
    else {
        req.flash('err_msg', "You don't have permission to access this page")
        res.redirect('/auth/login')
    }
}
