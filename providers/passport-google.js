const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      // options for google strategy
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_OAUTH_CLIENT_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      const userWithGoogleId = await User.findOne({
        google: profile._json.sub,
      });

      const userWithEmail = await User.findOne({
        email: profile._json.email,
      });
      // already googleid -> login
      if (userWithGoogleId) done(null, userWithGoogleId);
      // already have a account with email -> store google id and login
      else if (userWithEmail) {
        userWithEmail.google = profile._json.sub;
        const newUser = await userWithEmail.save();
        done(null, newUser);
      }
      // don't have any id with email or google id -> create one and login
      else {
        const user = new User({
          name: profile._json.name,
          email: profile._json.email,
          profileProto: profile._json.picture,
          activationCode: null,
        });
        const newUser = await user.save();
        done(null, newUser);
      }
    }
  )
);
