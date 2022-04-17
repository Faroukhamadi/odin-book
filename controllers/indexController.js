const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const async = require('async');

exports.home_page_get = (req, res, next) => {
  // if (req.user) res.render('home');
  // else res.redirect('/auth');
  async.parallel(
    {
      user_posts: (callback) => {
        // TODO: reset this later
        // Post.findById(req.user._id, callback);
        Post.findById('62576bd91e28ad2561679a94', callback);
      },
      friends_posts: (callback) => {
        User.find({}, 'friends', callback);
      },
    },
    (err, results) => {
      res.render('home', {
        data: results,
      });
    }
  );
};
