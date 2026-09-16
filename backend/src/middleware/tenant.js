const Stall = require('../models/Stall');

// ===== VERIFY STALL OWNERSHIP =====

exports.verifyStallOwnership = async (req, res, next) => {
  try {
    const { stallId } = req.params;

    // SUPER_ADMIN can do anything
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    // STALL_ADMIN must own the stall
    if (req.user.role === 'STALL_ADMIN') {
      const stall = await Stall.findById(stallId);
      if (!stall) {
        return res.status(404).json({ error: 'Stall not found' });
      }

      if (stall.adminId.toString() !== req.user.userId) {
        return res.status(403).json({
          error: 'Cannot access this stall',
        });
      }

      // Attach stall to request
      req.stall = stall;
      return next();
    }

    // Regular USER cannot access admin endpoints
    res.status(403).json({
      error: 'Only stall admins can access this resource',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};