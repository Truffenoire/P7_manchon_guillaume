const express = require('express');
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('./db/db');
const User = require('./models/user')
const Post = require('./models/post')
const Comment = require('./models/comment')
const path = require('path');


// Import des routes
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');


const app = express();

app.use(express.json());
// CONFIG DES HEADER
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    // pour helmet et les fichiers images /fs.
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use('/post/images', express.static(path.join(__dirname, 'images')));

app.use('/user', userRoutes);
app.use('/post', postRoutes);
app.use('/post', commentRoutes);




module.exports = app;