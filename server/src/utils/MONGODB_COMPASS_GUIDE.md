# Importing Products with MongoDB Compass

This guide explains how to use MongoDB Compass (a visual GUI tool) to import your grocery e-commerce products if you're having trouble with direct script uploads.

## Step 1: Generate Products JSON File

1. First, compile the TypeScript files:
   ```
   npm run build
   ```

2. Generate a JSON export file with your products:
   ```
   node src/utils/generateProductsJSON.js
   ```

3. This will create a file `products-export.json` in your server directory, properly formatted for MongoDB import.

## Step 2: Install MongoDB Compass

1. Download MongoDB Compass from [https://www.mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass)
2. Install the application on your computer

## Step 3: Connect to MongoDB Atlas with Compass

1. Open MongoDB Compass
2. Get your MongoDB Atlas connection string from the Atlas dashboard:
   - Click "Connect" on your cluster
   - Choose "Connect using MongoDB Compass"
   - Copy the connection string
3. Paste it into Compass connection field
4. Replace `<password>` with your database user password
5. Click "Connect"

## Step 4: Create Database and Collection

1. Once connected, click "Create Database"
2. Enter "grocery-ecommerce" for the database name
3. Enter "products" for the collection name
4. Click "Create Database"

## Step 5: Import the JSON File

1. Navigate to the "products" collection you just created
2. Click "Add Data" > "Import File"
3. Select the `products-export.json` file you generated in Step 1
4. Select "JSON" as the format
5. Click "Import"

## Step 6: Verify Your Data

1. After import completes, you should see all your products in the collection
2. You can use the filter and sort options to explore your data
3. The collection should contain all 165 products across all categories

## Additional Options

If you need to modify your database structure:

1. **Add indexes**: Click on the "Indexes" tab to add indexes for faster searching
2. **Update products**: Use the "Edit Document" option to modify individual products
3. **Export data**: Use the "Export Data" option to create backups of your collection

MongoDB Compass makes it easy to visually manage your database without needing to write complex queries or scripts.

## Troubleshooting

- If the import fails, check if your JSON is properly formatted
- If you get connection errors, verify your MongoDB Atlas network settings
- If you can't see your data after import, refresh the collection view 