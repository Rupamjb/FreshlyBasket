import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import Product from '../models/Product.js';
colors.enable();
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://debangsu12:sunny120205@cluster0.rhnpbaa.mongodb.net/grocery-ecommerce?retryWrites=true&w=majority&appName=Cluster0";
const checkDatabase = async () => {
    try {
        console.log('Connecting to MongoDB...'.yellow);
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB'.green);
        const productCount = await Product.countDocuments();
        console.log(`Total products in database: ${productCount}`.cyan);
        const categories = await Product.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        console.log('\nProducts by category:'.yellow);
        if (categories.length === 0) {
            console.log('No categories found - database may be empty'.red);
        }
        else {
            categories.forEach(category => {
                console.log(`${category._id}: ${category.count} items`);
            });
        }
        const sampleProduct = await Product.findOne().lean();
        if (sampleProduct) {
            console.log('\nSample product fields:'.yellow);
            Object.entries(sampleProduct).forEach(([key, value]) => {
                let displayValue = '';
                if (value === null) {
                    displayValue = 'null';
                }
                else if (value === undefined) {
                    displayValue = 'undefined';
                }
                else if (typeof value === 'object') {
                    try {
                        displayValue = JSON.stringify(value);
                    }
                    catch (e) {
                        displayValue = '[Complex Object]';
                    }
                }
                else {
                    displayValue = String(value);
                }
                console.log(`${key}: ${typeof value} (${displayValue})`.gray);
            });
        }
        else {
            console.log('No products found to check schema'.red);
        }
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB'.green);
    }
    catch (error) {
        console.error('Error checking database:'.red.bold, error);
        process.exit(1);
    }
};
checkDatabase()
    .then(() => {
    console.log('Database check completed successfully.'.green.bold);
    process.exit(0);
})
    .catch(error => {
    console.error(`Database check failed: ${error.message}`.red.bold);
    process.exit(1);
});
//# sourceMappingURL=checkDatabase.js.map