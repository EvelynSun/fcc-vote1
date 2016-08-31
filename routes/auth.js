var express = require('express');
var router = express.Router();
var passport = require('passport');

/**
 * OAuth authentication routes. (Sign in)
 */
router.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
router.get('/github', passport.authenticate('github'));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
router.get('/google', passport.authenticate('google', { scope: 'profile email' }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});

module.exports = router;