const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    stallId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stall',
      required: [true, 'Category must belong to a stall'],
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: null,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Indexes for performance
categorySchema.index({ stallId: 1 });
categorySchema.index({ stallId: 1, displayOrder: 1 });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
