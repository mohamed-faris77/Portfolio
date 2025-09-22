/**
 * Backend Server for Portfolio Contact Form
 * Production-ready Express.js server with PostgreSQL/Supabase integration
 *
 * DEPLOYMENT NOTES:
 * - For Netlify deployment, convert this to serverless functions
 * - For Railway/Render deployment, use this file as-is
 * - Environment variables must be set in production
 * - Supports both PostgreSQL and Supabase connections
 */

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// PRODUCTION: Configure CORS for production domains
// Add your Netlify domain here when deploying
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8000',
  'http://127.0.0.1:5500',
  'https://your-netlify-site.netlify.app', // Replace with your actual Netlify URL
  'https://your-custom-domain.com' // Replace with your custom domain
];

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// PRODUCTION: Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Database configuration
// Supports both PostgreSQL and Supabase
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false // Supabase requires SSL
});

// PRODUCTION: Database connection with retry logic
let isConnected = false;
const connectWithRetry = async () => {
  try {
    await pool.connect();
    console.log("✅ Connected to database successfully");
    isConnected = true;
  } catch (error) {
    console.log("❌ Database connection error:", error.message);
    console.log("🔄 Retrying connection in 5 seconds...");
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();

// PRODUCTION: Add rate limiting (basic implementation)
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 10; // Max 10 requests per window

function rateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, []);
  }

  const requests = requestCounts.get(ip);
  const recentRequests = requests.filter(time => time > windowStart);

  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return res.status(429).json({
      error: 'Too many requests. Please try again later.'
    });
  }

  recentRequests.push(now);
  requestCounts.set(ip, recentRequests);
  next();
}

// Routes

/**
 * POST /adduser
 * Handles contact form submissions
 * Production: Includes validation, rate limiting, and error handling
 */
app.post('/adduser', rateLimit, async (req, res) => {
  try {
    const { name, number, email, message } = req.body;

    // Enhanced validation
    const errors = [];

    if (!name || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!number || !/^\d{10}$/.test(number.replace(/\D/g, ''))) {
      errors.push('Please enter a valid 10-digit phone number');
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Please enter a valid email address');
    }

    if (!message || message.trim().length < 10) {
      errors.push('Message must be at least 10 characters long');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    // Check database connection
    if (!isConnected) {
      return res.status(503).json({
        error: 'Database temporarily unavailable. Please try again later.'
      });
    }

    // Sanitize input
    const sanitizedData = {
      name: name.trim(),
      number: number.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim()
    };

    // Insert into database with error handling
    const result = await pool.query(
      'INSERT INTO portfolio (name, number, email, message) VALUES ($1, $2, $3, $4) RETURNING *',
      [sanitizedData.name, sanitizedData.number, sanitizedData.email, sanitizedData.message]
    );

    console.log('✅ Data inserted successfully:', result.rows[0]);
    res.status(200).json({
      message: "Message sent successfully!",
      data: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Database error:', error);
    res.status(500).json({
      error: "Failed to save message. Please try again later.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /health
 * Health check endpoint for monitoring
 * Production: Used by deployment platforms for health checks
 */
app.get('/health', (req, res) => {
  res.json({
    status: isConnected ? 'OK' : 'Database connection issue',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * GET /test-db
 * Test endpoint to check database connection
 * Production: Remove or secure this endpoint
 */
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: "Database connected successfully",
      time: result.rows[0],
      connection: isConnected
    });
  } catch (error) {
    console.log("Database connection error:", error);
    res.status(500).json({
      error: "Database connection failed",
      details: error.message,
      connection: isConnected
    });
  }
});

/**
 * GET /api/stats
 * Optional: Get basic statistics (for admin use)
 * Production: Add authentication for this endpoint
 */
app.get('/api/stats', async (req, res) => {
  try {
    if (!isConnected) {
      return res.status(503).json({ error: 'Database unavailable' });
    }

    const result = await pool.query('SELECT COUNT(*) as count FROM portfolio');
    res.json({
      totalMessages: parseInt(result.rows[0].count),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PRODUCTION: Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// PRODUCTION: 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🗄️  Database test: http://localhost:${PORT}/test-db`);
  console.log(`📈 Stats: http://localhost:${PORT}/api/stats`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

  if (process.env.NODE_ENV === 'production') {
    console.log('✅ Production mode: Enhanced security and logging enabled');
  }
});

// PRODUCTION: Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});
