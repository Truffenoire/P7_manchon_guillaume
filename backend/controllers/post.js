const { Sequelize, Model, DataTypes } = require('sequelize')

const Post = require('../models/post')
const Comment = require('../models/comment')
const jwt = require('jsonwebtoken')
const fs = require('fs');


const createOnePost = async (req, res, next) => {
    const { body } = req;
    // console.log(body);
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const tokenId = decodedToken.id
    console.log("TOKEN DANS CREATE POST", tokenId);
    console.log(req.file, req.body);
    await Post.create({ ...body,
                        urlImage: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
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
        let post = await Post.findAll({ where: { id: id }, include: Comment, raw: true })
        // Problème de route je n'arrive pas a recuperer les comments ailleurs....
        // let comments = await Comment.findAll({ where: {postId : id }})
        console.log(post[1].text);
        if (post === null) {
            return res.status(404).json({ message: 'Ce post n\'existe pas !' })
        }
        return res.status(200).json({ onePost: post/*,  allComments: comments*/ });
        //  next()
    } catch {
        return res.status(500).json({ message: 'Erreur de base de donnée' })
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
    try {
        const post = await Post.findOne({ where: { id : id }, raw: true})
        const filename = post.urlImage.split('/images/')[1];
        console.log(filename);
        fs.unlink(`images/${filename}`, () => {
            Post.destroy({ where: { id : id }, raw: true})
            .then(post => {
                if (post === 0) return res.status(404).json({ message: 'post innexistant' })
                res.status(200).json({ message: 'post supprimé.' })
            })
            .catch(error => res.status(500).json(error))
        });

    } catch {
        return res.status(500).json({ message: 'Erreur de base de donnée'})
    }
    
}


module.exports = { createOnePost, getAllPost, getOnePost, updatePost, deletePost }