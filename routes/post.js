const router = require('express').Router();
const post_controller = require('../controllers/postController');

router.post('/create-post', post_controller.create_post);
router.patch('/like-post', post_controller.like_post);
router.get('/like-count', post_controller.like_count);

router.post('/create-post/test', post_controller.create_post_test);
router.patch('/like-post/test', post_controller.like_post_test);

module.exports = router;
