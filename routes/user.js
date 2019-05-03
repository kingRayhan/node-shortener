const Router = require('express').Router()
const {
    getLogin,
    registerUser,
    updateUser,
} = require('../controllers/authController')

const passport = require('passport')
const notAuthenticated = require('../middlewares/notAuthenticated')
const Authenticated = require('../middlewares/Authenticated')

/**
 * Get pages
 */
Router.get('/login', notAuthenticated, (req, res) => {
    res.render('login')
})
Router.get('/register', notAuthenticated, (req, res) => {
    res.render('register')
})

/**
 * Authenticate User with passport
 */
Router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true,
    })(req, res, next)
})

Router.post('/settings', Authenticated, updateUser)

Router.get('/settings', Authenticated, (req, res) => {
    const user = req.user
    res.render('user-settings', { user })
})

Router.get('/logout', Authenticated, (req, res) => {
    req.logOut()
    res.redirect('/auth/login')
})

Router.post('/register', registerUser)

module.exports = Router
