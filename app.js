const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongo = require('./mongo');
const dotenv = require('dotenv');
const verify = require('./passport')
const indexRouter = require('./routers/index')
const path = require('path')

dotenv.config('./env');

mongo()
verify()

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

const app = express()

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter)

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/fake',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/'); 
  });


app.listen(process.env.PORT, () => console.log("app listening on port "+process.env.PORT+ "!"));