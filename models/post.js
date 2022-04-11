const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const PostSchema = new Schema({
  content: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  author: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
