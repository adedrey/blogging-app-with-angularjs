const express = require('express');
const router = express.Router();
const PostController = require('../controller/posts');
const isAuth = require('../middleware/isAuth');
const file = require('../middleware/file');


router.get('/api/posts', PostController.getPost);
router.post('/api/posts', isAuth,file, PostController.postPost);
router.put('/api/posts/:id', isAuth, file, PostController.updatePost);
router.get('/api/posts/:id', PostController.getPostById)
router.delete('/api/posts/:id', isAuth, PostController.deletePost);

module.exports = router; 