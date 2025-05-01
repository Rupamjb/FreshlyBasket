import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to a product']
    },
    rating: {
      type: Number,
      required: [true, 'Review must have a rating'],
      min: 1,
      max: 5
    },
    title: {
      type: String,
      required: [true, 'Review must have a title'],
      trim: true
    },
    comment: {
      type: String,
      required: [true, 'Review must have a comment'],
      trim: true
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create compound index to prevent duplicate reviews
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Static method to calculate average rating for a product
reviewSchema.statics.calcAverageRating = async function(productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId }
    },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);

  // Update product with calculated stats
  await mongoose.model('Product').findByIdAndUpdate(productId, {
    avgRating: stats.length > 0 ? stats[0].avgRating : 0,
    numReviews: stats.length > 0 ? stats[0].numReviews : 0
  });
};

// Update product ratings after save
reviewSchema.post('save', function() {
  this.constructor.calcAverageRating(this.product);
});

// Update product ratings after update
reviewSchema.post(/^findOneAnd/, async function(doc) {
  if (doc) {
    await doc.constructor.calcAverageRating(doc.product);
  }
});

// Populate user when querying reviews
reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name'
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);

export default Review; 