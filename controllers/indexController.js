const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const async = require('async');

exports.home_page_get = (req, res, next) => {
  // if (req.user) res.render('home');
  // else res.redirect('/auth');

  let posts = [];
  User.findById('6255967b6deeb3c285b9940f', 'friends', (err, result1) => {
    Post.find(
      {
        $or: [
          { author: '6255967b6deeb3c285b9940f' },
          { author: result1.friends },
        ],
      },
      (err, result2) => {
        res.render('home', {
          data: result2,
        });
      }
    );
  });

  // let posts = [];
  // Post.find({ author: '6255964096305191e8a91dac' }, (err, result) => {
  //   posts = [...result];
  //   console.log('result: ', result);
  //   User.find(
  //     { _id: '6255967b6deeb3c285b9940f' },
  //     'friends',
  //     (err, result1) => {
  //       console.log('result1: ', result1[0].friends);
  //       posts = [...posts, ...result1[0].friends];
  //       console.log('posts: ', posts);
  //     }
  //   );
  // });
  // ----------------------SEPARATORNOTE:-------------------
  // async.parallel(
  //   {
  //     user_posts: (callback) => {
  //       // TODO: reset this later
  //       // Post.findById(req.user._id, callback);
  //       Post.find({ author: '6255967b6deeb3c285b9940f' }, callback);
  //     },
  //     friends: (callback) => {
  //       User.find({ _id: '6255967b6deeb3c285b9940f' }, 'friends', callback);
  //     },
  //   },
  //   (err, results) => {
  //     console.log('data: ', results);
  //     res.render('home', {
  //       data: results,
  //     });
  //   }
  // );
};
