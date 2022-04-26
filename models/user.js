const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const UserSchema = new Schema({
  facebook_id: { type: String },
  email: { type: String },
  password: { type: String },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  hometown: { type: String },
  gender: { type: String },
  picture: { type: String },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  friendRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  birthday: { type: String },
});

UserSchema.virtual('url').get(function () {
  return '/users/show-page/' + this._id;
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
