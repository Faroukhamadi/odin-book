const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const session = require('express-session');
const bcrypt = require('bcrypt');

const mongoDB =
  'mongodb+srv://faroukhamadi:16042002farouk@cluster0.bghb5.mongodb.net/odin-book?retryWrites=true&w=majority';

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(
  session({
    secret: 'cat',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// NOTE: Facebook Log In Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: '1149729539160115',
      clientSecret: '073e427f59b870ca24294b363a6b3532',
      callbackURL: 'http://localhost:3000/auth/redirect/facebook',
      profileFields: [
        'id',
        'email',
        'gender',
        'link',
        'locale',
        'name',
        'timezone',
        'hometown',
        'updated_time',
        'verified',
        'location',
        'friends',
        'birthday',
        'picture.type(large)',
      ],
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({ facebook_id: profile.id }, function (err, user) {
        if (err) return done(err);
        if (!user) {
          console.log('No user section');
          console.log(user);
          console.log('profile: ', profile);
          // create new user
          user = new User({
            facebook_id: profile.id,
            email: profile.emails[0].value,
            first_name: profile._json.first_name,
            last_name: profile._json.last_name,
            password: '',
            hometown: profile._json.hometown ? profile._json.hometown.name : '',
            birthday: profile._json.birthday,
            gender: profile.gender,
            picture: profile.photos
              ? profile.photos[0].value
              : '/img/face/unknown-user-pic.jpg',
            display_name: profile.displayName,
          });
          user.save(function (err) {
            if (err) return done(err);
            else {
              console.log('saving user ...');
              console.log(user);
              console.log('profile: ', profile);
              done(null, user);
            }
          });
        } else {
          console.log('user section');
          console.log('display Name if user exists: ', profile.displayName);
          console.log(user);
          console.log('profile: ', profile);
          // If User already exists login
          done(null, user);
        }
      });
    }
  )
);

// NOTE: Local Log In Strategy
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ email: username }, (err, user) => {
      console.log('LOCAL STRATEGY FUNCTION IS EXECUTING');
      if (err) return done(err);
      if (!user) {
        console.log('NO USER');
        return done(null, false, { message: 'Incorrect username' });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          console.log('LOG USER IN!');
          console.log('This is user: ', user);
          return done(null, user);
        } else {
          // passwords do not match
          console.log('password: ', password, 'userPassword: ', user.password);
          console.log('PASSWORDS DO NOT MATCH');
          return done(null, false, { message: 'Incorrect password' });
        }
      });
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  console.log('req user: ', req.user);
  console.log('res.locals.currentUser', res.locals.currentUser);
  res.locals.currentUser = req.user;
  res.app.locals.currentUser = req.user;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
