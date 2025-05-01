import mongoose from 'mongoose';
declare const Product: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    unit: "item" | "g" | "kg" | "lb" | "oz" | "liter" | "ml" | "pack" | "bunch" | "dozen";
    name: string;
    description: string;
    price: number;
    category: "Fruits" | "Vegetables" | "Dairy" | "Bakery" | "Meat" | "Seafood" | "Frozen" | "Beverages" | "Snacks" | "Grains" | "Canned Goods" | "Other";
    stock: number;
    imageUrl: string;
    isActive: boolean;
    slug?: string | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    unit: "item" | "g" | "kg" | "lb" | "oz" | "liter" | "ml" | "pack" | "bunch" | "dozen";
    name: string;
    description: string;
    price: number;
    category: "Fruits" | "Vegetables" | "Dairy" | "Bakery" | "Meat" | "Seafood" | "Frozen" | "Beverages" | "Snacks" | "Grains" | "Canned Goods" | "Other";
    stock: number;
    imageUrl: string;
    isActive: boolean;
    slug?: string | undefined;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    unit: "item" | "g" | "kg" | "lb" | "oz" | "liter" | "ml" | "pack" | "bunch" | "dozen";
    name: string;
    description: string;
    price: number;
    category: "Fruits" | "Vegetables" | "Dairy" | "Bakery" | "Meat" | "Seafood" | "Frozen" | "Beverages" | "Snacks" | "Grains" | "Canned Goods" | "Other";
    stock: number;
    imageUrl: string;
    isActive: boolean;
    slug?: string | undefined;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    toJSON: {
        virtuals: true;
    };
    toObject: {
        virtuals: true;
    };
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    unit: "item" | "g" | "kg" | "lb" | "oz" | "liter" | "ml" | "pack" | "bunch" | "dozen";
    name: string;
    description: string;
    price: number;
    category: "Fruits" | "Vegetables" | "Dairy" | "Bakery" | "Meat" | "Seafood" | "Frozen" | "Beverages" | "Snacks" | "Grains" | "Canned Goods" | "Other";
    stock: number;
    imageUrl: string;
    isActive: boolean;
    slug?: string | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    unit: "item" | "g" | "kg" | "lb" | "oz" | "liter" | "ml" | "pack" | "bunch" | "dozen";
    name: string;
    description: string;
    price: number;
    category: "Fruits" | "Vegetables" | "Dairy" | "Bakery" | "Meat" | "Seafood" | "Frozen" | "Beverages" | "Snacks" | "Grains" | "Canned Goods" | "Other";
    stock: number;
    imageUrl: string;
    isActive: boolean;
    slug?: string | undefined;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    unit: "item" | "g" | "kg" | "lb" | "oz" | "liter" | "ml" | "pack" | "bunch" | "dozen";
    name: string;
    description: string;
    price: number;
    category: "Fruits" | "Vegetables" | "Dairy" | "Bakery" | "Meat" | "Seafood" | "Frozen" | "Beverages" | "Snacks" | "Grains" | "Canned Goods" | "Other";
    stock: number;
    imageUrl: string;
    isActive: boolean;
    slug?: string | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
export default Product;
