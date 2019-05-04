const passport = require('passport')
const bcrypt = require('bcryptjs')
const passportLocalStrategy = require('passport-local').Strategy
const User = require('../models/User')
const { sendActivationMail } = require('../providers/mail')
passport.use(
    new passportLocalStrategy(function(username, password, done) {
        User.findOne({ username: username }, function(err, user) {
            if (err) {
                return done(err)
            }

            if (!user) {
                return done(null, false, { message: 'No user found' })
            }

            const authenticated = bcrypt.compareSync(password, user.password)

            if (user.activationCode != null) {
                sendActivationMail(user.email, {
                    btnUrl: `http://localhost:3000/activate/${
                        user.activationCode
                    }`,
                }).then(sent => {
                    return done(null, false, {
                        message:
                            'Your account did not activated yet, we have sent an activation mail again',
                    })
                })
            } else if (authenticated) done(null, user)
            else done(null, false, { message: 'Wrong password' })
        })
    })
)

passport.serializeUser((user, done) => {
    done(null, user.username)
})

passport.deserializeUser(async (username, done) => {
    const user = await User.findOne({ username })
    done(null, user)
})
