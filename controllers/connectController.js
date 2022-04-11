const passport = require('passport');

exports.facebook_login_post = passport.authenticate('facebook', {
  scope: [
    'email',
    'public_profile',
    'user_friends',
    'user_gender',
    'user_hometown',
    'user_location',
    'user_birthday',
  ],
});
exports.facebook_login_redirect = passport.authenticate('facebook', {
  failureRedirect: '/login',
  successRedirect: '/',
});
