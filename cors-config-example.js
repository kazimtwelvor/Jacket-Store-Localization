// Sample CORS configuration for your external API server (d1.fineyst.com)
// This should be implemented on your external API server, not in this Next.js app

// If using Express.js:
const cors = require('cors');

const corsOptions = {
  origin: [
    'https://jackets-44j5.vercel.app',   // Your actual Vercel domain
    'https://jackets.vercel.app',         // Alternative Vercel domain
    'https://fineyst.com',                // Your production domain
    'http://localhost:3000',              // Local development
    'http://localhost:3001'               // Local development
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'User-Agent'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// If using a different framework, the concept is the same:
// Allow requests from your domain(s) and handle preflight OPTIONS requests

// Example for Node.js http module:
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://jackets-44j5.vercel.app',
    'https://jackets.vercel.app',
    'https://fineyst.com',
    'http://localhost:3000',
    'http://localhost:3001'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, User-Agent');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});
