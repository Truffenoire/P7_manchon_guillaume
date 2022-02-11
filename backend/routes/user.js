const express = require('express');
const router = express.Router();
const authCour = require('../middleware/authCour')
const multer = require('../middleware/multer-config')

const { signup, login, deleteOne, getAll, getProfil, updateOne } = require('../controllers/user');

router.post('/signup', multer, signup);
router.post('/login', login);
router.get('/', getAll);
router.get('/:id', getProfil);
router.patch('/update/:id', multer, updateOne);
router.delete('/deleteOne/:id', authCour, deleteOne);

module.exports = router;