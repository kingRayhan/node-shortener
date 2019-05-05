const GitHubStrategy = require('passport-github2').Strategy
const passport = require('passport')

passport.use(
    new GitHubStrategy(
        {
            clientID: '21280bea7df37f0b02ca',
            clientSecret: 'f82b6921316f3b2593f1543827e0a063487be11c',
            callbackURL: '/auth/oauth-redirect/github',
        },
        function(accessToken, refreshToken, profile, done) {
            console.log(profile)
        }
    )
)
