// import module
const jwt = require('jsonwebtoken');
// import model user
// const User = require('../models/user')
const Comment = require('../models/comment')

// MODIFIER LE MODEL POUR INTEGRER L'ID----------
// SINON IMPOSSIBLE DE VERIFIER LE TOKEN-----------


module.exports = async (req, res, next) => {
    const { commentId } = req.params;
    let comment = await Comment.findOne({where: { id : commentId}})
    // console.log(comment);
    try {
        // console.log('POST DANS TOKEN',comment);
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // console.log('DECODED TOKEN :', decodedToken);
        const tokenID = decodedToken.id;
        // console.log("ID DANS LE TOKEN", tokenID);
        if (tokenID && tokenID !== comment.userId) {
            return res.status(403).json({ message: 'Vous n\'avez pas le droit de faire cela' });
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: 'token invalide'
        });
    }
};