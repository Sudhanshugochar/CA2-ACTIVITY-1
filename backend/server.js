const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('./config/database');
const patientRoutes = require('./routes/patientRoutes');
const assistantRoutes = require('./routes/assistantRoutes');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB();

// CORS Configuration (Requirement 13: CORS Configuration)
// Permits requests from the deployed Netlify frontend domain and local development
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

if (process.env.FRONTEND_URL) {
  // Normalize by stripping trailing slash
  const cleanFrontendUrl = process.env.FRONTEND_URL.replace(/\/$/, '');
  allowedOrigins.push(cleanFrontendUrl);
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman, Render health checks)
    if (!origin) return callback(null, true);

    // Allow any netlify.app subdomain if deployed on Netlify
    const isNetlify = origin.endsWith('.netlify.app');
    const isAllowed = allowedOrigins.indexOf(origin) !== -1 || isNetlify;

    if (isAllowed || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: Access denied for origin ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route - Service Overview
app.get('/', (req, res) => {
  res.status(200).json({
    service: 'Hospital Patient Management System - Application Tier API',
    status: 'Running on Render',
    tier: 'Tier 2: Business Logic / Application Layer',
    databaseTier: 'Tier 3: MongoDB Atlas',
    databaseStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting / Disconnected',
    endpoints: {
      health: '/api/health',
      patients: '/api/patients',
      stats: '/api/patients/stats',
      patientById: '/api/patients/:id',
      assistant: '/api/assistant/chat',
    },
    documentation: 'See README.md for complete three-tier architecture details.',
  });
});

// Health check endpoint (for Render & Netlify frontend verification)
app.get('/api/health', (req, res) => {
  const dbStateMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };

  const dbState = mongoose.connection.readyState;

  res.status(dbState === 1 ? 200 : 503).json({
    status: dbState === 1 ? 'OK' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStateMap[dbState] || 'Unknown',
      readyState: dbState,
      name: mongoose.connection.name || 'hospitalDB',
    },
    environment: process.env.NODE_ENV || 'development',
  });
});

// Mount Patient REST API Routes
app.use('/api/patients', patientRoutes);
app.use('/api/assistant', assistantRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🏥 Hospital Management System - Backend API Server`);
  console.log(`🚀 Tier 2 (Render) listening on port: ${PORT}`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
