import { writeFileSync } from 'fs';

const envContent = `PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/freshly-basket
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d`;

writeFileSync('.env', envContent);
console.log('.env file created successfully'); 