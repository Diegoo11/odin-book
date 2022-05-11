const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('./models/user')

function verify() {
  passport.use(new FacebookStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: process.env.callbackURL,
    profileFields: ['id', 'displayName', 'photos', 'email', 'birthday']
  },
  function(accesToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, { photo: profile.photos[0].value, username: profile.displayName}, function (err, user) {
      return cb(err, user);
    });
  }))
  console.log('funciona el verify')
}

module.exports = verify