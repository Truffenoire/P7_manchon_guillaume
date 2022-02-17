const express = require('express');
const router = express.Router();
const authCour =require('../middleware/authCour')
const mwAdmin =require('../middleware/mwAdmin')
const multer = require('../middleware/multer-config');

const { createOnePost, getOnePost, getAllPost, updatePost, deletePost, likeUnlike } = require('../controllers/post');



router.get('/', getAllPost);
router.get('/:id', getOnePost);
router.post('/add', authCour, multer, createOnePost);
router.patch('/update/:id', authCour, multer, updatePost);
router.delete('/deleteOne/:id', authCour, mwAdmin, deletePost);

router.post('/:id/like', likeUnlike);

module.exports = router;