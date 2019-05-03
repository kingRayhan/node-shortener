const Url = require('../models/Url')
const shortId = require('shortid')

module.exports.createShortLink = async (req, res) => {
    if (req.body.redirectTo.length === 0)
        req.check('redirectTo', 'Redirect url is required').isLength({ min: 1 })
    else req.check('redirectTo', 'Redirect url is not valid').isURL()

    if (req.body.acronym.length > 0)
        req.check(
            'acronym',
            'Acronym name should be atleast 6 character'
        ).isLength({ min: 6 })

    if (req.validationErrors()) {
        req.flash('errors', req.validationErrors())
        res.redirect('back')
    } else {
        req.flash('success_msg', 'Short link created successfully')

        let acronym
        if (req.body.acronym.length === 0) acronym = shortId.generate()
        else acronym = req.body.acronym

        const url = new Url({
            acronym,
            redirectTo: req.body.redirectTo,
            author: req.user._id,
        })
        await url.save()
        res.redirect('/')
    }
}
