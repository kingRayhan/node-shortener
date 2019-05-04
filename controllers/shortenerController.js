const Url = require('../models/Url')
const shortId = require('shortid')

module.exports.createShortLink = async (req, res) => {
    if (req.body.redirectTo.length === 0)
        req.check('redirectTo', 'Redirect url is required').custom(() => false)
    else req.check('redirectTo', 'Redirect url is not valid').isURL()

    if (req.body.acronym.length > 0)
        req.check(
            'acronym',
            'Acronym name should be atleast 6 character'
        ).isLength({ min: 6 })

    const isAcronymExists = await Url.findOne({ acronym: req.body.acronym })
    if (isAcronymExists)
        req.check(
            'acronym',
            `Acronym ${req.body.acronym} already taken`
        ).custom(() => false)

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

module.exports.updateShortLink = async (req, res) => {
    const url = await Url.findById(req.body._id)

    const acronymExists = await Url.findOne({
        acronym: req.body.acronym,
    })
    // if acronym already has in db and matched with body acronym then proceed
    if (acronymExists && acronymExists.acronym == url.acronym) {
    } else req.check('acronym')
    // cronym did not stored in database then proceed

    // if (req.validationErrors()) {
    //     req.flash('errors', req.validationErrors())
    // } else {
    //     url.acronym = req.body.acronym
    //     url.redirectTo = req.body.redirectTo
    //     await url.save()
    //     req.flash('success_msg', 'Link updated')
    // }
    res.json(req.validationErrors())
    // res.redirect('back')
}
module.exports.deleteShortLink = async (req, res) => {
    const deleted = await Url.findByIdAndDelete(req.body._id)
    if (!deleted) {
        req.flash('error', 'Link not found')
    } else {
        req.flash('success_msg', 'Link Deleted successfully')
    }

    res.redirect('back')
}
