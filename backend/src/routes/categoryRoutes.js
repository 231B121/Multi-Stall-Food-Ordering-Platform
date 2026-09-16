const express = require('express');
const router = express.Router({ mergeParams: true }); // For :stallId
const categoryController = require('../controllers/categoryController');
const { authenticateToken } = require('../middleware/auth');
const { verifyStallOwnership } = require('../middleware/tenant');

// Public routes
router.get(
  '/',
  categoryController.getCategoriesByStall
);

// Protected routes
router.post(
  '/',
  authenticateToken,
  verifyStallOwnership,
  categoryController.createCategory
);

router.patch(
  '/:categoryId',
  authenticateToken,
  verifyStallOwnership,
  categoryController.updateCategory
);

router.delete(
  '/:categoryId',
  authenticateToken,
  verifyStallOwnership,
  categoryController.deleteCategory
);

module.exports = router;