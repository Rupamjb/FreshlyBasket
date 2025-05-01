# Product Seeding Guide

This guide explains how to use the new product seeding system for the grocery e-commerce platform.

## Overview

We've created a simplified product seeding system that:

1. Creates 10 products across 5 different categories (Vegetables, Fruits, Dairy, Bakery, Snacks)
2. Includes proper slugs for each product
3. Uploads data directly to MongoDB Atlas
4. Provides verification tools

## Available Scripts

### Seed Products Locally (TypeScript)

To run the seeder directly from TypeScript:

```bash
npm run seed:new
```

### Upload Products to MongoDB Atlas

To compile TypeScript and upload products to MongoDB Atlas:

```bash
npm run upload:new
```

### Verify Products in MongoDB

To check what products are currently in your MongoDB database:

```bash
npm run verify:products
```

## Customizing the Seeder

If you want to add more products or modify existing ones:

1. Edit `src/utils/newProductSeeder.ts`
2. Add or modify products in the `products` array
3. Make sure each product has:
   - A unique name
   - An appropriate category
   - A realistic price
   - Stock level
   - Unit type
   - Image URL
   - Slug (generated from name)
4. Run the seeder script

## Example Product Structure

```typescript
{
  name: 'Fresh Tomatoes',
  description: 'Vine-ripened fresh tomatoes, perfect for salads and cooking.',
  price: 2.99,
  category: 'Vegetables', // Must be one of the valid categories
  stock: 100,
  unit: 'kg', // Must be one of the valid units
  imageUrl: 'https://images.unsplash.com/photo-1546094096-0df4bcaad234',
  slug: generateSlug('Fresh Tomatoes')
}
```

## Categories

The following categories are supported:
- Fruits
- Vegetables
- Dairy
- Bakery
- Meat
- Seafood
- Frozen
- Beverages
- Snacks
- Grains
- Canned Goods
- Other

## Units

The following units are supported:
- kg
- g
- lb
- oz
- liter
- ml
- item
- pack
- bunch
- dozen

## MongoDB Connection

The seeder connects to MongoDB Atlas using the connection string in `uploadProductsToMongoDB.js`.

If you need to use a different connection:
1. Update the `MONGODB_URI` in `uploadProductsToMongoDB.js`
2. Run the upload script again

## Troubleshooting

- **Connection Issues**: Check if your MongoDB Atlas connection string is correct
- **Duplicate Key Errors**: Make sure each product has a unique slug
- **TypeScript Errors**: Run `npm run build` to check for compilation errors 
 
 