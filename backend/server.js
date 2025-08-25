const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();

console.log('🚀 Starting AI Blog Generator API...');

// Connect to database
connectDB();

// CORS middleware (must be before body parsers)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware with error handling
app.use(express.json({ 
  limit: '10mb',
  strict: true,  // Only parse arrays and objects
  type: 'application/json'
}));

app.use(express.urlencoded({ 
  extended: true,
  limit: '10mb'
}));

// Health check (simple, no body required)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Load routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);  
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  
  // Handle JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ 
      message: 'Invalid JSON format in request body',
      error: 'Bad Request'
    });
  }
  
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

console.log('✅ All routes loaded successfully');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});
