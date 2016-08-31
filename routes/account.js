var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');
var passportConfig = require('../config/passport');

router.get('/', passportConfig.isAuthenticated, userController.getAccount);
router.post('/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
router.post('/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
router.post('/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
router.get('/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);

module.exports = router;