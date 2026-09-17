const mongoose = require('mongoose');
const slugify = require('slugify');

/**
 * Stall Model Schema
 * Represents a food stall/outlet within the multi-tenant food ordering platform.
 * Each stall is administered by a STALL_ADMIN user and encapsulates its own
 * menu categories, products, inventory, and order history.
 */
const stallSchema = new mongoose.Schema(
  {
    // Basic info
    name: {
      type: String,
      required: [true, 'Stall name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      sparse: true,
    },
    description: {
      type: String,
      default: '',
    },
    logo: {
      type: String, // URL from Cloudinary (we'll implement later)
      default: null,
    },
    coverImage: {
      type: String, // URL
      default: null,
    },

    // Contact info
    location: {
      address: String,
      city: String,
      latitude: Number,
      longitude: Number,
    },
    phone: {
      type: String,
      match: [/^[0-9]{10}$/, 'Phone must be 10 digits'],
    },

    // Operating hours
    openingTime: String, // "09:00"
    closingTime: String, // "22:00"
    isOpen: {
      type: Boolean,
      default: true,
    },

    // Business info
    cuisineType: [String], // ['Burgers', 'Fries', 'Shakes']
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },

    // Admin reference
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Stall must have an admin'],
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    // Analytics
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },

    // Metadata
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// ===== MIDDLEWARE =====

// Auto-generate slug before saving
stallSchema.pre('save', function () {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});

// ===== INDEXES =====
// Optimized compound and single-field indexing for query performance:
stallSchema.index({ adminId: 1 });        // Speeds up stall lookups by admin owner
stallSchema.index({ isActive: 1 });       // Fast filtering of active stalls in marketplace
stallSchema.index({ createdAt: -1 });      // Enables efficient pagination for stall listings
stallSchema.index({ slug: 1 });           // Fast URL-friendly stall profile lookups

const Stall = mongoose.model('Stall', stallSchema);

module.exports = Stall;