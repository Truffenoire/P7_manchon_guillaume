const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const authCreate = require('../middleware/authCreate')

const { createComment, getAllComment, getOneComment, udpadeComment, deleteComment } = require('../controllers/comment');


router.get('/comment', getAllComment);
router.get('/comment/:id', getOneComment);
router.post('/comment/add', authCreate, createComment);
router.patch('/comment/update/:id', auth, udpadeComment);
router.delete('/comment/deleteOne/:id', auth, deleteComment);

module.exports = router;