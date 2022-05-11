const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const findOrCreate = require('mongoose-findorcreate');

const User = new Schema({
  username: {type: String, required: false},
  firstname: {type: String, required: false},
  lastname: {type: String, required: false},
  photo: {type: String, default: 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.webp'},
  requests: [{type: Schema.Types.ObjectId, ref: 'User'}],
  response: [{type: Schema.Types.ObjectId, ref: 'User'}],
  friends: [{type: Schema.Types.ObjectId, ref: 'User'}],
  facebookId: {type: String}
})

User.plugin(findOrCreate);

module.exports = mongoose.model('User', User)