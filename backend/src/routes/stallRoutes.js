const express = require('express');
const router = express.Router();
const stallController = require('../controllers/stallController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { verifyStallOwnership } = require('../middleware/tenant');

// Public routes
router.get('/slug/:slug', stallController.getStallBySlug);

// Protected routes
router.post(
  '/',
  authenticateToken,
  stallController.createStall
);

router.get(
  '/:stallId',
  authenticateToken,
  verifyStallOwnership,
  stallController.getStallById
);

router.patch(
  '/:stallId',
  authenticateToken,
  verifyStallOwnership,
  stallController.updateStall
);

// Super admin only
router.get(
  '/',
  authenticateToken,
  authorizeRole(['SUPER_ADMIN']),
  stallController.getAllStalls
);

router.delete(
  '/:stallId',
  authenticateToken,
  authorizeRole(['SUPER_ADMIN']),
  stallController.deleteStall
);

module.exports = router;