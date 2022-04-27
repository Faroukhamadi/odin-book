const User = require('../models/user');
const Post = require('../models/post');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { body, validationResult } = require('express-validator');

exports.absolute_path = (req, res, next) => {
  if (req.user) res.redirect('/');
  else res.redirect('/auth');
};

exports.send_friend_request = (req, res, next) => {
  if (req.user) {
    User.findByIdAndUpdate(
      req.params.id,
      { $push: { friendRequests: req.user._id } },
      (err, result) => {
        if (err) {
          console.log('Err: ', err);
          return next(err);
        } else res.redirect('/users/index-page');
      }
    );
  } else res.redirect('/auth');
};

exports.accept_friend_request = (req, res, next) => {
  if (req.user) {
    User.updateOne(
      { _id: req.user._id },
      {
        $pull: {
          friendRequests: req.params.id,
        },
      },
      (err, user) => {
        if (err) {
          console.log('err: ', err);
          return next(err);
        } else
          User.findByIdAndUpdate(
            req.user._id,
            { $push: { friends: req.params.id } },
            (err, user) => {
              if (err) {
                console.log('Err: ', err);
                return next(err);
              } else res.redirect('/users/friend-requests');
            }
          );
      }
    );
  } else res.redirect('/auth');
};

exports.user_index_get = async (req, res, next) => {
  if (req.user) {
    let user = await User.findById(req.user._id);
    User.find(
      {
        $and: [
          { _id: { $ne: user._id } },
          { _id: { $nin: user.friends } },
          { _id: { $nin: user.friendRequests } },
          { friendRequests: { $ne: user._id } },
        ],
      },
      (err, users) => {
        if (err) {
          console.log('Err: ', err);
          return next(err);
        }
        res.render('users_index', { data: users });
      }
    );
  } else res.redirect('/auth');
};

exports.user_show_get = (req, res, next) => {
  if (req.user) {
    User.findById(req.params.id)
      .populate({
        path: 'posts',
        populate: {
          path: 'comments',
          populate: {
            path: 'author',
            select: '-_id picture first_name last_name',
          },
        },
      })
      .exec((err, userProfile) => {
        if (err) {
          console.log('Err:', err);
          return next(err);
        }
        res.render('user_show', {
          data: userProfile,
          route: req.baseUrl,
        });
      });
  } else res.redirect('/auth');
};

exports.friend_requests_get = (req, res, next) => {
  if (req.user) {
    User.findById(req.user._id, 'friendRequests')
      .populate({
        path: 'friendRequests',
        select: 'first_name last_name hometown friends picture',
      })
      .exec((err, result) => {
        if (err) {
          console.log('Err: ', err);
          return next(err);
        }
        res.render('friend_requests', { data: result });
      });
  } else res.redirect('/auth');
};

// ------------- POSTMAN TESTING SECTION -------------
exports.send_friend_request_test = (req, res, next) => {
  User.findByIdAndUpdate(
    req.body.receiverId,
    { $push: { friendRequests: req.body.senderId } },
    (err, result) => {
      if (err) console.log('error: ', err);
      else res.json({ result });
    }
  );
};

exports.accept_friend_request_test = (req, res, next) => {
  User.updateOne(
    { _id: req.body.receiverId },
    {
      $pull: {
        friendRequests: req.body.senderId,
      },
    },
    (err, user) => {
      if (err) {
        console.log('err: ', err);
        return next(err);
      } else
        User.findByIdAndUpdate(
          req.body.receiverId,
          { $push: { friends: req.body.senderId } },
          (err, user) => {
            if (err) console.log(err);
            else res.json({ user });
          }
        );
    }
  );
};

exports.user_index_get_test = async (req, res, next) => {
  let user = await User.findById('6255964096305191e8a91dac');
  User.find(
    {
      $and: [
        { _id: { $ne: user._id } },
        { _id: { $nin: user.friends } },
        { _id: { $nin: user.friendRequests } },
        { friendRequests: { $ne: user._id } },
      ],
    },
    (err, users) => {
      if (err) {
        console.log('Err: ', err);
        return next(err);
      }
      res.render('users_index', { data: users });
    }
  );
};

exports.user_show_get_test = (req, res, next) => {
  User.findById('6255964096305191e8a91dac')
    .populate({
      path: 'posts',
      populate: {
        path: 'comments',
        // NOTE: Might need the id in select later
        populate: {
          path: 'author',
          select: '-_id picture first_name last_name',
        },
      },
    })
    .exec((err, userProfile) => {
      if (err) {
        console.log('Err:', err);
        return next(err);
      }
      res.render('user_show', {
        data: userProfile,
      });
      // res.json({ userProfile });
    });
};

exports.friend_requests_get_test = (req, res, next) => {
  User.findById('6255964096305191e8a91dac', 'friendRequests')
    .populate({
      path: 'friendRequests',
      select: 'first_name last_name hometown friends picture',
    })
    .exec((err, result) => {
      if (err) {
        {
          console.log('Err: ', err);
          return next(err);
        }
        return next(err);
      }
      res.json({ result });
    });
};
