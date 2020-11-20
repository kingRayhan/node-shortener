const passport = require("passport");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const { sendActivationMail } = require("../providers/mail");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  const user = await User.findById(userId);
  done(null, user);
});
