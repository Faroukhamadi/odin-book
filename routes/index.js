var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // TODO: If this doesn't work change it to locals thing
  if (req.user) res.render('home');
  else res.redirect('/auth');
});

module.exports = router;
