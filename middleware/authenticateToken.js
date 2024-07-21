const jwt = require('jsonwebtoken');
const { isTokenBlacklisted } = require('../controllers/userController'); // Adjust the path as necessary

const JWT_SECRET = process.env.JWT_SECRET || 'e08e19dd47b1ccb6fc50f1edbe10d4a8f5ad19f71fced245553341f2dd432f7e';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Received token:', token); // Debugging log

  if (token == null) return res.sendStatus(401);

  if (isTokenBlacklisted(token)) {
    return res.status(401).json({ error: "Token has been logged out" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification error:', err); // Debugging log
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
