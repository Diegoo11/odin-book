const User = require('../models/user');
const Post = require('../models/post');
const Coment = require('../models/coment');
const async = require('async');

exports.homeGET = (req, res, next) => {
  console.log('se visito /')
  console.log(req.user)
  if(req.user) {
    async.parallel({
      user: (callback) => {
        User.findById(req.user._id)
        .populate({path: 'requests friends', select: 'username photo'})
        .exec(callback)
      },
      post: (callback) => {
        Post.find().skip(15).sort('-date')
        .populate({path: 'user coment', select: 'username firstname lastname photo -_id text user date'})
        .exec(callback)
      }
    }, (err, results) => {
      if(err) {return next(err)}
      results.post.forEach(element => {
        console.log(element.fecha)
      });
      console.log(results.post[0].fecha)
      res.send(results)
    })
  } else {
    res.redirect('/login')
  }
}