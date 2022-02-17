const express = require('express');
const router = express.Router();

const authCour = require('../middleware/authCour');
const mwAdmin = require('../middleware/mwAdmin');

const { createComment, getAllComment, getOneComment, udpadeComment, deleteComment } = require('../controllers/comment');


router.get('/:id/comment', getAllComment);
router.get('/:id/comment/:commentId', getOneComment);
router.post('/:id/comment', authCour, createComment);
router.patch('/:id/comment/:commentId/update', authCour, udpadeComment);
router.delete('/:id/comment/:commentId/deleteOne', authCour, mwAdmin, deleteComment);

module.exports = router;