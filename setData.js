const mongoose = require('mongoose');
const User = require('./models/user');
const Post = require('./models/post');
const Coment = require('./models/coment');
const mongo = require('./mongo');
const { faker } = require('@faker-js/faker');
const dotenv = require('dotenv')
const async = require('async')

dotenv.config('./.env');

mongo();

function makeUser() {
  const username = faker.name.jobType();
  const firstname = faker.name.firstName();
  const lastname = faker.name.lastName();
  const photo = faker.image.avatar();
  const requests = [];
  const response = [];
  const friends = [];
  const user = new User({
    username, firstname, lastname, photo, requests, response, friends
  })

  user.save((err, theuser) => {
    if(err) {console.log(err)}
    console.log(theuser)
  })
}

function makePost(random) {
  User.findOne().skip(random).exec((err, user) => {
    if(err) {return console.log(err)};
    const text = faker.random.words(20)
    const like = faker.random.numeric(2)
    const coment = []
    const post = new Post({
      user: user._id,
      text,
      like,
      coment,
      date: new Date()
    })

    post.save((err, thepost) => {
      if(err) {return console.log(err)}
      console.log(thepost)
    })
  })
}

function makeComent(a, b) {
  async.parallel({
    user: (callback) => {
      User.findOne().skip(a).exec(callback)
    },
    post: (callback) => {
      Post.findOne().skip(b).exec(callback)
    }
  }, (err, results) => {
    if(err) {return console.log(err)}
    const text = faker.random.words(15);
    const user = results.user._id;
    const post = results.post._id;
    const date = new Date()

    const coment = new Coment({
      text, user, post, date
    })

    coment.save((err, thecoment) => {
      if(err) {return console.log(err)}
      console.log(thecoment)
    })
  })
}


for(let i = 0; i <= 150; i++) {

}