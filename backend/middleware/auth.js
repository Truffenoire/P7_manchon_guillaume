// import module
const jwt = require('jsonwebtoken');
// import model user
// const User = require('../models/user')
const Post = require('../models/post')

// MODIFIER LE MODEL POUR INTEGRER L'ID----------
// SINON IMPOSSIBLE DE VERIFIER LE TOKEN-----------


module.exports = async (req, res, next) => {
  const { id } = req.params;
  let post = await Post.findOne({where: { id : id}})
  try {
    // console.log('POST DANS TOKEN',post.userId);
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    // console.log('DECODED TOKEN :',decodedToken);
    const userId = decodedToken.id;
    if (userId && userId !== post.userId) {
      return res.status(403).json({message:'Vous n\'avez pas le droit de faire cela'});
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: 'token invalide'
    });
  }
};