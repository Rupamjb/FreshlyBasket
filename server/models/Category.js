import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    description: {
      type: String,
      trim: true
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null
    },
    image: {
      type: String,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Pre-find middleware to populate subcategories
categorySchema.pre(/^find/, function(next) {
  // Only populate if not explicitly disabled by passing noPopulate
  if (!this.getOptions().noPopulate) {
    this.populate({
      path: 'subcategories',
      // Don't recursively populate subcategories of subcategories to avoid infinite nesting
      options: { noPopulate: true }
    });
  }
  next();
});

const Category = mongoose.model('Category', categorySchema);

export default Category; 