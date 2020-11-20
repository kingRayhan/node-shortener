const passport = require("passport");
const passportLocalStrategy = require("passport-local").Strategy;

passport.use(
  new passportLocalStrategy(function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, { message: "No user found" });
      }

      const authenticated = bcrypt.compareSync(password, user.password);

      if (user.activationCode != null) {
        sendActivationMail(user.email, {
          btnUrl: `http://localhost:3000/activate/${user.activationCode}`,
          btnText: "Activate your account",
        }).then((sent) => {
          return done(null, false, {
            message:
              "Your account did not activated yet, we have sent an activation mail again",
          });
        });
      } else if (authenticated) done(null, user);
      else done(null, false, { message: "Wrong password" });
    });
  })
);
