const express = require('express');
const router = express.Router();
const connect_controller = require('../controllers/authController');

router.get('/facebook', connect_controller.facebook_login_post);
router.get('/redirect/facebook', connect_controller.facebook_login_redirect);

router.get('/local', connect_controller.local_login_get);
router.post('/local', connect_controller.local_login_post);

router.get('/signup', connect_controller.local_signup_get);
router.post('/signup', connect_controller.local_signup_post);

module.exports = router;