const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const session = require('express-session')
const expressValidator = require('express-validator')
const fileUpload = require('express-fileupload')
const passport = require('passport')
const methodOverride = require('method-override')

const bcrypt = require('bcryptjs')

const User = require('./models/User')

const app = express()
require('./db')

app.use(expressValidator())
app.use(fileUpload())
app.use(logger('dev'))
app.use(express.json())
app.use(flash())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
//src: https://stackoverflow.com/a/42912079/3705299
app.use(methodOverride(req => req.body._method))
app.use(
    session({
        secret: 'alkhsdfksdhds',
        resave: false,
        saveUninitialized: false,
    })
)

app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    app.locals.appName = 'Sortener'
    app.locals.errors = req.flash('errors')
    app.locals.error = req.flash('error')
    app.locals.err_msg = req.flash('err_msg')
    app.locals.success_msg = req.flash('success_msg')
    app.locals.authenticated = req.isAuthenticated()
    app.locals.user = req.user
    app.locals.title = 'Node Shortener'
    if (req.user) {
        if (req.user.profileProto)
            app.locals.profilePhoto = req.user.profileProto
        else
            app.locals.profilePhoto = `https://www.gravatar.com/avatar/${bcrypt.hashSync(
                req.user.email
            )}`
    }
    next()
})

require('./providers/passport')

app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', '.hbs')

const Authenticated = require('./middlewares/Authenticated')
app.use('/auth', require('./routes/user'))

app.get('/activate/:code', async (req, res) => {
    const user = await User.findOne({ activationCode: req.params.code })

    if (!user) res.send('<h1>Wrong activate token</h1>')

    user.activationCode = null

    await user.save()
    req.flash(
        'success_msg',
        'you account activated successfully, now you login to your account'
    )
    res.redirect('/auth/login')
})

app.use('/', Authenticated, require('./routes/shortener'))
app.get('/:acronym', async (req, res) => {
    const url = await require('./models/Url').findOne({
        acronym: req.params.acronym,
    })

    if (url) {
        res.redirect(url.redirectTo)
    } else {
        res.send(`<h2>No short link found</h2>`)
    }
})

module.exports = app
