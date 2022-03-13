const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const jwt = require('jsonwebtoken');


module.exports = async (req, res, next) => {
    // const { commentId } = req.params;
    const { id, commentId } = req.params;
    console.log(req.params);
    
    if(commentId) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
            const tokenId = decodedToken.id
            const comment = await Comment.findOne({ where: { id: commentId } });
            const isAdmin = await User.findOne({ where: { id: tokenId } })

            console.log(isAdmin.isAdmin);
            if (isAdmin.isAdmin === true) {
                console.log('UTILISATEUR ADMIN');
                next()
            }
// MODIFIER CA, LA LOGIQUE
            else if (comment.userId !== req.body.userId) {
                return res.status(403).json({ message: 'Vous n\'avez pas le droit de faire celà dans les commentaire' })
            }
            else if(comment.userId === req.body.userId) {
                next()
            }

        } catch (error) {
            res.status(401).json({ error: 'erreur dans le mwAdmin' });
        }
    }
    else {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
            const tokenId = decodedToken.id
            const post = await Post.findOne({ where: { id: id } });
            const isAdmin = await User.findOne({ where: { id: tokenId } })

            console.log(isAdmin.isAdmin);
            if (isAdmin.isAdmin === true) {
                console.log('UTILISATEUR ADMIN');
                next()
            }
            else if (post.userId !== req.body.userId) {
                return res.status(403).json({ message: 'Vous n\'avez pas le droit de faire celà dans les post' })
            }
            else if(post.userId === req.body.userId) {
                next()
            }

        } catch (error) {
            res.status(401).json({ error: 'erreur dans le mwAdmin' });
        }
    }
}