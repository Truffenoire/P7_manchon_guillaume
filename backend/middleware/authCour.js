const jwt = require('jsonwebtoken');


module.exports = async (req, res, next) => {
  const { id } = req.params;
  // console.log(req.body);
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const tokenId = decodedToken.id

    if (req.body.userId && req.body.userId !== tokenId) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé a faire celà dans le auth' })
    }
    else {
      console.log('UTILISATEUR ENREGISTRE');
      next();
    }
  } catch (error) {
    res.status(401).json({ error: 'erreur dans le authCour' });
  }
};