import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import Product from '../models/Product.js';
colors.enable();
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://debangsu12:sunny120205@cluster0.rhnpbaa.mongodb.net/grocery-ecommerce?retryWrites=true&w=majority&appName=Cluster0";
const checkProducts = async () => {
    try {
        console.log('Connecting to MongoDB...'.yellow);
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB'.green);
        const allProducts = await Product.find({}).lean();
        console.log(`\nTotal products (no filters): ${allProducts.length}`.cyan);
        const activeProducts = await Product.find({ isActive: true }).lean();
        console.log(`\nActive products (isActive=true): ${activeProducts.length}`.cyan);
        const productsWithoutActiveFilter = await Product.find({
            $or: [
                { isActive: { $exists: false } },
                { isActive: null }
            ]
        }).lean();
        console.log(`\nProducts without isActive field: ${productsWithoutActiveFilter.length}`.cyan);
        if (allProducts.length > 0) {
            console.log('\nSample product:'.yellow);
            console.log(JSON.stringify(allProducts[0], null, 2));
        }
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB'.green);
    }
    catch (error) {
        console.error('Error checking products:', error);
        process.exit(1);
    }
};
checkProducts()
    .then(() => {
    console.log('Products check completed successfully.'.green.bold);
    process.exit(0);
})
    .catch(error => {
    console.error(`Products check failed: ${error.message}`.red.bold);
    process.exit(1);
});
//# sourceMappingURL=checkProducts.js.map