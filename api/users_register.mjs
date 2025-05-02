// Direct serverless function for user registration
// This helps to bypass the complex proxy routing logic

export default async function handler(req, res) {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

  // Handle OPTIONS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling preflight request for user registration');
    return res.status(200).end();
  }

  // Only allow POST requests for registration
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Only POST requests are accepted for registration.'
    });
  }

  console.log('User registration request received');

  try {
    // Extract the request body
    let requestBody = null;
    if (req.body) {
      requestBody = req.body;
    } else {
      // If req.body is not parsed, parse it manually
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }
      const data = Buffer.concat(buffers).toString();
      if (data) {
        try {
          requestBody = JSON.parse(data);
        } catch (e) {
          console.error('Error parsing register request body:', e);
          return res.status(400).json({
            success: false,
            message: 'Invalid request format',
            error: e.message
          });
        }
      }
    }
    
    // Validate request body
    if (!requestBody || !requestBody.email || !requestBody.password || !requestBody.name) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields (name, email, password)'
      });
    }

    console.log('Making direct registration request to Render backend');
    
    // Make direct request to the Render backend
    const renderUrl = 'https://freshlybasket.onrender.com';
    const response = await fetch(`${renderUrl}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'https://freshly-basket.vercel.app'
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log(`Registration response status: ${response.status}`);
    
    // Set response status
    res.status(response.status);
    
    // Forward content type if available
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    
    // Return the response data
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('Registration response data shape:', Object.keys(data));
      return res.json(data);
    } else {
      const text = await response.text();
      console.log(`Non-JSON registration response: ${text.substring(0, 100)}...`);
      return res.send(text);
    }
  } catch (error) {
    console.error('Error in user registration handler:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing registration request',
      error: error.message
    });
  }
} 