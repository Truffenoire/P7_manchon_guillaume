const { Sequelize, DataTypes, Model } = require('sequelize')
require('dotenv').config();

// CONNECTION avec SEQUELIZE en asyncrhone
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_LOG, process.env.DB_LOG_MDP, {
    host: 'localhost',
    dialect: 'mysql'
});

// Fonction de test connection auto invoqué
(async () => {
    try {
        await sequelize.authenticate();
        // await User.create({
        //     username: 'toi',
        //     email: 'moto@test.com',
        //     password: 'joto18'
        // }) 
        console.log('Connected to userTest DB');
    } catch {
        console.error('Fail');
    }
})();

// -----------------------------------------------------

module.exports = sequelize;