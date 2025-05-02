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

  // Special handling for signup path - completely bypass the normal flow
  if (url.includes('/users/register') && req.method === 'POST') {
    console.log('Special direct handling for registration');
    
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
      
      if (!requestBody || !requestBody.email || !requestBody.password) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields (email, password)'
        });
      }

      console.log('Making direct registration request to Render backend');
      
      // Make direct request to the correct API endpoint
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
      
      // Set response headers and status
      res.status(response.status);
      
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
      console.error('Error in direct registration handler:', error);
      return res.status(500).json({
        success: false,
        message: 'Error processing registration request',
        error: error.message
      });
    }
  }

  // Handle auth endpoints directly with specific paths
  if (url.includes('/users/register') || url.endsWith('users/register')) {
    targetPath = 'api/users/register';
    console.log(`Direct auth handling: Register endpoint detected`);
  } 
  else if (url.includes('/users/login') || url.endsWith('users/login')) {
    targetPath = 'api/users/login';
    console.log(`Direct auth handling: Login endpoint detected`);
  }
  else if (url.includes('/users/profile') || url.endsWith('users/profile')) {
    targetPath = 'api/users/profile';
    console.log(`Direct auth handling: Profile endpoint detected`);
  }
  else if (url.includes('/users/logout') || url.endsWith('users/logout')) {
    targetPath = 'api/users/logout';
    console.log(`Direct auth handling: Logout endpoint detected`);
  }
  // Regular path extraction for other endpoints
  else if (url.startsWith('/api/proxy/')) {
    targetPath = url.substring('/api/proxy/'.length);
  } else if (url.startsWith('/proxy/')) {
    targetPath = url.substring('/proxy/'.length);
  }

  // Clean up targetPath by removing any duplicated query parameters
  // The issue is that ?path=users%2Fregister is being appended to the actual path
  if (targetPath.includes('?')) {
    // Remove any ?path= query params that might have been incorrectly added 
    // by the URL rewriting in vercel.json or middleware
    if (targetPath.includes('?path=')) {
      targetPath = targetPath.split('?path=')[0];
    }
    
    // If there's a URL encoding of users/register or similar in the path
    // this is likely duplicative and should be removed
    const queryStartIndex = targetPath.indexOf('?');
    const queryString = targetPath.substring(queryStartIndex);
    
    if (queryString.includes('%2F')) { // URL-encoded slashes
      // This is likely a mistake; use just the path part
      targetPath = targetPath.substring(0, queryStartIndex);
    }
  }

  console.log(`Cleaned path for proxying: ${targetPath}`);
  console.log(`Final proxy URL: ${renderUrl}/${targetPath}`);

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
    
    console.log(`Actual fetch URL: ${renderUrl}/${targetPath}`);
    
    // Set response status
    res.status(response.status);
    
    // Forward content type if available
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    // Log response for debugging
    console.log(`Proxy response status: ${response.status}`);

    // Handle auth endpoints specially
    if (targetPath.startsWith('users/login') || 
        targetPath.startsWith('users/register') || 
        targetPath.startsWith('users/profile') || 
        targetPath.startsWith('users/logout')) {
      console.log('Handling auth endpoint specially');
      try {
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('Auth response shape:', Object.keys(data));
          return res.json(data);
        } else {
          const text = await response.text();
          console.log(`Non-JSON auth response: ${text.substring(0, 100)}...`);
          return res.send(text);
        }
      } catch (error) {
        console.error('Error handling auth response:', error);
        return res.status(500).json({
          success: false,
          message: 'Error processing auth response from Render backend',
          error: error.message
        });
      }
    }

    // Handle product data special case
    if (targetPath === '' || targetPath === '/' || targetPath.startsWith('?')) {
      // This is likely a products query
      console.log('Handling products request');
      try {
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          
          // Log data shape for debugging
          console.log('Products response data shape:', Object.keys(data));
          
          // Transform response if needed
          if (data.data && Array.isArray(data.data)) {
            // Transform to expected format for frontend
            const result = {
              products: data.data,
              total: data.total || data.data.length
            };
            return res.json(result);
          }
          
          // Otherwise just return the original data
          return res.json(data);
        } else {
          const text = await response.text();
          console.log(`Non-JSON response for products: ${text.substring(0, 100)}...`);
          return res.send(text);
        }
      } catch (error) {
        console.error('Error handling products response:', error);
        return res.status(500).json({
          success: false,
          message: 'Error processing products from Render backend',
          error: error.message
        });
      }
    }

    // Regular handling for other requests
    if (contentType && contentType.includes('application/json')) {
      try {
        const data = await response.json();
        return res.json(data);
      } catch (error) {
        console.error('Error parsing JSON response:', error);
        const text = await response.text();
        console.log(`Failed to parse JSON: ${text.substring(0, 100)}...`);
        return res.status(500).json({
          success: false,
          message: 'Invalid JSON response from Render backend',
          error: error.message
        });
      }
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