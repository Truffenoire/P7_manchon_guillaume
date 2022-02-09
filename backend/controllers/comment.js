const { Sequelize, Model, DataTypes } = require('sequelize')
const jwt = require('jsonwebtoken')
const Comment = require('../models/comment')
const Post = require('../models/post')


const createComment = async (req, res, next) => {
    const { body } = req;
    const { id } = req.params;
    // console.log({ body, id });
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const tokenId = decodedToken.id
    console.log("TOKEN DANS CREATE POST", tokenId);
    await Comment.create({ ...body,
                        userId: tokenId,
                        postId: id })
        .then(() => { res.status(201).json({ message: "Votre commentaire à été publié !" }) })
        .catch(error => res.status(500).json({ error: error }))
}
const getAllComment = async (req, res, next) => {
    const { id } = req.params;
    let post = await Post.findByPk(id)
    let comments = await Comment.findAll({ where: { postId : id }})
    console.log("LOG DANS COMMENT", comments.length);

    return res.status(200).json({ allComment: comments })
}
const getOneComment = async (req, res, next) => {
    const { commentId } = req.params;
    // console.log(req.params);
    let comment = await Comment.findOne({where: { id : commentId }})
    return res.status(200).json({ comment })
}
const udpadeComment = async (req, res, next) => {
    const { commentId } = req.params;
    try{
        // Recherche du commentaire et vérification non nul
        let comment = await Comment.findOne({ where: {id: commentId}, raw: true})
        if(comment === null){
            return res.status(404).json({ message: 'Ce commentaire n\'existe pas !'})
        }
        // Mise à jour de l'utilisateur
        await Comment.update( req.body, { where: {id: commentId}})
        return res.json({ message: 'commentaire modifié avec succès !'})
    }catch(error){
        return res.status(500).json({ message: 'Erreur de base de donnée', error: error })
    }
}
const deleteComment = async (req, res, next) => {
    const { commentId } = req.params;

    Comment.destroy({ where: { id: commentId }, raw: true })
        .then(comment => {
            if (comment === 0) return res.status(404).json({ message: 'Vous ne pouvez pas faire ça' })
            res.status(200).json({ message: 'commentaire supprimé.' })
        })
        .catch(error => res.status(500).json(error))
}


module.exports = { createComment, getAllComment, getOneComment, udpadeComment, deleteComment }