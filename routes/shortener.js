const Router = require('express').Router()
const {
    createShortLink,
    updateShortLink,
    deleteShortLink,
} = require('../controllers/shortenerController')
const Url = require('../models/Url')

Router.get('/', async (req, res) => {
    const urls = await Url.find({ author: req.user._id })
    res.render('shortener/url-list', { urls })
})

Router.get('/create', (req, res) => {
    res.render('shortener/create', { title: 'Create new short link' })
})

Router.get('/:_id/edit', async (req, res) => {
    const url = await Url.findOne({ _id: req.params._id })
    res.render('shortener/edit', { title: 'Update short link', url })
})

Router.post('/shortlink', createShortLink)
Router.put('/shortlink', updateShortLink)
Router.delete('/shortlink', deleteShortLink)

module.exports = Router
