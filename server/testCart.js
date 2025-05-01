import fetch from 'node-fetch';

// Test adding an item to the cart
const testAddToCart = async () => {
  try {
    console.log('Testing add to cart API...');
    
    const response = await fetch('http://localhost:5000/api/cart/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: '65f0c2e55a9a6a5e5c30f8b1', // Replace with a valid product ID if needed
        quantity: 1
      }),
      credentials: 'include'
    });
    
    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('Error testing add to cart:', error);
  }
};

testAddToCart(); 