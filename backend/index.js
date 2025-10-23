const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/auth");
const loginRouter = require('./routes/login');
const authSessionRoutes = require('./routes/auth-session');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Basic security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/auth', loginRouter);
app.use('/api/auth', authSessionRoutes);

// Serve static files
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

app.get("/api/weather", (req, res) => {
  res.json({
    city: "Berlin",
    temperature: 18,
    condition: "Cloudy",
    updatedAt: new Date()
  });
});

app.get("/", (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(frontendPath, 'index.html'));
  } else {
    res.send("Weather API Server");
  }
});

// Handle SPA routing
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/')) {
    res.sendFile(path.join(frontendPath, 'index.html'));
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});