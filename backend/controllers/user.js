const { Sequelize, Model, DataTypes } = require('sequelize')
const User = require('../models/user')
const Post = require('../models/post')
const userValid = require('../validation/userValide')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const fs = require('fs')


// CREER UN UTILISATEUR
const signup = async (req, res, next) => {
    const { body } = req;
    // verification de la validité de la saisie du body
    const { error } = userValid(body)
    if (error) return res.status(401).json(error.details[0].message)
    await User.create({
        ...body,
        urlImage: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    })
        .then(() => { res.status(201).json({ message: "Votre compte à été créé, bienvenue !" }) })
        .catch(error => res.status(500).json(error))

};
//TROUVE UN UTILISATEUR
const login = async (req, res, next) => {

    const { email, password, username } = req.body;
    if (!email || !password || !username) {
        return res.status(400).json({ message: 'Veuillez saisir un compte existant.' })
    }
    try {
        // vérification présence d'un utilisateur
        let user = await User.findOne({ where: { email: email }, raw: true })
        console.log("USER DANS LE LOGIN", user);
        if (user === null) {
            return res.status(401).json({ message: 'Le compte n\'existe pas' })
        }
        // vérification du mot de passe
        let test = await bcrypt.compare(password, user.password)
        if (!test) {
            return res.status(401).json({ message: 'Mauvais mot de passe !' })
        }
        else if (test) {
            // GENERATION DU TOKEN
            const token = jwt.sign(
                { id: user.id, email: user.email }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' })
            console.log(token);
            return res.json({ acces_token: token })
        }
    } catch (error) {
        if (error.name === "SequelizeDatabaseError") {
            return res.status(500).json({ message: 'erreur de la base de donnée', error: error })
        } else {
            return res.status(500).json({ message: 'échec de connection !', error: error })
        }
    }
};
// TROUVE TOUS LES UTILISATEURS
const getAll = async (req, res, next) => {
    let users = await User.findAll()
    return res.json({ allUsers: users })
}
// TROUVE UN SEUL AVEC SES POSTS
const getProfil = async (req, res, next) => {
    const { id } = req.params;
    let users = await User.findOne({ where: { id: id }, include: Post })
    return res.json({ profilUsers: users })
}
// MODIFIER UN UTILISATEUR
const updateOne = async (req, res, next) => {
    const { id } = req.params
    try {
        // Recherche de l'utilisateur et vérification
        let user = await User.findOne({ where: { id: id }, raw: true })
        if (user === null) {
            return res.status(404).json({ message: 'Cet utilisateur n\'existe pas !' })
        }
        // Mise à jour de l'utilisateur
        // Création d'un objet pour hasher le mdp
        let hash = await bcrypt.hash(user.password, 10)
        let userUpdated = {
            ...req.body,
            password: hash
        }
        await User.update(user = userUpdated, { where: { id: id } })
        return res.json({ message: 'Profil modifié avec succès !' })
    } catch (error) {
        return res.status(500).json({ message: 'Erreur de base de donnée', error: error })
    }
}
// SUPPRIME
const deleteOne = async (req, res, next) => {
    const { id } = req.params;
    const userImage = await User.findOne({ where: { id : id }, raw: true})
    const filename = userImage.urlImage.split('/images/')[1];
    try {
        console.log(filename);
        fs.unlink(`images/${filename}`, () => {
            User.destroy({ where: { id : id }, raw: true})
            .then(user => {
                if (user === 0) return res.status(404).json({ message: 'utilisateur innexistant' })
                res.status(200).json({ message: 'compte supprimé.' })
            })
            .catch(error => res.status(500).json(error))
        });

    } catch {
        return res.status(500).json({ message: 'Erreur de base de donnée'})
    }
};

module.exports = { signup, deleteOne, login, getAll, getProfil, updateOne }