# MongoDB Atlas Setup Guide

This guide will help you set up a free MongoDB Atlas account and upload your grocery e-commerce products to it.

## Step 1: Create a MongoDB Atlas Account

1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account (you can use Google, GitHub, or create a new account with your email)
3. Complete the "Tell us a few things..." survey
4. Click "Create a Free Cluster" (Shared free tier)

## Step 2: Set Up Your Database

1. Choose a cloud provider (AWS, Google Cloud, or Azure) - any will work
2. Select the region closest to you
3. Keep the default options for Cluster Tier (M0 Sandbox)
4. Give your cluster a name (e.g., "GroceryEcommerce")
5. Click "Create Cluster" (it will take a few minutes to provision)

## Step 3: Create a Database User

1. In the left sidebar, click "Database Access" under Security
2. Click "Add New Database User"
3. Choose "Password" authentication method
4. Enter a username and password (save these, you'll need them)
5. Set privileges to "Read and Write to Any Database"
6. Click "Add User"

## Step 4: Set Network Access

1. In the left sidebar, click "Network Access" under Security
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development purposes)
4. Click "Confirm"

## Step 5: Get Your Connection String

1. Go back to the "Database" page
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (it looks like `mongodb+srv://username:<password>@clustername.mongodb.net/`)
5. Replace `<password>` with the password you created for your database user

## Step 6: Update the Connection String in Code

1. Open the file `server/src/utils/uploadToMongoDBAtlas.js`
2. Replace the placeholder connection string with your own:
   ```javascript
   const MONGODB_URI = "mongodb+srv://your_username:your_password@your_cluster.mongodb.net/grocery-ecommerce?retryWrites=true&w=majority";
   ```
3. Save the file

## Step 7: Build and Run the Seeder

1. First, compile the TypeScript files by running:
   ```
   npm run build
   ```
2. Then, run the MongoDB Atlas uploader:
   ```
   node src/utils/uploadToMongoDBAtlas.js
   ```
3. The script will connect to MongoDB Atlas and upload all 165 products
4. You should see confirmation messages in the console

## Step 8: View Your Data in MongoDB Atlas

1. Go back to your MongoDB Atlas dashboard
2. Click "Browse Collections" on your cluster
3. You should see the "grocery-ecommerce" database with a "products" collection
4. Browse through your products to verify they were uploaded correctly

## Troubleshooting

- If you see connection errors, make sure your IP address is allowed in Network Access
- If you see authentication errors, verify your username and password are correct
- If the script times out, try again or check your internet connection
- If you need to modify the database name, change "grocery-ecommerce" in the connection string to your preferred name

Congratulations! You've now set up MongoDB Atlas and uploaded your grocery e-commerce products to the cloud. 