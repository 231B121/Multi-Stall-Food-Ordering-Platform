const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate requests using JWT Access Token
 * Looks for 'Bearer <token>' in the Authorization header
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    return res.status(401).json({
      error: 'Access token required',
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        error: 'Invalid or expired access token',
      });
    }

    req.user = decoded; // { userId, role, ... }
    next();
  });
};

/**
 * Middleware to authorize requests based on user role(s)
 * Usage: authorizeRole('SUPER_ADMIN', 'STALL_ADMIN')
 */
const authorizeRole = (...allowedRoles) => {
  const roles = allowedRoles.flat();
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied: insufficient permissions',
      });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRole,
};