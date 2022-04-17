const express = require('express');
const router = express.Router();
const index_controller = require('../controllers/indexController');

/* GET home page. */
router.get('/', index_controller.home_page_get);

module.exports = router;
