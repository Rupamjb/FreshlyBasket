// Vercel serverless function to handle auth API routes
import { fileURLToPath } from 'url';
import path from 'path';

// Sample users database (in a real app, this would be a database)
const users = [
  {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    // Password: password123
    password: '$2a$10$XQvmKH1CQsKlwvA55/iMaO0SrL7Dx3G5VE.N.EcZfYnC8HiYKRDMS',
    phone: '555-1234',
    addresses: [
      {
        id: '1',
        street: '123 Main St',
        city: 'Cityville',
        state: 'Stateland',
        zipCode: '12345',
        isDefault: true
      }
    ]
  }
];

export default function handler(req, res) {
  // Set CORS headers - very important for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request for auth');
    return res.status(200).end();
  }
  
  // Extract the path from the URL
  const url = new URL(req.url, `http://${req.headers.host}`);
  let path = url.pathname;
  
  // Clean up path to handle different formats
  if (path.startsWith('/api/auth')) {
    path = path.substring(9); // Remove "/api/auth"
  } else if (path.startsWith('/auth')) {
    path = path.substring(5); // Remove "/auth"
  }
  
  // Remove trailing slash if present
  if (path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  
  console.log(`Auth API request: ${req.method} ${path} (original URL: ${req.url})`);

  // Set content type for all responses
  res.setHeader('Content-Type', 'application/json');

  // Handle different auth endpoints
  try {
    // Login endpoint
    if ((path === '/login' || path === 'login') && req.method === 'POST') {
      console.log('Processing login request');
      return handleLogin(req, res);
    }
    
    // Register endpoint
    if ((path === '/register' || path === 'register') && req.method === 'POST') {
      console.log('Processing register request');
      return handleRegister(req, res);
    }
    
    // Profile endpoint
    if ((path === '/profile' || path === 'profile') && (req.method === 'GET' || req.method === 'OPTIONS')) {
      console.log('Processing profile request');
      return handleGetProfile(req, res);
    }
    
    // Default: endpoint not found
    console.log('Auth endpoint not found:', path);
    return res.status(404).json({
      success: false,
      message: 'Auth endpoint not found',
      path: path
    });
  } catch (error) {
    console.error('Auth API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Parse JSON body from request
async function parseJsonBody(req) {
  return new Promise((resolve) => {
    // Handle case when there's no body (e.g., GET requests)
    if (!req.body && (!req.headers['content-type'] || !req.headers['content-length'])) {
      console.log('No request body detected');
      return resolve({});
    }
    
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      if (!body || body.trim() === '') {
        console.log('Empty request body');
        return resolve({});
      }
      
      try {
        const parsed = JSON.parse(body);
        console.log('Parsed request body:', parsed);
        resolve(parsed);
      } catch (e) {
        console.error('Failed to parse request body:', e.message, body.substring(0, 100));
        resolve({});
      }
    });
    
    // Handle errors in reading the request body
    req.on('error', (err) => {
      console.error('Error reading request body:', err);
      resolve({});
    });
  });
}

// Handle login
async function handleLogin(req, res) {
  try {
    const body = await parseJsonBody(req);
    console.log('Login request body:', body);
    const { email, password } = body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user with matching email (in a real app, we would check password hash)
    const user = users.find(u => u.email === email);
    
    // Simple password check for demo (in real app, we would use bcrypt.compare)
    if (!user || password !== 'password123') {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate a dummy token
    const token = `demo-token-${Date.now()}`;

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        addresses: user.addresses,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
}

// Handle register
async function handleRegister(req, res) {
  try {
    const body = await parseJsonBody(req);
    console.log('Register request body:', body);
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required'
      });
    }

    // Check if user already exists
    if (users.some(u => u.email === email)) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user (in a real app, we would hash the password and store in DB)
    const newUser = {
      id: String(users.length + 1),
      name,
      email,
      password,
      addresses: []
    };

    // Add to our fake database
    users.push(newUser);

    // Generate a dummy token
    const token = `demo-token-${Date.now()}`;

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
}

// Handle get profile
function handleGetProfile(req, res) {
  try {
    // In a real app, we would extract user ID from token
    // For this demo, we'll just return the first user
    const user = users[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        addresses: user.addresses
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching profile'
    });
  }
} 