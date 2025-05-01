# Freshly - Premium Organic Groceries E-commerce

![Freshly Logo](public/favicon.svg)

Freshly is a premium e-commerce website for selling vegetables, groceries, and daily amenities. Built with a clean, modern design, it offers a smooth shopping experience with features like product browsing, cart management, and checkout.

## Features

- 🥕 Browse organic vegetables, fruits, and groceries
- 🔍 Search and filter products
- 🛒 Add products to cart
- 💳 Smooth checkout process
- 📱 Fully responsive design for all devices

## Tech Stack

- **Frontend**: Vite, React, TypeScript
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/freshly-ecommerce.git
cd freshly-ecommerce
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and visit http://localhost:5173

## Project Structure

```
freshly-ecommerce/
├── public/             # Static files
├── src/
│   ├── components/     # Reusable components
│   │   ├── layout/     # Layout components
│   │   └── products/   # Product-related components
│   ├── context/        # Context providers
│   ├── pages/          # Page components
│   ├── services/       # API and data services
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── index.html          # HTML template
├── tailwind.config.js  # Tailwind configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies and scripts
```

## Building for Production

To build the app for production, run:

```bash
npm run build
# or
yarn build
```

## License

This project is licensed under the MIT License.

## Acknowledgements

- Design inspiration from Blinkit and other modern e-commerce websites
- Icons from [Font Awesome](https://fontawesome.com/)
- Product images from [Unsplash](https://unsplash.com/)
