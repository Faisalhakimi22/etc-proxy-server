const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;
const ETC_PORTAL = 'https://etc.imsciences.edu.pk';

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Cookie', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'ETC Proxy Server Running',
    timestamp: new Date().toISOString() 
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Proxy endpoint
app.all('/proxy/*', async (req, res) => {
  const path = req.params[0] || '';
  const targetUrl = `${ETC_PORTAL}/${path}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;
  
  console.log(`[${new Date().toISOString()}] ${req.method} ${targetUrl}`);
  
  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Connection': 'keep-alive',
      'Referer': ETC_PORTAL,
      'Origin': ETC_PORTAL,
    };
    
    if (req.method === 'POST') {
      headers['Content-Type'] = req.headers['content-type'] || 'application/x-www-form-urlencoded';
    }
    
    if (req.headers['cookie']) {
      headers['Cookie'] = req.headers['cookie'];
    }
    
    let body;
    if (req.method === 'POST') {
      if (req.headers['content-type']?.includes('application/json')) {
        body = JSON.stringify(req.body);
      } else if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
        body = typeof req.body === 'string' ? req.body : new URLSearchParams(req.body).toString();
      } else {
        body = req.body;
      }
    }
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: body,
      signal: controller.signal,
      redirect: 'manual',
    });
    
    clearTimeout(timeout);
    
    console.log(`[${new Date().toISOString()}] Response: ${response.status}`);
    
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      res.setHeader('Set-Cookie', setCookie);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (location) {
        res.setHeader('Location', location);
      }
    }
    
    const data = await response.text();
    res.status(response.status).send(data);
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error:`, error.message);
    
    if (error.name === 'AbortError') {
      return res.status(504).json({
        error: 'Timeout',
        message: 'University portal took too long to respond'
      });
    }
    
    res.status(500).json({
      error: 'Proxy failed',
      message: error.message,
      code: error.code
    });
  }
});

app.all('/proxy', async (req, res) => {
  const targetUrl = ETC_PORTAL;
  console.log(`[${new Date().toISOString()}] ${req.method} ${targetUrl}`);
  
  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    };
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: headers,
      signal: controller.signal,
    });
    
    clearTimeout(timeout);
    
    const data = await response.text();
    res.setHeader('Content-Type', 'text/html');
    res.send(data);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log(`Proxying requests to: ${ETC_PORTAL}`);
});
