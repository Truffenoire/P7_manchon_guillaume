const express = require('express');
const router = express.Router();
const auth =require('../middleware/auth')
const mwAdmin =require('../middleware/mwAdmin')
const multer = require('../middleware/multer-config');

const { createOnePost, getOnePost, getAllPost, updatePost, deletePost, likeUnlike } = require('../controllers/post');



router.get('/', getAllPost);
router.get('/:id', getOnePost);
router.post('/add', auth, multer, createOnePost); /* faire fonctionner le auth qui bloque la demande */
router.patch('/update/:id', auth, multer, updatePost);
router.delete('/deleteOne/:id', auth,/* mwAdmin,*/ deletePost);

router.post('/:id/like', auth, likeUnlike);

module.exports = router;