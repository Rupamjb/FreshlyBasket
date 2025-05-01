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
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Extract the path from the URL
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname.replace(/^\/api\/auth/, '');
  
  console.log(`Auth API request: ${req.method} ${path}`);

  // Set content type for all responses
  res.setHeader('Content-Type', 'application/json');

  // Handle different auth endpoints
  try {
    // Login endpoint
    if (path === '/login' && req.method === 'POST') {
      return handleLogin(req, res);
    }
    
    // Register endpoint
    if (path === '/register' && req.method === 'POST') {
      return handleRegister(req, res);
    }
    
    // Profile endpoint
    if (path === '/profile' && req.method === 'GET') {
      return handleGetProfile(req, res);
    }
    
    // Default: endpoint not found
    return res.status(404).json({
      success: false,
      message: 'Auth endpoint not found'
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
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        resolve({});
      }
    });
  });
}

// Handle login
async function handleLogin(req, res) {
  const body = await parseJsonBody(req);
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
}

// Handle register
async function handleRegister(req, res) {
  const body = await parseJsonBody(req);
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
}

// Handle get profile
function handleGetProfile(req, res) {
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
} 