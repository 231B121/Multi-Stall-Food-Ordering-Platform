const jwt = require('jsonwebtoken');

/**
 * Authenticate Token Middleware
 * Validates incoming JSON Web Token (JWT) from Authorization header.
 * 
 * Expected Header Format: `Authorization: Bearer <access_token>`
 * Attaches decoded payload `{ userId, role, mobile }` to `req.user`.
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
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
 * Role-Based Access Control (RBAC) Middleware
 * Restricts route access to users possessing one of the allowed roles.
 * 
 * @example
 * router.post('/stall', authenticateToken, authorizeRole('SUPER_ADMIN'), createStall);
 * router.put('/stall/:id', authenticateToken, authorizeRole('SUPER_ADMIN', 'STALL_ADMIN'), updateStall);
 * 
 * @param {...string} allowedRoles - List of permitted roles (e.g., 'SUPER_ADMIN', 'STALL_ADMIN', 'CUSTOMER')
 * @returns {import('express').RequestHandler} Express middleware handler
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