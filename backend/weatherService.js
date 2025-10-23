const axios = require('axios');

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    this.defaultCity = process.env.DEFAULT_CITY || 'Berlin';
  }

  async getCurrentWeather(city = this.defaultCity) {
    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          q: city,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      return {
        city: response.data.name,
        country: response.data.sys.country,
        temperature: Math.round(response.data.main.temp),
        condition: response.data.weather[0].main,
        description: response.data.weather[0].description,
        humidity: response.data.main.humidity,
        windSpeed: response.data.wind.speed,
        pressure: response.data.main.pressure,
        icon: response.data.weather[0].icon,
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error fetching current weather:', error.message);
      return this.getFallbackWeather(city);
    }
  }

  async getWeeklyForecast(city = this.defaultCity) {
    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          q: city,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      // Group forecasts by day (API returns 5-day forecast with 3-hour intervals)
      const dailyForecasts = this.groupForecastsByDay(response.data.list);
      
      return {
        city: response.data.city.name,
        country: response.data.city.country,
        forecasts: dailyForecasts
      };
    } catch (error) {
      console.error('Error fetching weekly forecast:', error.message);
      return this.getFallbackForecast(city);
    }
  }

  groupForecastsByDay(forecastList) {
    const dailyData = {};
    
    forecastList.forEach(item => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0];
      
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          temperatures: [],
          conditions: [],
          descriptions: [],
          humidity: [],
          windSpeed: [],
          icons: []
        };
      }
      
      dailyData[date].temperatures.push(item.main.temp);
      dailyData[date].conditions.push(item.weather[0].main);
      dailyData[date].descriptions.push(item.weather[0].description);
      dailyData[date].humidity.push(item.main.humidity);
      dailyData[date].windSpeed.push(item.wind.speed);
      dailyData[date].icons.push(item.weather[0].icon);
    });

    // Convert to array and calculate daily averages
    return Object.values(dailyData).map(day => ({
      date: day.date,
      dayName: new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' }),
      minTemp: Math.round(Math.min(...day.temperatures)),
      maxTemp: Math.round(Math.max(...day.temperatures)),
      avgTemp: Math.round(day.temperatures.reduce((a, b) => a + b) / day.temperatures.length),
      condition: this.getMostFrequent(day.conditions),
      description: this.getMostFrequent(day.descriptions),
      humidity: Math.round(day.humidity.reduce((a, b) => a + b) / day.humidity.length),
      windSpeed: Math.round(day.windSpeed.reduce((a, b) => a + b) / day.windSpeed.length),
      icon: this.getMostFrequent(day.icons)
    })).slice(0, 7); // Return max 7 days
  }

  getMostFrequent(arr) {
    return arr.sort((a, b) =>
      arr.filter(v => v === a).length - arr.filter(v => v === b).length
    ).pop();
  }

  getFallbackWeather(city) {
    return {
      city: city || this.defaultCity,
      country: 'Unknown',
      temperature: 18,
      condition: 'Cloudy',
      description: 'partly cloudy',
      humidity: 65,
      windSpeed: 5,
      pressure: 1013,
      icon: '02d',
      updatedAt: new Date(),
      fallback: true
    };
  }

  getFallbackForecast(city) {
    const forecasts = [];
    const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Clear'];
    const icons = ['01d', '02d', '10d', '03d', '01d'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      forecasts.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
        minTemp: 15 + Math.floor(Math.random() * 5),
        maxTemp: 20 + Math.floor(Math.random() * 10),
        avgTemp: 18 + Math.floor(Math.random() * 8),
        condition: conditions[i % conditions.length],
        description: conditions[i % conditions.length].toLowerCase(),
        humidity: 60 + Math.floor(Math.random() * 20),
        windSpeed: 3 + Math.floor(Math.random() * 7),
        icon: icons[i % icons.length]
      });
    }
    
    return {
      city: city || this.defaultCity,
      country: 'Unknown',
      forecasts,
      fallback: true
    };
  }
}

module.exports = new WeatherService();