const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db');

// MODEL POST
const Comment = sequelize.define('comment', {
    userId : {
        type : DataTypes.INTEGER,
        allowNull : false,
    },
    postId : {
        type : DataTypes.INTEGER,
        allowNull : false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    text : {
        type : DataTypes.TEXT,
        allowNull : true,
        validate:{
            is : /[^\<\>\\\/]/
        }
    },
});


// Comment.sync({force: true});
// Comment.sync();
module.exports = Comment