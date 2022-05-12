const express = require('express');
const router = express.Router();
const userExtractor = require('../userExtractor');
const loginController = require('../controllers/loginController');
const homeController = require('../controllers/homeController');
const likeController = require('../controllers/likeController');

router.get('/', homeController.homeGET);

router.post('/', userExtractor, homeController.homePOST);

router.get('/friends', userExtractor, homeController.friendGET);

router.get('/users', userExtractor, homeController.usersGET);

router.post('/addFriend', userExtractor, homeController.acceptFriendPOST); //input hiden

router.post('/requestsFriend', userExtractor, homeController.addFriendPOST);

router.post('/acceptFriend', userExtractor, homeController.acceptFriendPOST); //input hiden

router.post('/rejectFriend', userExtractor, homeController.rejectFriendPOST); //input hiden

router.post('/addComent', userExtractor, homeController.postComentPOST); //input hiden

//////////////////////////////LIKE////////////////////////////////

router.post('/like:id', userExtractor, likeController.like);

router.post('/dislike:id', userExtractor, likeController.dislike);

//////////////////////////////LOGIN////////////////////////////////

router.get('/login', loginController.loginGET)

router.get("/logout", userExtractor, (req, res) => {
  req.logout();
  res.redirect("/");
});


module.exports = router;