const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

exports.home_page_get = (req, res, next) => {
  if (req.user) {
    User.findById('6255967b6deeb3c285b9940f', 'friends', (err, result) => {
      Post.find({
        $or: [
          { author: '6255967b6deeb3c285b9940f' },
          { author: result.friends },
        ],
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
            user: req.app.locals.currentUser,
            route: req.baseUrl,
          });
        });
    });
  } else res.redirect('/auth');
};
