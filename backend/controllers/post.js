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
    // console.log("TOKEN DANS CREATE POST", tokenId);
    console.log(req.file);
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
    console.log(id);
    try {
        // Recherche de l'utilisateur et vérification
        let post = await Post.findOne({ where: { id: id }, include: Comment, raw: true })
        
        if (post === null) {
            return res.status(404).json({ message: 'Ce post n\'existe pas !' })
        }
        return res.status(200).json({ onePost: post/*,  allComments: comments*/ });
        //  next()
    } catch {
        return res.status(500).json({ message: 'Erreur de base de donnée du getOne' })
    }
    
}

const updatePost = async (req, res, next) => {
    const { id } = req.params
    if(req.file) {
        await Post.findOne({ where: { id: id}, raw: true})
            .then(post => {
                const filename = post.urlImage.split('/images/')[1];
                fs.unlink(`images/${filename}`, async () => {
                    const postUpdated = 
                    {   
                        ...req.body,
                        urlImage: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    }
                    console.log(postUpdated);
                    await Post.update(post = postUpdated, { where: { id : id}})
                    return res.status(201).json({message: 'Photo de post modifiée.'})
            })
            }).catch(error => res.status(400).json({ message : "error" }));
    }
    else {
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

const likeUnlike = async (req, res, next) => {
    const { id } = req.params;
    const like = req.body.like;
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.id
    // console.log(like);
    
    try{
        const post = await Post.findOne({where: { id : id }})

        const postLiked = 
                    { ...post,
                        userLiked: [] };

                    switch(like) {
                        case 0 :
                            if(postLiked.userLiked.includes(userId)) {
                                let indexUser = postLiked.userLiked.indexOf(userId)
                                postLiked.userLiked.splice(indexUser, 1)
                            }
                            break;
                        case 1 : postLiked.userLiked.push(userId)
                        break;
                    }
                   
                    await Post.update( postLiked, { where: { id : id}})
                    return res.status(201).json({message: 'Post like/unLike.'})

    }catch{
        return res.status(500).json({error : "erreur de base de donnée dans le like"})
    }
}

module.exports = { createOnePost, getAllPost, getOnePost, updatePost, deletePost, likeUnlike }