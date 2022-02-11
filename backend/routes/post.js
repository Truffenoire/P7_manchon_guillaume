const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authCreate = require('../middleware/authCreate');
const multer = require('../middleware/multer-config');

const { createOnePost, getOnePost, getAllPost, updatePost, deletePost } = require('../controllers/post');
// const { createComment, getAllComment, getOneComment, udpadeComment, deleteComment } = require('../controllers/comment');



router.get('/', getAllPost);
router.get('/:id', getOnePost);
router.post('/add', multer, createOnePost);
router.patch('/update/:id', multer, updatePost);
router.delete('/deleteOne/:id', auth, deletePost);

module.exports = router;