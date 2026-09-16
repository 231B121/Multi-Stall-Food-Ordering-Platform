const Category = require('../models/Category');
const Stall = require('../models/Stall');

// ===== CREATE CATEGORY =====

exports.createCategory = async (req, res) => {
  try {
    const { stallId } = req.params;
    const { name, description, image, displayOrder } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    // Verify stall exists (or use req.stall from verifyStallOwnership)
    const stall = req.stall || (await Stall.findById(stallId));
    if (!stall) {
      return res.status(404).json({ error: 'Stall not found' });
    }

    const category = new Category({
      stallId,
      name,
      description,
      image,
      displayOrder: displayOrder || 0,
    });

    await category.save();

    res.status(201).json({
      message: 'Category created successfully',
      category,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== GET CATEGORIES FOR STALL (PUBLIC) =====

exports.getCategoriesByStall = async (req, res) => {
  try {
    const { stallId } = req.params;

    // Verify stall exists
    const stall = await Stall.findById(stallId);
    if (!stall) {
      return res.status(404).json({ error: 'Stall not found' });
    }

    const categories = await Category.find({ stallId, isActive: true }).sort({
      displayOrder: 1,
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== UPDATE CATEGORY =====

exports.updateCategory = async (req, res) => {
  try {
    const { stallId, categoryId } = req.params;
    const updates = req.body;

    // Verify category belongs to stall
    const category = await Category.findOne({ _id: categoryId, stallId });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const updated = await Category.findByIdAndUpdate(categoryId, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      message: 'Category updated successfully',
      category: updated,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== DELETE CATEGORY =====

exports.deleteCategory = async (req, res) => {
  try {
    const { stallId, categoryId } = req.params;

    const category = await Category.findOneAndDelete({
      _id: categoryId,
      stallId,
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({
      message: 'Category deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};