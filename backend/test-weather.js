// Quick test to check weather API
require('dotenv').config();
const weatherService = require('./weatherService');

console.log('Testing weather API...');
console.log('API Key configured:', process.env.OPENWEATHER_API_KEY ? 'Yes' : 'No');

async function testWeather() {
    try {
        console.log('\n--- Testing Current Weather ---');
        const weather = await weatherService.getCurrentWeather('London');
        console.log('Weather data:', weather);
        console.log('Is fallback data?', weather.fallback);
        
        console.log('\n--- Testing Forecast ---');
        const forecast = await weatherService.getWeeklyForecast('London');
        console.log('Forecast data:', forecast);
        console.log('Is fallback forecast?', forecast.fallback);
        
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

testWeather();