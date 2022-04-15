var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // if (req.user) res.render('home');
  // else res.redirect('/auth');
  res.render('home');
});

module.exports = router;
