const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

exports.absolute_path = (req, res, next) => {
  if (req.user) res.redirect('/');
  else res.redirect('/auth');
};

exports.create_post = (req, res, next) => {
  if (req.user) {
    const post = new Post({
      content: req.body.postcontent,
      likes: [],
      comments: [],
      author: req.user._id,
    });
    post.save((err, post_result) => {
      if (err) {
        console.log('Error: ', err);
        return next(err);
      }
      console.log('CREATE-POST RESULT: ', post_result);
      res.redirect('/');
    });
  } else res.redirect('/auth');
};

exports.create_comment = (req, res, next) => {
  console.log('hello there');
  if (req.user) {
    const comment = new Comment({
      content: req.body.content,
      author: req.user._id,
    });

    comment.save((err, comment_result) => {
      if (err) {
        console.log('Error: ', err);
        return next(err);
      }
      Post.findByIdAndUpdate(
        req.params.id,
        { $push: { comments: comment_result._id } },
        (err, result) => {
          if (err) {
            console.log('Error: ', err);
            return next(err);
          }
          console.log('result: ', result);
          res.redirect('/');
        }
      );
    });
  } else res.redirect('/auth');
};

exports.like_post = async (req, res, next) => {
  // TODO: check that person who liked doesn't already exist
  // if he exists remove him else add him
  if (req.user) {
    let user = await Post.find({
      _id: req.params.id,
      likes: req.user._id,
    });
    if (user.length) {
      Post.findByIdAndUpdate(
        req.params.id,
        { $pull: { likes: req.user._id } },
        (err, result) => {
          if (err) {
            console.log('Error: ', err);
            return next(err);
          }
          // TODO: maybe add the result
          res.redirect('/');
        }
      );
    } else {
      Post.findByIdAndUpdate(
        req.params.id,
        { $push: { likes: req.user._id } },
        (err, result) => {
          if (err) {
            console.log('Error: ', err);
            return next(err);
          }
          // TODO: maybe add the result
          res.redirect('/');
        }
      );
    }
  } else res.redirect('/auth');
};

exports.like_count = (req, res, next) => {
  if (req.user) {
    Post.countDocuments({}, (err, count) => {
      if (err) {
        console.log(err);
        return next(err);
      }
      res.json({ count });
    });
  } else res.redirect('/auth');
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

exports.like_post_test = async (req, res, next) => {
  let user = await Post.find({ _id: req.body.postId, likes: req.body.userId });
  if (user.length) {
    Post.findByIdAndUpdate(
      req.body.postId,
      { $pull: { likes: req.body.userId } },
      (err, result) => {
        if (err) {
          console.log('Error: ', err);
          return next(err);
        } else {
          res.json({ result });
        }
      }
    );
  } else {
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
  }
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
