var express = require('express');
var router = express.Router();

var account = require('./account');
var auth = require('./auth');
var polls = require('./polls');

router.get('/', function(req, res, next) {
  res.render('home', {
    title: 'Home',
    isLogin: req.isAuthenticated()
  });
});

var userController = require('../controllers/user');
router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);
router.get('/logout', userController.logout);
router.get('/forgot', userController.getForgot);
router.post('/forgot', userController.postForgot);
router.get('/reset/:token', userController.getReset);
router.post('/reset/:token', userController.postReset);
router.get('/signup', userController.getSignup);
router.post('/signup', userController.postSignup);

/**
 * sub routes
 */

router.use('/account', account);
router.use('/auth', auth);

router.use('/polls',polls)

module.exports = router;