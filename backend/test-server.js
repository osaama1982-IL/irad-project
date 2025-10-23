require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!', time: new Date().toISOString() });
});

// Simple weather endpoint
app.get('/api/weather', async (req, res) => {
  try {
    const city = req.query.city || 'Berlin';
    const mockWeather = {
      city: city,
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
    res.json(mockWeather);
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Simple forecast endpoint
app.get('/api/weather/forecast', async (req, res) => {
  try {
    const city = req.query.city || 'Berlin';
    const mockForecast = {
      city: city,
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
        }
      ],
      fallback: true
    };
    res.json(mockForecast);
  } catch (error) {
    console.error('Forecast API error:', error);
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`Weather endpoint: http://localhost:${PORT}/api/weather?city=Berlin`);
  console.log(`Forecast endpoint: http://localhost:${PORT}/api/weather/forecast?city=Berlin`);
});