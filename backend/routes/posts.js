const express = require('express');

const fileExtractor = require('../middleware/file');

const postController = require('../controllers/posts');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();



router.post('', checkAuth, fileExtractor, postController.savePost);

router.get('/:id', postController.getPost);

router.get('', postController.getPosts);

router.put('/:id', checkAuth, fileExtractor, postController.updatePost);

router.delete('/:id', checkAuth, postController.deletePost);

module.exports = router;