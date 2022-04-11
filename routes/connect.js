const express = require('express');
const router = express.Router();
const connect_controller = require('../controllers/connectController');

router.get('/facebook', connect_controller.facebook_login_post);
router.get('/redirect/facebook', connect_controller.facebook_login_redirect);

module.exports = router;
