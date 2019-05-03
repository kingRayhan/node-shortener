const Router = require('express').Router()
const { createShortLink } = require('../controllers/shortenerController')
const Url = require('../models/Url')
Router.get('/', async (req, res) => {
    const urls = await Url.find({ author: req.user._id })
    res.render('home', { urls })
})
Router.get('/create', (req, res) => {
    res.render('create-shortlink', { title: 'Create new short link' })
})
Router.get('/edit', (req, res) => {
    res.render('edit-shortlink', { title: 'Create new short link' })
})

Router.get('/:acronym/edit', async (req, res) => {
    const url = await Url.findOne({ acronym: req.params.acronym })
    res.render('edit-shortlink', { title: 'Update short link', url })
})

Router.post('/create', createShortLink)

module.exports = Router
