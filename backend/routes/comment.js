const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const authCreate = require('../middleware/authCreate')

const { createComment, getAllComment, getOneComment, udpadeComment, deleteComment } = require('../controllers/comment');


router.get('/:id/comment', getAllComment);
router.get('/:id/comment/:commentId', getOneComment);
router.post('/:id/comment', createComment);
router.patch('/:id/comment/:commentId/update', udpadeComment);
router.delete('/:id/comment/:commentId/deleteOne', deleteComment);

module.exports = router;