const express = require('express');
const router = express.Router({ mergeParams: true });
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middleware/auth');
const { verifyStallOwnership } = require('../middleware/tenant');

// Public routes
router.get('/', productController.getProductsByStall);
router.get('/:productId', productController.getProductById);

// Protected routes
router.post(
  '/',
  authenticateToken,
  verifyStallOwnership,
  productController.createProduct
);

router.patch(
  '/:productId',
  authenticateToken,
  verifyStallOwnership,
  productController.updateProduct
);

router.delete(
  '/:productId',
  authenticateToken,
  verifyStallOwnership,
  productController.deleteProduct
);

module.exports = router;