# Freshly Basket API

Backend API for the Freshly Basket e-commerce website.

## Features

- User authentication (signup, login, profile)
- JWT-based authorization
- MongoDB database
- TypeScript for type safety

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)

### Installation

1. Install dependencies:

```
npm install
```

2. Create a `.env` file in the root directory with the following content:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/freshly-basket
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
```

Replace the values with your actual configuration. For production, you should use a strong random string for JWT_SECRET.

### Development

Run in development mode:

```
npm run dev
```

### Production

Build the project:

```
npm run build
```

Start the production server:

```
npm start
```

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user

### User Profile

- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)

## License

MIT 