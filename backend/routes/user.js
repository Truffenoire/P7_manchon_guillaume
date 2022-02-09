const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')

const { signup, login, deleteOne, getAll, updateOne } = require('../controllers/user');

router.post('/user/signup', signup);
router.post('/user/login', login);
router.get('/user/', getAll);
router.patch('/user/update/:id', updateOne);
router.delete('/user/deleteOne/:id', auth, deleteOne);

module.exports = router;