const mongoose = require('mongoose');
const { DateTime } = require('luxon');
const Schema = mongoose.Schema;

const Coment = new Schema({
  text: {type: String, required: true},
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  post: {type: Schema.Types.ObjectId, ref: 'Post'},
  date: {type: Date, require: true}
});

Coment.virtual('fecha').get(function() {
  return DateTime.fromJSDate(this.date).toLocaleString();
})

module.exports = mongoose.model("Coment", Coment);