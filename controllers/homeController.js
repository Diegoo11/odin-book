const User = require('../models/user');
const Post = require('../models/post');
const Coment = require('../models/coment');
const async = require('async');

exports.homeGET = (req, res, next) => {
  if(req.user) {
    async.parallel({
      user: (callback) => {
        User.findById(req.user._id)
        .populate({path: 'response friends', select: 'username photo'})
        .exec(callback)
      },
      post: (callback) => {
        Post.find().sort({ 'date': -1 })
        .populate({path: 'user coment', select: 'username photo text user date', populate: { path: 'user', strictPopulate: false}})
        .exec(callback)
      }
    }, (err, results) => {
      if(err) {return next(err)}
      res.render('home', {results})
    })
  } else {
    
    res.redirect('/login')
  }
};

exports.homePOST = (req, res, next) => {
  const post = new Post({
    user: req.user._id,
    text: req.body.text,
    like: 0,
    coment: [],
    date: new Date()
  })

  post.save((err, thepost) => {
    if(err) {return next(err)}
    res.redirect('/')
  })
}

exports.friendGET = (req, res, next) => {
  User.findById(req.user._id).select('friends')
  .populate({path: 'friends', select: 'username photo'})
  .exec((err, userFriends) => {
    if(err) {return next(err)}
    res.render('friends', {users: userFriends.friends})
  })
}

exports.usersGET = (req, res, next) => {
  User.find().select('username photo').exec((err, users) => {
    if(err) {return next(err)}
    res.render('users', {users})
  })
}

exports.addFriendPOST = (req, res, next) => {
  console.log(req.body.id)
  async.parallel({
    userREQ: (callback) => {
      User.findById(req.user._id).exec(callback)
    },
    userRES: (callback) => {
      User.findById(req.body.id).exec(callback)
    }
  }, (err, results) => {
    if(err) {return next(err)}
    console.log(results)
    const newrequestsREQ = results.userREQ.requests;
    newrequestsREQ.push(req.body.id)

    const newUserREQ = new User({
      username: results.userREQ.username,
      photo: results.userREQ.photo,
      requests: newrequestsREQ,
      response: results.userREQ.response,
      friends: results.userREQ.friends,
      facebookId: results.userREQ.facebookId,
      _id: results.userREQ._id
    })

    const newresponseRES = results.userRES.response;
    newresponseRES.push(req.user._id);

    const newUserRES = new User({
      username: results.userRES.username,
      photo: results.userRES.photo,
      requests: results.userRES.requests,
      response: newresponseRES,
      friends: results.userRES.friends,
      facebookId: results.userRES.facebookId,
      _id: results.userRES._id
    })

    async.parallel({
      update1: (callback) => {
        User.findByIdAndUpdate(req.user._id, newUserREQ, {}, (callback))
      },
      update2: (callback) => {
        User.findByIdAndUpdate(req.body.id, newUserRES, {}, (callback))
      }
    }, (err, results) => {
      if(err) {return next(err)}
      console.log('se mando solicitud de amistad')
      res.redirect('/')
    })
  })
};

exports.requestFriendGET = (req, res, next) => {
  User.findById(req.user._id).select('requests')
  .populate({path: 'requests', select: 'username photo'}).exec((err, user) => {
    if(err) {return next(err)}
    res.send(user)
  })
};

exports.acceptFriendPOST = (req, res, next) => {
  async.parallel({
    user0: (callback) => {
      User.findById(req.user._id).exec(callback)
    },
    user1: (callback) => {
      User.findById(req.body.id).exec(callback)
    }
  }, (err, results) => {
    if(err) {return next(err)}
    const response = results.user0.response;
    response.splice(response.indexOf(req.body.id), 1);

    const newfriend0 = results.user0.friends;
    newfriend0.push(req.body.id)

    const newUser0 = new User({
      username: results.user0.username,
      photo: results.user0.photo,
      requests: results.user0.requests,
      response: response,
      friends: newfriend0,
      facebookId: results.user0.facebookId,
      _id: results.user0._id
    });

    const requests = results.user1.requests;
    requests.splice(requests.indexOf(req.user._id), 1);

    const newfriend1 = results.user1.friends;
    newfriend1.push(req.user._id);

    const newUser1 = new User({
      username: results.user1.username,
      photo: results.user1.photo,
      requests: requests,
      response: results.user1.response,
      friends: newfriend1,
      facebookId: results.user1.facebookId,
      _id: results.user1._id
    })

    async.parallel({
      update1: (callback) => {
        User.findByIdAndUpdate(req.user._id, newUser0, {}, (callback))
      },
      update2: (callback) => {
        User.findByIdAndUpdate(req.body.id, newUser1, {}, (callback))
      }
    }, (err, results) => {
      if(err) {return next(err)}
      console.log('se acepto la solicitud de amistad')
      res.redirect('/')
    })
  })
};

exports.rejectFriendPOST = (req, res, next) => {
  async.parallel({
    user0: (callback) => {
      User.findById(req.user._id).exec(callback)
    },
    user1: (callback) => {
      User.findById(req.body.id).exec(callback)
    }
  }, (err, results) => {
    if(err) {return next(err)}
    const response = results.user0.response;
    response.splice(response.indexOf(req.body.id), 1);

    const newUser0 = new User({
      username: results.user0.username,
      photo: results.user0.photo,
      requests: [],
      response: response,
      friends: results.user0.friends,
      facebookId: results.user0.facebookId,
      _id: results.user0._id
    });

    const requests = results.user1.requests;
    requests.splice(requests.indexOf(req.user._id), 1);

    const newUser1 = new User({
      username: results.user1.username,
      photo: results.user1.photo,
      requests: [],
      response: requests,
      friends: results.user1.friends,
      facebookId: results.user1.facebookId,
      _id: results.user1._id
    })

    async.parallel({
      update1: (callback) => {
        User.findByIdAndUpdate(req.user._id, newUser0, {}, (callback))
      },
      update2: (callback) => {
        User.findByIdAndUpdate(req.body.id, newUser1, {}, (callback))
      }
    }, (err, results) => {
      if(err) {return next(err)}
      console.log('se rechazo la solicitud de amistad')
    })
  })
};

exports.postComentPOST = (req, res, next) => {
  const coment = new Coment({
    text: req.body.text,
    user: req.user._id,
    post: req.body.postid,
    date: new Date()
  })

  coment.save((err, thecoment) => {
    if(err) {return next(err)}
    Post.findById(req.body.postid).exec((err, post) => {
      if(err) {return next(err)}
      const newcoment = post.coment;
      newcoment.push(thecoment._id)

      const newPost = new Post ({
        user: post.user,
        text: post.text,
        like: post.like,
        coment: newcoment,
        date: post.date,
        _id: post._id
      })

      Post.findByIdAndUpdate(post._id, newPost, {}, (err, thepost) => {
        if(err) {return next(err)}
        res.redirect('/')
      })
    })
  })
  
}