import mongoose from 'mongoose';
import { slugify } from '../utils/helpers.js';
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxLength: [100, 'Product name cannot exceed 100 characters']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        enum: {
            values: [
                'Fruits',
                'Vegetables',
                'Dairy',
                'Bakery',
                'Meat',
                'Seafood',
                'Frozen',
                'Beverages',
                'Snacks',
                'Grains',
                'Canned Goods',
                'Other'
            ],
            message: 'Please select a valid category'
        }
    },
    stock: {
        type: Number,
        required: [true, 'Product stock is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    imageUrl: {
        type: String,
        required: [true, 'Product image URL is required']
    },
    unit: {
        type: String,
        required: [true, 'Product unit is required'],
        default: 'item',
        enum: {
            values: ['kg', 'g', 'lb', 'oz', 'liter', 'ml', 'item', 'pack', 'bunch', 'dozen'],
            message: 'Please select a valid unit'
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
productSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name);
    }
    next();
});
productSchema.virtual('discountedPrice').get(function () {
    return this.price;
});
const Product = mongoose.model('Product', productSchema);
export default Product;
//# sourceMappingURL=Product.js.map