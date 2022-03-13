const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db');

// MODEL POST
const Comment = sequelize.define('comment', {
    userId : {
        type : DataTypes.INTEGER,
        allowNull : false,
        // references: {
        //     model: "Users",
        //     key: "id"
        // }
    },
    postId : {
        type : DataTypes.INTEGER,
        allowNull : false,
        // references: {
        //     model: "Posts",
        //     key: "id"
        // }
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        // references: {
        //     model: "Users",
        //     key: "username"
        // }
    },
    userImg: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    text : {
        type : DataTypes.TEXT,
        allowNull : false,
        validate:{
            is : /[^\<\>\\\/]/
        }
    },
});


// Comment.sync({alter: true});
// Comment.sync();
module.exports = Comment