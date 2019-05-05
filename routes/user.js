const Router = require('express').Router()
const {
    getLogin,
    registerUser,
    updateUser,
} = require('../controllers/authController')
const User = require('../models/User')
const passport = require('passport')
const notAuthenticated = require('../middlewares/notAuthenticated')
const Authenticated = require('../middlewares/Authenticated')
const { sendActivationMail } = require('../providers/mail')
/**
 * Get pages
 */
Router.get('/login', notAuthenticated, (req, res) => {
    res.render('auth/login')
})
Router.get('/register', notAuthenticated, (req, res) => {
    res.render('auth/register')
})

Router.get('/settings', Authenticated, (req, res) => {
    const user = req.user
    res.render('auth/user-settings', { user })
})

Router.get('/logout', Authenticated, (req, res) => {
    req.logOut()
    res.redirect('/auth/login')
})

Router.post('/settings', Authenticated, updateUser)
Router.post('/register', registerUser)
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

Router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    })
)
Router.get(
    '/github',
    passport.authenticate('github', {
        scope: ['profile'],
    })
)

Router.get(
    '/oauth-redirect/google',
    passport.authenticate('google'),
    (req, res) => {
        res.redirect('/auth/settings')
    }
)
Router.get(
    '/oauth-redirect/github',
    passport.authenticate('google'),
    (req, res) => {
        res.redirect('/auth/settings')
    }
)

module.exports = Router
