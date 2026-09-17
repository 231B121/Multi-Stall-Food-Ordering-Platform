const mongoose = require('mongoose');

/**
 * Product Model Schema
 * Represents an individual menu item sold by a specific food stall.
 * Implements strict multi-tenant isolation via mandatory `stallId` and
 * hierarchical grouping via `categoryId`.
 */
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
// High-performance compound indexes for multi-tenant query isolation:
productSchema.index({ stallId: 1 });                         // Primary index for stall catalog lookups
productSchema.index({ stallId: 1, categoryId: 1 });          // Compound index for filtering items by stall category
productSchema.index({ stallId: 1, isAvailable: 1 });         // Filter only in-stock/available items
productSchema.index({ stallId: 1, createdAt: -1 });          // Reverse chronological sorting for recent additions

const Product = mongoose.model('Product', productSchema);

module.exports = Product;