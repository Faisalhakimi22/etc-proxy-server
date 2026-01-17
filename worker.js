const ETC_PORTAL = 'https://etc.imsciences.edu.pk';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Cookie, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // Health check
    if (url.pathname === '/' || url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'ok',
        message: 'ETC Proxy Server Running on Cloudflare Workers',
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Proxy endpoint
    if (url.pathname.startsWith('/proxy')) {
      try {
        // Extract path after /proxy
        const path = url.pathname.replace('/proxy/', '').replace('/proxy', '');
        const targetUrl = path ? `${ETC_PORTAL}/${path}${url.search}` : ETC_PORTAL;
        
        console.log(`[${new Date().toISOString()}] ${request.method} ${targetUrl}`);

        // Prepare headers
        const headers = new Headers();
        headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        headers.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8');
        headers.set('Accept-Language', 'en-US,en;q=0.9');
        headers.set('Accept-Encoding', 'gzip, deflate, br');
        headers.set('Cache-Control', 'no-cache');
        headers.set('Pragma', 'no-cache');

        // Copy content-type for POST requests
        if (request.method === 'POST') {
          const contentType = request.headers.get('content-type');
          if (contentType) {
            headers.set('Content-Type', contentType);
          } else {
            headers.set('Content-Type', 'application/x-www-form-urlencoded');
          }
        }

        // Copy cookies from request
        const cookie = request.headers.get('cookie');
        if (cookie) {
          headers.set('Cookie', cookie);
        }

        // Prepare request options with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout

        const options = {
          method: request.method,
          headers: headers,
          redirect: 'manual',
          signal: controller.signal,
        };

        // Add body for POST requests
        if (request.method === 'POST') {
          options.body = await request.text();
        }

        // Make the request
        const response = await fetch(targetUrl, options);
        clearTimeout(timeoutId);

        console.log(`[${new Date().toISOString()}] Response: ${response.status}`);

        // Prepare response headers
        const responseHeaders = new Headers(corsHeaders);
        
        // Copy content-type
        const contentType = response.headers.get('content-type');
        if (contentType) {
          responseHeaders.set('Content-Type', contentType);
        }

        // Copy set-cookie headers (handle multiple)
        const setCookieHeaders = response.headers.getSetCookie?.() || [];
        if (setCookieHeaders.length > 0) {
          setCookieHeaders.forEach(cookie => {
            responseHeaders.append('Set-Cookie', cookie);
          });
        } else {
          const setCookie = response.headers.get('set-cookie');
          if (setCookie) {
            responseHeaders.set('Set-Cookie', setCookie);
          }
        }

        // Copy location for redirects
        if (response.status >= 300 && response.status < 400) {
          const location = response.headers.get('location');
          if (location) {
            responseHeaders.set('Location', location);
          }
        }

        // Return response
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders
        });

      } catch (error) {
        console.error(`[${new Date().toISOString()}] Error:`, error.message);
        
        // Check if it's a timeout
        if (error.name === 'AbortError') {
          return new Response(JSON.stringify({
            error: 'Timeout',
            message: 'ETC portal took too long to respond. Please try again.',
            timestamp: new Date().toISOString()
          }), {
            status: 504,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }
        
        return new Response(JSON.stringify({
          error: 'Proxy failed',
          message: error.message,
          details: 'Unable to connect to ETC portal. The portal may be down or blocking requests.',
          timestamp: new Date().toISOString()
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
    }

    // 404 for other paths
    return new Response('Not Found', {
      status: 404,
      headers: corsHeaders
    });
  }
};
