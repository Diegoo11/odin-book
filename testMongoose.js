const User = require('./models/user');
const Post = require('./models/post');
const Coment = require('./models/coment');
const mongo = require('./mongo');
const dotenv = require('dotenv')
const async = require('async')

dotenv.config('./.env');

mongo();

Post.findOne().skip(32).populate({path: 'user coment', select: 'username firstname lastname photo -_id text user date'}).exec((err, post) => {
  if(err) {return console.log(err)}
  console.log(post)
})



  Coment.find({post: post._id}).exec((err, coment) => {
    if(err) {return console.log(err)}
    const newcoment = []
    coment.forEach(x => newcoment.push(x._id))
    const newPost = new Post({
      user: post.user,
      text: post.text,
      like: post.like,
      date: post.date,
      coment: newcoment,
      _id: post._id
    })

    Post.findByIdAndUpdate(post._id, newPost, {}, (err, thepost) => {
      if (err) { return console.log(err); }
      console.log(thepost)
    })
  })

