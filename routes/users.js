const router = require('express').Router();
const user_controller = require('../controllers/userController');

router.patch('/friend-request', user_controller.send_friend_request);
router.patch('/friend-request/accept', user_controller.accept_friend_request);

// testing routes
router.patch(
  '/friend-request/accept/test',
  user_controller.accept_friend_request_test
);
router.patch('/friend-request/test', user_controller.send_friend_request_test);

module.exports = router;
