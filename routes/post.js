const router = require('express').Router();
const post_controller = require('../controllers/postController');

router.post('/create-post', post_controller.create_post);
// NOTE: Implement this later
router.post('/create-comment/:id', post_controller.create_comment);
router.post('/like-post/:id', post_controller.like_post);
router.get('/like-count', post_controller.like_count);

router.post('/create-post/test', post_controller.create_post_test);
// router.patch('/like-post/test', post_controller.like_post_test);
router.post('/create-comment/test', post_controller.create_comment_test);
router.get('/', post_controller.post_list_test);

module.exports = router;
