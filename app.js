const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook');

const mongoDB =
  'mongodb+srv://faroukhamadi:16042002farouk@cluster0.bghb5.mongodb.net/odin-book?retryWrites=true&w=majority';

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/connect');

const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

passport.use(
  new FacebookStrategy({
    clientID: '1149729539160115',
    clientSecret: '073e427f59b870ca24294b363a6b3532',
    callbackURL: 'https://www.example.com/oauth2/redirect/facebook',
    profile: [
      'id',
      'email',
      'first_name',
      'last_name',
      'hometown',
      'gender',
      'picture',
      'displayName',
    ],
  }),
  (accessToken, refreshToken, profile, done) => {
    User.findOne({ facebook_id: profile.id }, (err, user) => {
      if (err) console.log(err);

      if (user) {
        console.log('display Name if user exists: ', profile.displayName);
        // If User already exists login
        done(null, user);
      } else {
        // create new user
        user = new User({
          facebook_id: profile.id,
          email: profile.email,
          first_name: profile.first_name,
          last_name: profile.last_name,
          hometown: profile.hometown,
          gender: profile.gender,
          picture: profile.picture,
        });
        user.save((err) => {
          if (err) console.log(err);
          else {
            console.log('saving user ...');
            done(null, user);
          }
        });
      }
    });
  }
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
