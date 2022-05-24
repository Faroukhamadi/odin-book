const router = require('express').Router();
const user_controller = require('../controllers/userController');

router.get('/', user_controller.absolute_path);
router.post('/friend-request/:id', user_controller.send_friend_request);
router.post(
  '/friend-request/accept/:id',
  user_controller.accept_friend_request
);
router.get('/index-page', user_controller.user_index_get);
router.get('/show-page/:id', user_controller.user_show_get);
router.get('/friend-requests', user_controller.friend_requests_get);

// Tests
router.get('/index-page/test', user_controller.user_index_get_test);
router.get('/show-page/test', user_controller.user_show_get_test);
router.get('/friends-requests/test', user_controller.friend_requests_get_test);

module.exports = router;
