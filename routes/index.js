var express = require('express');
var router = express.Router();
var passport = require('passport');

// new CronJob('*/5 * * * * *', function() {
//   axios.get(currentApiUrl + '/checkdeposits').then((res)=>{
//     console.log(res);
//   })
// }, null, true, 'America/Los_Angeles');

router.get('/', function(req,res,next){
  res.render('index', {user: req.user})
})

router.get('/users/:page', isLoggedIn, function(req,res,next){  
  res.render('users', {users: userResult, total: tmp.total, user: req.user});
})

router.get('/login', function(req, res, next) {
  res.render('login.ejs', { message: req.flash('loginMessage') });
});


router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/signup', function(req, res) {
  res.render('signup.ejs', { message: req.flash('loginMessage') });
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/signup',
  failureFlash: true,
}));

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
}));

module.exports = router;


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}