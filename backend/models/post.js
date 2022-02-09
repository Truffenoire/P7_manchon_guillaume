const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db');

// MODEL POST
const Post = sequelize.define('post', {
    userId : {
        type : DataTypes.INTEGER,
        allowNull : false,
    },
    title : {
        type : DataTypes.STRING,
        allowNull : false,
        validate:{
            is : /[^\<\>\\\/]/
        }
    },
    text : {
        type : DataTypes.TEXT,
        allowNull : true,
        validate:{
            is : /[^\<\>\\\/]/
        }
    },
    fileName : {
        type : DataTypes.STRING,
        allowNull : false,
        // validate:{
        //     is : /^[\w \-\_]*\.(jpg|jpeg|png|webp)$/
        // }           
    },
    urlImage : {
        type : DataTypes.STRING,
        allowNull : false,
        // validate:{
        //     is : /^http:\/\/localhost:3000\/[\w \-\_]*\.(jpg|jpeg|png|webp)$/
        // } 
    },
    userLiked : {
        type : DataTypes.JSON,
        allowNull : false,
        defaultValue: []
    },
});


// Post.sync({alter: true});
// Post.sync();
module.exports = Post