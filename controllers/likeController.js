const User = require('../models/user');
const Post = require('../models/post');
const Coment = require('../models/coment');

exports.like = (req, res, next) => {
  Post.findById(req.body.id).exec((err, post) => {
    if(err) {return next(err)}
    const newPost = new Post({
      user: post.user,
      text: post.text,
      like: post.like + 1,
      coment: post.coment,
      date: post.date,
      _id: post._id
    })
    Post.findByIdAndUpdate(post._id, newPost, {}, (err, thepost) => {
      if(err) {return next(err)}
      next()
    })
  })
}

exports.dislike = (req, res, next) => {
  Post.findById(req.body.id).exec((err, post) => {
    if(err) {return next(err)}
    const newPost = new Post({
      user: post.user,
      text: post.text,
      like: post.like - 1,
      coment: post.coment,
      date: post.date,
      _id: post._id
    })
    Post.findByIdAndUpdate(post._id, newPost, {}, (err, thepost) => {
      if(err) {return next(err)}
      next()
    })
  })
}