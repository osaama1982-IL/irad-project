require('dotenv').config({ path: __dirname + '/.env' });

const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/auth");
const loginRouter = require('./routes/login');
const authSessionRoutes = require('./routes/auth-session');
const germanCities = require('./germanCities');

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

app.get("/api/weather", async (req, res) => {
  try {
    const city = req.query.city || 'Berlin';
    
    // Temporary fallback weather data while debugging
    const weatherData = {
      city: city,
      country: 'Unknown',
      temperature: 18,
      condition: 'Cloudy',
      description: 'partly cloudy',
      humidity: 65,
      windSpeed: 5,
      pressure: 1013,
      icon: '02d',
      updatedAt: new Date().toISOString(),
      fallback: true
    };
    
    console.log(`Weather request for ${city}:`, weatherData);
    res.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.get("/api/weather/forecast", async (req, res) => {
  try {
    const city = req.query.city || 'Berlin';
    
    // Temporary fallback forecast data
    const forecastData = {
      city: city,
      country: 'Unknown',
      forecasts: [
        {
          date: '2025-10-23',
          dayName: 'Thursday',
          minTemp: 18,
          maxTemp: 24,
          avgTemp: 21,
          condition: 'Sunny',
          description: 'sunny',
          humidity: 71,
          windSpeed: 7,
          icon: '01d'
        },
        {
          date: '2025-10-24',
          dayName: 'Friday',
          minTemp: 19,
          maxTemp: 23,
          avgTemp: 20,
          condition: 'Cloudy',
          description: 'cloudy',
          humidity: 66,
          windSpeed: 5,
          icon: '02d'
        },
        {
          date: '2025-10-25',
          dayName: 'Saturday',
          minTemp: 15,
          maxTemp: 25,
          avgTemp: 22,
          condition: 'Rainy',
          description: 'rainy',
          humidity: 64,
          windSpeed: 6,
          icon: '10d'
        },
        {
          date: '2025-10-26',
          dayName: 'Sunday',
          minTemp: 16,
          maxTemp: 28,
          avgTemp: 24,
          condition: 'Partly Cloudy',
          description: 'partly cloudy',
          humidity: 61,
          windSpeed: 5,
          icon: '03d'
        },
        {
          date: '2025-10-27',
          dayName: 'Monday',
          minTemp: 19,
          maxTemp: 26,
          avgTemp: 20,
          condition: 'Clear',
          description: 'clear',
          humidity: 60,
          windSpeed: 6,
          icon: '01d'
        },
        {
          date: '2025-10-28',
          dayName: 'Tuesday',
          minTemp: 17,
          maxTemp: 24,
          avgTemp: 23,
          condition: 'Sunny',
          description: 'sunny',
          humidity: 78,
          windSpeed: 4,
          icon: '01d'
        },
        {
          date: '2025-10-29',
          dayName: 'Wednesday',
          minTemp: 16,
          maxTemp: 24,
          avgTemp: 24,
          condition: 'Cloudy',
          description: 'cloudy',
          humidity: 77,
          windSpeed: 5,
          icon: '02d'
        }
      ],
      fallback: true
    };
    
    console.log(`Forecast request for ${city}:`, forecastData);
    res.json(forecastData);
  } catch (error) {
    console.error('Forecast API error:', error);
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
});

// German Cities Endpoints
app.get("/api/cities/german", (req, res) => {
  try {
    const allCities = germanCities.getAllGermanCities();
    res.json({
      cities: allCities,
      count: allCities.length,
      country: 'Germany'
    });
  } catch (error) {
    console.error('German cities API error:', error);
    res.status(500).json({ error: 'Failed to fetch German cities' });
  }
});

app.get("/api/cities/german/major", (req, res) => {
  try {
    const majorCities = germanCities.getMajorGermanCities();
    res.json({
      cities: majorCities,
      count: majorCities.length,
      country: 'Germany',
      type: 'major'
    });
  } catch (error) {
    console.error('Major German cities API error:', error);
    res.status(500).json({ error: 'Failed to fetch major German cities' });
  }
});

app.get("/api/cities/german/states", (req, res) => {
  try {
    const states = germanCities.getGermanStates();
    res.json({
      states: states,
      count: states.length,
      country: 'Germany'
    });
  } catch (error) {
    console.error('German states API error:', error);
    res.status(500).json({ error: 'Failed to fetch German states' });
  }
});

app.get("/api/cities/german/state/:state", (req, res) => {
  try {
    const state = req.params.state;
    const cities = germanCities.getCitiesByState(state);
    res.json({
      state: state,
      cities: cities,
      count: cities.length,
      country: 'Germany'
    });
  } catch (error) {
    console.error('Cities by state API error:', error);
    res.status(500).json({ error: 'Failed to fetch cities for state' });
  }
});

app.get("/api/cities/german/search", (req, res) => {
  try {
    const searchTerm = req.query.q || '';
    if (!searchTerm) {
      return res.status(400).json({ error: 'Search term is required' });
    }
    
    const matchingCities = germanCities.searchGermanCities(searchTerm);
    res.json({
      searchTerm: searchTerm,
      cities: matchingCities,
      count: matchingCities.length,
      country: 'Germany'
    });
  } catch (error) {
    console.error('German cities search API error:', error);
    res.status(500).json({ error: 'Failed to search German cities' });
  }
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