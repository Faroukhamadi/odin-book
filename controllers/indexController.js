const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

exports.home_page_get = (req, res, next) => {
  // if (req.user) res.render('home');
  // else res.redirect('/auth');
  User.findById('6255967b6deeb3c285b9940f', 'friends', (err, result1) => {
    Post.find({
      $or: [
        { author: '6255967b6deeb3c285b9940f' },
        { author: result1.friends },
      ],
    })
      .populate('author')
      .exec((err, result2) => {
        if (err) return next(err);
        console.log('result2: ', result2);
        res.render('home', {
          data: result2,
        });
      });
  });
};
