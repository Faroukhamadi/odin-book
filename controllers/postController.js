const Post = require('../models/post');
const Comment = require('../models/comment');

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
  console.log('--------hello------------');
  Post.findByIdAndUpdate(
    req.params.id,
    { $push: { likes: req.user._id } },
    (err, result) => {
      if (err) {
        console.log('aaaaaaaaaaa');
        console.log('Error: ', err);
        return next(err);
      } else {
        res.redirect('/');
      }
    }
  );
};

// TODO: Implement remove like later

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
  console.log('byeeee');
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

exports.post_list_test = (req, res, next) => {
  Post.find({}, (err, result) => {
    if (err) return next(err);
    res.json({ result });
  });
};

exports.create_comment_test = (req, res, next) => {
  const comment = new Comment({
    content: req.body.content,
    author: '6255964096305191e8a91dac', // my _id
  });

  comment.save((err, comment_result) => {
    if (err) {
      console.log('Error: ', err);
      return next(err);
    }
    // hayet kiddos post
    Post.findByIdAndUpdate(
      '625b7d3ab49079faffde77f4',
      { $push: { comments: comment_result._id } },
      (err, result) => {
        if (err) {
          console.log('Error: ', err);
          return next(err);
        }
        console.log('result: ', result);
        res.json({ comment_result });
      }
    );
  });
};
