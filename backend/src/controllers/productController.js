const Product = require('../models/Product');
const Category = require('../models/Category');
const Stall = require('../models/Stall');

// ===== CREATE PRODUCT =====

exports.createProduct = async (req, res) => {
  try {
    const { stallId } = req.params;
    const { name, description, price, categoryId, image, isVegetarian } =
      req.body;

    // Verify ownership
    if (
      req.user.role !== 'SUPER_ADMIN' &&
      req.user.stallId !== stallId
    ) {
      return res.status(403).json({
        error: 'Cannot create product for this stall',
      });
    }

    // Verify stall exists
    const stall = await Stall.findById(stallId);
    if (!stall) {
      return res.status(404).json({ error: 'Stall not found' });
    }

    // Verify category belongs to stall
    const category = await Category.findOne({ _id: categoryId, stallId });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
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

// ===== GET PRODUCTS FOR STALL (PUBLIC) =====

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

    // Verify ownership
    if (
      req.user.role !== 'SUPER_ADMIN' &&
      req.user.stallId !== stallId
    ) {
      return res.status(403).json({
        error: 'Cannot modify this product',
      });
    }

    // Verify product belongs to stall
    const product = await Product.findOne({ _id: productId, stallId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
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

    // Verify ownership
    if (
      req.user.role !== 'SUPER_ADMIN' &&
      req.user.stallId !== stallId
    ) {
      return res.status(403).json({
        error: 'Cannot delete this product',
      });
    }

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