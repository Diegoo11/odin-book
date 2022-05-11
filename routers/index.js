const express = require('express');
const router = express.Router();
const userExtractor = require('../userExtractor');
const loginController = require('../controllers/loginController');
const homeController = require('../controllers/homeController');

router.get('/', homeController.homeGET);

//////////////////////////////LOGIN////////////////////////////////

router.get('/login', loginController.loginGET)

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});


module.exports = router;