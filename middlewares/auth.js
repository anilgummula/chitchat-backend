const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {

  const token = req.headers['authorization'];
//   console.log('Authorization Header:', req.headers['authorization']);

  if (!token) {
    return res.status(403).json({
    message: "Unauthorized, JWT Token is required"
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized, JWT Token is invalid"
    });
  }
};

module.exports = {ensureAuthenticated};
