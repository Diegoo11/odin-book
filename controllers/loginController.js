exports.loginGET = (req, res, next) => {
  console.log('se login')
  if(req.user) {
    res.redirect('/')
  } else {
    res.render('login')
  }
}