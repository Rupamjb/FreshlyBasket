import mongoose from 'mongoose';
export declare const runSeeder: () => Promise<mongoose.MergeType<mongoose.Document<unknown, {}, {
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
}, Omit<{
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    unit: string;
    imageUrl: string;
    slug: string;
}, "_id">>[]>;
