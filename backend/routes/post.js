const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const authCreate = require('../middleware/authCreate')

const { createOnePost, getOnePost, getAllPost, updatePost, deletePost } = require('../controllers/post');


router.get('/post', getAllPost);
router.get('/post/:id', getOnePost);
router.post('/post/add', authCreate, createOnePost);
router.patch('/post/update/:id', auth, updatePost);
router.delete('/post/deleteOne/:id', auth, deletePost);

module.exports = router;