const Post = require('../models/post');

exports.create_post = (req, res, next) => {
  const post = new Post({
    content: req.body.content,
    likes: [],
    comments: [],
    author: req.user._id,
  });
  post.save((err, post_result) => {
    if (err) {
      console.log('Error: ', err);
      return next(err);
    }
    res.json({ post_result });
  });
};

exports.like_post = (req, res, next) => {
  Post.findByIdAndUpdate(
    req.params.id,
    { $push: { likes: req.user._id } },
    (err, result) => {
      if (err) {
        console.log('Error: ', err);
        return next(err);
      } else {
        res.json({ result });
      }
    }
  );
};

exports.like_count = (req, res, next) => {
  Post.countDocuments({}, (err, count) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    res.json({ count });
  });
};

// ------------- POSTMAN TESTING SECTION -------------

exports.create_post_test = (req, res, next) => {
  const post = new Post({
    content: req.body.content,
    likes: [],
    comments: [],
    author: req.body.author,
  });
  post.save((err, post_result) => {
    if (err) {
      console.log('Error: ', err);
      return next(err);
    }
    res.json({ post_result });
  });
};

exports.like_post_test = (req, res, next) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { likes: req.body.userId } },
    (err, result) => {
      if (err) {
        console.log('Error: ', err);
        return next(err);
      } else {
        res.json({ result });
      }
    }
  );
};
