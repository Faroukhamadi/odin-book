const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.local_signup_get = (req, res) => {
  res.render('signup');
};

exports.local_signup_post = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    if (err) return next(err);
    const user = new User({
      facebook_id: '',
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      hometown: req.body.hometown,
      gender: req.body.gender,
      picture:
        'https://scontent.ftun16-1.fna.fbcdn.net/v/t1.30497-1/84628273_176159830277856_972693363922829312_n.jpg?stp=c59.0.200.200a_dst-jpg_p200x200&_nc_cat=1&ccb=1-5&_nc_sid=12b3be&_nc_ohc=v46NUOVFoFgAX8HwWaV&_nc_ht=scontent.ftun16-1.fna&edm=AP4hL3IEAAAA&oh=00_AT-iZttniIR8os5NzZBzawNpdOCn3c-c7tD9ukbget_p8A&oe=62794C99',
      birthday: '0' + req.body.month + '/' + req.body.day + '/' + req.body.year,
      password: hashedPassword,
    });
    user.save((err) => {
      if (err) return next(err);
      res.redirect('/auth');
    });
  });
};

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

exports.local_login_post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth',
});

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};
