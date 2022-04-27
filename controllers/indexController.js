const Post = require('../models/post');
const User = require('../models/user');

exports.home_page_get = (req, res, next) => {
  if (req.user) {
    User.findById(req.user._id, 'friends', (err, result) => {
      Post.find({
        $or: [{ author: req.user._id }, { author: result.friends }],
      })
        .populate('author')
        .populate({
          path: 'comments',
          populate: { path: 'author' },
        })
        .exec((err, results) => {
          if (err) return next(err);
          res.render('home', {
            data: results,
          });
        });
    });
  } else res.redirect('/auth');
};
