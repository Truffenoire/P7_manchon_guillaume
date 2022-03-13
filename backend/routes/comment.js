const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const mwAdmin = require('../middleware/mwAdmin');

const { createComment, getAllComment, getOneComment, udpadeComment, deleteComment } = require('../controllers/comment');


router.get('/:id/comment', getAllComment);
router.get('/:id/comment/:commentId', getOneComment);
router.post('/:id/comment/add', auth, createComment);
router.patch('/:id/comment/:commentId/update', auth,/*mwAdmin, */ udpadeComment);
router.delete('/:id/comment/:commentId/deleteOne', auth, /*mwAdmin, */ deleteComment);

module.exports = router;