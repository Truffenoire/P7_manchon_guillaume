const jwt = require('jsonwebtoken');
const User = require('../models/user')

module.exports = async (req, res, next) => {
  const { id } = req.params;
  // console.log(req.body);
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const tokenId = decodedToken.id

    const isAdmin = await User.findOne({where : {id : tokenId}})
    // console.log('USERID : ', tokenId);
    // console.log(isAdmin.isAdmin);
    // console.log(id);
    if ( req.body.userId !== tokenId || tokenId != id ) {
      return res.status(403).json( {message : 'ID invalid'})
    }
    else if(isAdmin.isAdmin === true) {
      next()
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: 'erreur dans le authCour' });
  }
};