const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const PostSchema = new Schema({
  content: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  Date: { type: Date, required: true, default: new Date() },
});

PostSchema.virtual('dateTime').get(function () {
  // TODO: figure out the format I want and implement this later
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
