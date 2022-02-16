const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db');
const bcrypt = require('bcrypt');

// Import de models
const Post = require('../models/post')
const Comment = require('../models/comment')

// MODEL USER
const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER(10),
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    urlImage : {
        type : DataTypes.STRING,
        allowNull : true,
        // validate:{
        //     is : /^http:\/\/localhost:3000\/[\w \-\_]*\.(jpg|jpeg|png|webp)$/
        // } 
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        // validate: {
        //     isEmail: true
        // }
    }
});
User.hasMany(Post, {
    foreignKey: {
        name: "userId",
        type: DataTypes.INTEGER,
        allowNull: false
    }
});
Post.belongsTo(User);
User.beforeCreate(async (user, option) => {
    let hash = await bcrypt.hash(user.password, 10)
    console.log(hash);
    user.password = hash;
});

// User.sync({alter: true});
// User.sync();
module.exports = User