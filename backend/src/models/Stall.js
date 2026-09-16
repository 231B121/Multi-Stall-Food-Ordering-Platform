const mongoose = require('mongoose');
const slugify = require('slugify');

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
stallSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// ===== INDEXES =====

stallSchema.index({ adminId: 1 }); // Find stalls by admin
stallSchema.index({ isActive: 1 }); // Filter active stalls
stallSchema.index({ createdAt: -1 }); // Pagination

const Stall = mongoose.model('Stall', stallSchema);

module.exports = Stall;