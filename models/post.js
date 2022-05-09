const mongoose = require('mongoose');
const { DateTime } = require('luxon');
const Schema = mongoose.Schema;

const Post = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  text: {type: String, required: true},
  like: {type: Number, required: true},
  coment: [{type: Schema.Types.ObjectId, ref: 'Coment'}],
  date: {type: Date, required: true}
});

Post.virtual('fecha').get(function() {
  return DateTime.fromJSDate(this.date).toLocaleString();
});

module.exports = mongoose.model('Post', Post);