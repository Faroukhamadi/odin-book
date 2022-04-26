const User = require('../models/user');
const Post = require('../models/post');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { body, validationResult } = require('express-validator');

exports.send_friend_request = (req, res, next) => {
  console.log('handler function executing');
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
};

exports.accept_friend_request = (req, res, next) => {
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
};

exports.user_index_get = async (req, res, next) => {
  let user = await User.findById(req.user._id);
  console.log('user: ', user);
  // I don't want myself to be in the list
  // I'm friends with: Casper Spencer
  // I have a friend request from hayet
  // I don't want people I've sent a friend request to be on the list: - Maverick
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
        {
          console.log('Err: ', err);
          return next(err);
        }
        return next(err);
      }
      console.log('users: ', users);
      // res.json({ users });
      console.log('data:', users);
      res.render('users_index', { data: users });
    }
  );
};

exports.user_show_get = (req, res, next) => {
  User.findById(req.params.id)
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
      console.log({ data: userProfile });
      res.render('user_show', {
        data: userProfile,
        route: req.baseUrl,
      });
    });
};

exports.friend_requests_get = (req, res, next) => {
  console.log('hello');
  console.log('hello');
  console.log('yes', req.user._id);
  User.findById(req.user._id, 'friendRequests')
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
      console.log('last resulttttttt-', result);
      res.render('friend_requests', { data: result });
    });
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
  console.log('user: ', user);
  // I don't want myself to be in the list
  // I'm friends with: Casper Spencer
  // I have a friend request from hayet
  // I don't want people I've sent a friend request to be on the list: - Maverick
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
        {
          console.log('Err: ', err);
          return next(err);
        }
        return next(err);
      }
      console.log('users: ', users);
      // res.json({ users });
      console.log('data:', users);
      res.render('users_index', { data: users });
    }
  );
};

exports.user_show_get_test = (req, res, next) => {
  // User.findById('6255967b6deeb3c285b9940f')
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
      console.log({ data: userProfile });
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
