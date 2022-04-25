const router = require('express').Router();
const user_controller = require('../controllers/userController');

router.patch('/friend-request', user_controller.send_friend_request);
router.patch('/friend-request/accept', user_controller.accept_friend_request);
router.get('/index-page', user_controller.user_index_get);
// router.get('/show-page', user_controller.user_show_get);

// Tests
router.patch(
  '/friend-request/accept/test',
  user_controller.accept_friend_request_test
);
router.patch('/friend-request/test', user_controller.send_friend_request_test);
router.get('/index-page/test', user_controller.user_index_get_test);
router.get('/show-page/test', user_controller.user_show_get_test);

module.exports = router;
