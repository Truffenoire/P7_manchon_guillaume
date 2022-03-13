const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db');

// Import Models
const Comment = require('../models/comment')

// MODEL POST
const Post = sequelize.define('post', {
    userId : {
        type : DataTypes.INTEGER,
        allowNull : false,
        // references: {
        //     model: "Users",
        //     key: "id"
        // }
    },
    // title : {
    //     type : DataTypes.STRING,
    //     allowNull : false,
    //     validate:{
    //         is : /[^\<\>\\\/]/
    //     }
    // },
    text : {
        type : DataTypes.TEXT,
        allowNull : false,
        validate:{
            is : /[^\<\>\\\/]/
        }
    },
    userName : {
        type : DataTypes.STRING,
        allowNull : false,
        
        // validate:{
        //     is : /^[\w \-\_]*\.(jpg|jpeg|png|webp)$/
        // }           
    },
    urlImage : {
        type : DataTypes.STRING,
        allowNull : true,
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
Post.hasMany(Comment, {
    foreignKey: {
        name: "postId",
        type: DataTypes.INTEGER,
        allowNull: false
    }
});
Comment.belongsTo(Post);

// Post.sync({alter: true});
// Post.sync();
module.exports = Post