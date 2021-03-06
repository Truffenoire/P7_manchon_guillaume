const User = require('../models/user')
const Post = require('../models/post')
const userValid = require('../validation/userValide')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const fs = require('fs')
require('dotenv').config();



// CREER UN UTILISATEUR
const signup = async (req, res, next) => {
    const { body } = req;
    // console.log('BODY BACK', req.body);
    // console.log('FILE BACK', req.file);
    // verification de la validité de la saisie du body
    const { error } = userValid(body)
    if (error) { res.status(401).json(error.details[0].message) }
    else {
        await User.create({
            ...body,
            urlImage: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        })
            .then(() => { res.status(201).json({ message: "Votre compte à été créé, bienvenue !" }) })
            .catch(error => res.status(500).json(error))
    }


};
//TROUVE UN UTILISATEUR
const login = async (req, res, next) => {
    console.log("REQ.BODY", req.body);
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
        return res.status(400).json({ message: 'Veuillez saisir un compte existant.' })
    }
    try {
        // vérification présence d'un utilisateur
        let user = await User.findOne({ where: { username: username }, raw: true })
        console.log("USER DANS LE LOGIN", user);
        if (user === null) {
            return res.status(401).json({ message: 'Le compte n\'existe pas' })
        }
        // vérification du mot de passe
        console.log('PASSWORD DANS LE LOGIN', user.password);
        let test = await bcrypt.compare(password, user.password)
        console.log('MDP DANS TEST', test);
        if (!test) { 
            return res.status(401).json({ message: 'Mauvais mot de passe !' })
        }
        else if (test) {
            // GENERATION DU TOKEN
            const token = jwt.sign(
                { id: user.id, email: user.email }, process.env.SECRET_TOKEN, { expiresIn: '24h' })
            // console.log(token);
            return res.json({ token, user })
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
    return res.json(users)
}
// TROUVE UN SEUL AVEC SES POSTS
const getProfil = async (req, res, next) => {
    const { id } = req.params;
    let users = await User.findOne({ where: { id: id }, include: Post })
    return res.json(users)
}
// MODIFIER UN UTILISATEUR
const updateOne = async (req, res, next) => {
    const { id } = req.params
    // console.log('BODY DANS USER', req.body);
    // console.log('FILE DANS USER', req.file);

    if (req.file) {
        await User.findOne({ where: { id: id }, raw: true })
            .then(user => {
                const filename = user.urlImage.split('/images/')[1];
                fs.unlink(`images/${filename}`, async () => {
                    const userUpdated =
                    {
                        ...req.body,
                        urlImage: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    }
                    // console.log(userUpdated);
                    await User.update(user = userUpdated, { where: { id: id } })
                    return res.status(201).json({ message: 'Photo de profil modifiée.' })
                })
            }).catch(error => res.status(400).json({ message: "error" }));
    }
    else {
        try {
            // Recherche de l'utilisateur et vérification
            let user = await User.findOne({ where: { id: id }, raw: true })
            if (user === null) {
                return res.status(404).json({ message: 'Cet utilisateur n\'existe pas !' })
            }
            // Mise à jour de l'utilisateur
            // Création d'un objet pour hasher le mdp
            // let hash = await bcrypt.hash(user.password, 10)
            // console.log(hash);
            // console.log(user.password);
            let userUpdated = {
                ...user,
                ...req.body,
                // password: hash
            }
            // console.log('USERUPDATED', userUpdated);
            await User.update(user = userUpdated,
                { where: { id: id } })
            return res.json({ message: 'Profil modifié avec succès !' })
        } catch (error) {
            return res.status(500).json({ message: 'Erreur de base de donnée' })
        }
    }
}
// SUPPRIME
const deleteOne = async (req, res, next) => {
    const { id } = req.params;
    const userImage = await User.findOne({ where: { id: id }, raw: true })
    const filename = userImage.urlImage.split('/images/')[1];
    try {
        // console.log(filename);
        fs.unlink(`images/${filename}`, () => {
            User.destroy({ where: { id: id }, raw: true })
                .then(user => {
                    if (user === 0) return res.status(404).json({ message: 'utilisateur innexistant' })
                    res.status(200).json({ message: 'compte supprimé.' })
                })
                .catch(error => res.status(500).json(error))
        });

    } catch {
        return res.status(500).json({ message: 'Erreur de base de donnée' })
    }
};

module.exports = { signup, deleteOne, login, getAll, getProfil, updateOne }