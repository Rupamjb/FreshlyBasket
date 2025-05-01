// Vercel serverless function to proxy requests to Render backend
// This helps to bypass CORS issues

export default async function handler(req, res) {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

  // Handle OPTIONS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling preflight request for proxy');
    return res.status(200).end();
  }

  // Extract target path from URL
  const { url } = req;
  console.log(`Proxy request received: ${req.method} ${url}`);

  let targetPath = '';
  let renderUrl = 'https://freshlybasket.onrender.com';

  // Extract the path part
  if (url.startsWith('/api/proxy/')) {
    targetPath = url.substring('/api/proxy/'.length);
  } else if (url.startsWith('/proxy/')) {
    targetPath = url.substring('/proxy/'.length);
  }

  console.log(`Proxying to: ${renderUrl}/${targetPath}`);

  try {
    // Parse request body if present
    let requestBody = null;
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      requestBody = req.body;
    } else if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      // If req.body is not automatically parsed, we need to parse it ourselves
      const buffers = [];
      
      for await (const chunk of req) {
        buffers.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }
      
      const data = Buffer.concat(buffers).toString();
      
      if (data) {
        try {
          requestBody = JSON.parse(data);
        } catch (e) {
          console.error('Error parsing request body:', e);
        }
      }
    }

    // Prepare fetch options
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Add request body if needed
    if (requestBody) {
      fetchOptions.body = JSON.stringify(requestBody);
    }

    // Forward the authorization header if present
    const authHeader = req.headers.authorization;
    if (authHeader) {
      fetchOptions.headers.Authorization = authHeader;
    }

    // Make request to Render backend
    const response = await fetch(`${renderUrl}/${targetPath}`, fetchOptions);
    const contentType = response.headers.get('content-type');
    
    // Set response status
    res.status(response.status);
    
    // Forward content type if available
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    // Handle different response types
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return res.json(data);
    } else {
      const text = await response.text();
      return res.send(text);
    }
  } catch (error) {
    console.error('Proxy error:', error);
    
    // Return error as JSON
    res.status(500).json({
      success: false,
      message: 'Error proxying request to Render backend',
      error: error.message
    });
  }
} 