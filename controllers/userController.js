const User = require('../models/user');
const Post = require('../models/post');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { body, validationResult } = require('express-validator');

exports.send_friend_request = (req, res, next) => {
  User.findByIdAndUpdate(
    req.params.id,
    { $push: { friendRequests: req.user._id } },
    (err, result) => {
      if (err) console.log('error: ', err);
      else res.json({ result });
    }
  );
};

exports.accept_friend_request = (req, res, next) => {
  User.updateOne(
    { _id: req.user._id },
    {
      $pullAll: {
        friendRequests: req.params._id,
      },
    },
    (err, user) => {
      if (err) console.log('err: ', err);
      else
        User.findByIdAndUpdate(
          req.user._id,
          { $push: { friends: req.params._id } },
          (err, user) => {
            if (err) console.log(err);
            else res.json({ user });
          }
        );
    }
  );
};

exports.user_index_get = (req, res, next) => {
  // res.render('users_index');
  // User.find(
  //   {
  //     $and: [
  //       { _id: { $ne: req.user._id } },
  //       { _id: { $nin: req.user.friends } },
  //       { _id: { $nin: req.user.friendRequests } },
  //       { _id: {} },
  //     ],
  //   },
  //   (err, users) => {
  //     if (err) {
  //       console.log('Err: ', err);
  //       return next(err);
  //     }
  //     console.log('users: ', users);
  //     res.json({ users });
  //   }
  // );
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
      if (err) console.log('err: ', err);
      else
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
        console.log('Err: ', err);
        return next(err);
      }
      console.log('users: ', users);
      // res.json({ users });
      console.log('data:', users);
      res.render('users_index', { data: users });
    }
  );
};
