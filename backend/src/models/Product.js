const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    // Basic info
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: String,
    image: String, // URL

    // Pricing
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountedPrice: {
      type: Number,
      min: [0, 'Discounted price cannot be negative'],
    },

    // Tenant isolation
    stallId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stall',
      required: [true, 'Product must belong to a stall'],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product must belong to a category'],
    },

    // Inventory
    isAvailable: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      default: 999, // -1 = unlimited
    },

    // Vegetarian indicator
    isVegetarian: {
      type: Boolean,
      default: false,
    },

    // Ratings
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    reviewCount: {
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

// ===== INDEXES =====

// Most important: Fast lookup by stall & category
productSchema.index({ stallId: 1 });
productSchema.index({ stallId: 1, categoryId: 1 });
// For filtering
productSchema.index({ stallId: 1, isAvailable: 1 });
// For quick access
productSchema.index({ stallId: 1, createdAt: -1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;