const Stall = require('../models/Stall');
const User = require('../models/User');

// ===== CREATE STALL (SUPER_ADMIN or User) =====

exports.createStall = async (req, res) => {
  try {
    const { name, description, location, phone, cuisineType } = req.body;

    // Validate input
    if (!name) {
      return res.status(400).json({ error: 'Stall name is required' });
    }

    // Create stall
    const stall = new Stall({
      name,
      description,
      location,
      phone,
      cuisineType,
      adminId: req.user.userId, // Current user becomes admin
    });

    await stall.save();

    // Update user to have STALL_ADMIN role
    await User.findByIdAndUpdate(req.user.userId, {
      role: 'STALL_ADMIN',
      $addToSet: { stallIds: stall._id }, // Add to array of stalls
    });

    res.status(201).json({
      message: 'Stall created successfully',
      stall,
    });
  } catch (error) {
    console.error('Create stall error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// ===== GET STALL BY SLUG (PUBLIC) =====

exports.getStallBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const stall = await Stall.findOne({ slug, isActive: true }).populate(
      'adminId',
      'name phone'
    );

    if (!stall) {
      return res.status(404).json({ error: 'Stall not found' });
    }

    res.json(stall);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== GET STALL BY ID (OWNER or SUPER_ADMIN) =====

exports.getStallById = async (req, res) => {
  try {
    const { stallId } = req.params;

    // Verify ownership (unless SUPER_ADMIN)
    if (
      req.user.role !== 'SUPER_ADMIN' &&
      req.user.stallId !== stallId
    ) {
      return res.status(403).json({
        error: 'Cannot access this stall',
      });
    }

    const stall = await Stall.findById(stallId).populate('adminId');

    if (!stall) {
      return res.status(404).json({ error: 'Stall not found' });
    }

    res.json(stall);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== UPDATE STALL (OWNER or SUPER_ADMIN) =====

exports.updateStall = async (req, res) => {
  try {
    const { stallId } = req.params;
    const updates = req.body;

    // Verify ownership
    if (
      req.user.role !== 'SUPER_ADMIN' &&
      req.user.stallId !== stallId
    ) {
      return res.status(403).json({
        error: 'Cannot modify this stall',
      });
    }

    // Prevent admin from changing adminId
    delete updates.adminId;

    const stall = await Stall.findByIdAndUpdate(stallId, updates, {
      new: true,
      runValidators: true,
    });

    if (!stall) {
      return res.status(404).json({ error: 'Stall not found' });
    }

    res.json({
      message: 'Stall updated successfully',
      stall,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== GET ALL STALLS (SUPER_ADMIN) =====

exports.getAllStalls = async (req, res) => {
  try {
    // Only SUPER_ADMIN can see all stalls
    if (req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        error: 'Only super admin can view all stalls',
      });
    }

    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const stalls = await Stall.find()
      .populate('adminId', 'name phone')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Stall.countDocuments();

    res.json({
      stalls,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== DELETE STALL (SUPER_ADMIN) =====

exports.deleteStall = async (req, res) => {
  try {
    const { stallId } = req.params;

    // Only SUPER_ADMIN can delete
    if (req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        error: 'Only super admin can delete stalls',
      });
    }

    const stall = await Stall.findByIdAndDelete(stallId);

    if (!stall) {
      return res.status(404).json({ error: 'Stall not found' });
    }

    res.json({
      message: 'Stall deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};