const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User schema
const userSchema = new mongoose.Schema(
  {
    // Basic info
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      unique: true, // No two users with same mobile
      match: [/^[0-9]{10}$/, 'Mobile must be 10 digits'],
    },
    email: {
      type: String,
      sparse: true, // Can be null, but if not null, must be unique
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['USER', 'STALL_ADMIN', 'SUPER_ADMIN'],
      default: 'USER',
    },

    // Referral system (we'll use this on Day 8)
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // Account status
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false, // Will be true after OTP verification
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // Auto update updatedAt
);

// ===== MIDDLEWARE (Pre-hooks) =====

// Hash password before saving (only if modified)
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ===== METHODS =====

// Compare plain password with hashed password
userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

// Remove sensitive fields from JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password; // Never return password
  return obj;
};

// Index for pagination (mobile, email, referralCode already indexed via unique: true)
userSchema.index({ createdAt: -1 });

const User = mongoose.model('User', userSchema);

module.exports = User;