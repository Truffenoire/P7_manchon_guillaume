const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const authComment = require('../middleware/authComment')
const authCreate = require('../middleware/authCreate')

const { createComment, getAllComment, getOneComment, udpadeComment, deleteComment } = require('../controllers/comment');


router.get('/:id/comment', getAllComment);
router.get('/:id/comment/:commentId', getOneComment);
router.post('/:id/comment', authCreate, createComment);
router.patch('/:id/comment/:commentId/update', authComment, udpadeComment);
router.delete('/:id/comment/:commentId/deleteOne', authComment, deleteComment);

module.exports = router;