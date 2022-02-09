const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db');
const bcrypt = require('bcrypt');

// MODEL USER
const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER(10),
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    }
});
User.beforeCreate(async (user, option) => {
    let hash = await bcrypt.hash(user.password, 10)
    console.log(hash);
    user.password = hash;
});

// User.sync({alter: true});
module.exports = User