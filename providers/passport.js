const passport = require('passport')
const bcrypt = require('bcryptjs')
const passportLocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
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
                    btnText: 'Activate your account',
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

passport.use(
    new GoogleStrategy(
        {
            // options for google strategy
            clientID:
                '544586221179-vs1abbim2kojlk628kbh0vdsla3oa465.apps.googleusercontent.com',
            clientSecret: 'PqesSmmK8YEbMAHIH98ve45a',
            callbackURL: '/auth/oauth-redirect/google',
        },
        async (accessToken, refreshToken, profile, done) => {
            const userWithGoogleId = await User.findOne({
                google: profile._json.sub,
            })

            const userWithEmail = await User.findOne({
                email: profile._json.email,
            })
            // already googleid -> login
            if (userWithGoogleId) done(null, userWithGoogleId)
            // already have a account with email -> store google id and login
            else if (userWithEmail) {
                userWithEmail.google = profile._json.sub
                const newUser = await userWithEmail.save()
                done(null, newUser)
            }
            // don't have any id with email or google id -> create one and login
            else {
                const user = new User({
                    name: profile._json.name,
                    email: profile._json.email,
                    profileProto: profile._json.picture,
                    activationCode: null,
                })
                const newUser = await user.save()
                done(null, newUser)
            }
        }
    )
)

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (userId, done) => {
    const user = await User.findById(userId)
    done(null, user)
})
