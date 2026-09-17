const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Stall = require('../models/Stall');

/**
 * Create a new product under a specific stall
 * @route POST /api/stalls/:stallId/products
 * @access Private (STALL_ADMIN or SUPER_ADMIN)
 * @desc Enforces category ownership and tenant isolation
 */
exports.createProduct = async (req, res) => {
  try {
    const { stallId } = req.params;
    const { name, description, price, categoryId, image, isVegetarian } =
      req.body;

    // Validate input
    if (!name || price === undefined || !categoryId) {
      return res.status(400).json({
        error: 'Name, price, and categoryId are required',
      });
    }

    // Verify stall exists (or use req.stall attached by verifyStallOwnership)
    const stall = req.stall || (await Stall.findById(stallId));
    if (!stall) {
      return res.status(404).json({ error: 'Stall not found' });
    }

    // Validate categoryId format
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        error: 'Invalid categoryId format. Please provide a valid category ObjectId.',
      });
    }

    // Verify category belongs to stall
    const category = await Category.findOne({ _id: categoryId, stallId });
    if (!category) {
      return res.status(404).json({
        error: 'Category not found for this stall',
      });
    }

    const product = new Product({
      stallId,
      categoryId,
      name,
      description,
      price,
      image,
      isVegetarian,
    });

    await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get list of available products for a stall with optional category filter
 * @route GET /api/stalls/:stallId/products
 * @access Public
 * @desc Returns menu items populated with category details
 */
exports.getProductsByStall = async (req, res) => {
  try {
    const { stallId } = req.params;
    const { categoryId } = req.query;

    // Verify stall exists
    const stall = await Stall.findById(stallId);
    if (!stall) {
      return res.status(404).json({ error: 'Stall not found' });
    }

    // Build filter
    const filter = { stallId, isAvailable: true };
    if (categoryId) {
      filter.categoryId = categoryId;
    }

    const products = await Product.find(filter)
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== GET PRODUCT BY ID (PUBLIC) =====

exports.getProductById = async (req, res) => {
  try {
    const { stallId, productId } = req.params;

    const product = await Product.findOne({
      _id: productId,
      stallId,
    }).populate('categoryId');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== UPDATE PRODUCT =====

exports.updateProduct = async (req, res) => {
  try {
    const { stallId, productId } = req.params;
    const updates = req.body;

    // Verify product belongs to stall
    const product = await Product.findOne({ _id: productId, stallId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // If updating categoryId, verify it exists and belongs to stall
    if (updates.categoryId) {
      if (!mongoose.Types.ObjectId.isValid(updates.categoryId)) {
        return res.status(400).json({ error: 'Invalid categoryId format' });
      }
      const category = await Category.findOne({
        _id: updates.categoryId,
        stallId,
      });
      if (!category) {
        return res.status(404).json({
          error: 'New category not found for this stall',
        });
      }
    }

    const updated = await Product.findByIdAndUpdate(productId, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      message: 'Product updated successfully',
      product: updated,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== DELETE PRODUCT =====

exports.deleteProduct = async (req, res) => {
  try {
    const { stallId, productId } = req.params;

    const product = await Product.findOneAndDelete({
      _id: productId,
      stallId,
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};