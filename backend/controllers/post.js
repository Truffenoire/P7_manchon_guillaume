const { Sequelize, Model, DataTypes } = require('sequelize')
// const User = require('../models/user')
// const bcrypt = require('bcrypt');
const Post = require('../models/post')
const jwt = require('jsonwebtoken')
// const auth = require('../middleware/auth')

const createOnePost = async (req, res, next) => {
    const { body } = req;
    // console.log(body);
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const tokenId = decodedToken.id
    console.log("TOKEN DANS CREATE POST", tokenId);
    await Post.create({ ...body,
                        userId: tokenId })
        .then(() => { res.status(201).json({ message: "Votre post à été publié !" }) })
        .catch(error => res.status(500).json({ error: error }))
}

const getAllPost = async (req, res, next) => {
    let posts = await Post.findAll()
    console.log(posts.length);
    return res.json({ allPosts: posts })
}

const getOnePost = async (req, res, next) => {
    const { id } = req.params;
    try {
        // Recherche de l'utilisateur et vérification
        let post = await Post.findOne({ where: { id: id }, raw: true })
        if (post === null) {
            return res.status(404).json({ message: 'Ce post n\'existe pas !' })
        }
        return res.json({ onePost: post })
    } catch {
        return res.status(500).json({ message: 'Erreur de base de donnée', error: error })
    }
}

const updatePost = async (req, res, next) => {
    const { id } = req.params
    try{
        // Recherche du post et vérification non nul
        let post = await Post.findOne({ where: {id: id}, raw: true})
        if(post === null){
            return res.status(404).json({ message: 'Ce post n\'existe pas !'})
        }
        // Mise à jour de l'utilisateur
        await Post.update( req.body, { where: {id: id}})
        return res.json({ message: 'post modifié avec succès !'})
    }catch(error){
        return res.status(500).json({ message: 'Erreur de base de donnée', error: error })
    }
}

const deletePost = async (req, res, next) => {
    const { id } = req.params;

    Post.destroy({ where: { id: id }, raw: true })
        .then(post => {
            if (post === 0) return res.status(404).json({ message: 'Vous ne pouvez pas faire ça' })
            res.status(200).json({ message: 'post supprimé.' })
        })
        .catch(error => res.status(500).json(error))
}


module.exports = { createOnePost, getAllPost, getOnePost, updatePost, deletePost }