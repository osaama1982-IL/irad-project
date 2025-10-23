import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const getWeatherImage = (condition) => {
  const images = {
    "sunny": "https://cdn-icons-png.flaticon.com/512/869/869869.png",
    "clear": "https://cdn-icons-png.flaticon.com/512/869/869869.png",
    "cloudy": "https://cdn-icons-png.flaticon.com/512/414/414825.png",
    "rainy": "https://cdn-icons-png.flaticon.com/512/1163/1163624.png",
    "stormy": "https://cdn-icons-png.flaticon.com/512/1779/1779940.png",
    "snowy": "https://cdn-icons-png.flaticon.com/512/642/642102.png",
    "foggy": "https://cdn-icons-png.flaticon.com/512/4005/4005901.png"
  };
  return images[condition?.toLowerCase()] || images.rainy;
};

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [city, setCity] = useState("Berlin");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch {
      navigate('/');
    }
  };

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError("");
    
    try {
      // Fetch current weather
      const weatherRes = await fetch(`/api/weather?city=${city}`);
      if (!weatherRes.ok) throw new Error("Could not fetch weather data");
      const weatherData = await weatherRes.json();
      setWeather(weatherData);

      // Fetch 7-day forecast
      const forecastRes = await fetch(`/api/weather/forecast?city=${city}`);
      if (!forecastRes.ok) throw new Error("Could not fetch forecast data");
      const forecastData = await forecastRes.json();
      setForecast(forecastData);

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [city]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  if (loading)
    return (
      <div style={{minHeight:'100vh',background:'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
        <div style={{textAlign:'center'}}>
          <div style={{width:48,height:48,border:'4px solid #bbb',borderTop:'4px solid #6366f1',borderRadius:'50%',animation:'spin 1s linear infinite',margin:'0 auto 16px'}}></div>
          <div style={{fontSize:'1.2rem',color:'#333'}}>Loading weather data...</div>
        </div>
        <style>{`@keyframes spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}`}</style>
      </div>
    );
    
  if (error)
    return (
      <div style={{minHeight:'100vh',background:'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
        <div style={{background:'white',padding:30,borderRadius:20,boxShadow:'0 8px 32px rgba(0,0,0,0.1)',textAlign:'center'}}>
          <div style={{fontSize:'1.2rem',color:'#b91c1c',fontWeight:'bold',marginBottom:20}}>
            {error}
          </div>
          <button 
            onClick={() => { setRefreshing(true); fetchWeather(); }} 
            style={{padding:'10px 20px',background:'#6366f1',color:'white',border:'none',borderRadius:8,cursor:'pointer'}}
          >
            Try Again
          </button>
        </div>
      </div>
    );

  if (!weather) return null;

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',padding:20}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        
        {/* User Info Header */}
        {user && (
          <div style={{marginBottom:20,padding:15,backgroundColor:'rgba(255,255,255,0.9)',borderRadius:10}}>
            <strong>Welcome, {user.firstname}!</strong>
            <div style={{fontSize:'0.9rem',color:'#666',marginTop:5}}>
              {user.email} • {user.city}
            </div>
          </div>
        )}

        {/* City Search */}
        <div style={{background:'white',padding:20,borderRadius:20,boxShadow:'0 8px 32px rgba(0,0,0,0.1)',marginBottom:20}}>
          <div style={{display:'flex',gap:10,alignItems:'center'}}>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name..."
              style={{flex:1,padding:'10px 15px',border:'2px solid #e0e7ff',borderRadius:10,fontSize:'1rem'}}
              onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
            />
            <button 
              onClick={fetchWeather}
              disabled={refreshing}
              style={{padding:'10px 20px',background:'#8ec5fc',color:'white',border:'none',borderRadius:10,cursor:'pointer'}}
            >
              {refreshing ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Current Weather */}
        {weather && (
          <div style={{background:'white',padding:30,borderRadius:20,boxShadow:'0 8px 32px rgba(0,0,0,0.1)',textAlign:'center',marginBottom:20}}>
            <img 
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
              alt={weather.condition} 
              style={{width:80,height:80,marginBottom:20}}
              onError={(e) => {e.target.src = getWeatherImage(weather.condition)}}
            />
            <h2 style={{fontSize:'2rem',color:'#5b21b6',marginBottom:10}}>Current Weather</h2>
            <div style={{fontSize:'1.4rem',color:'#444',marginBottom:10}}>
              {weather.city}{weather.country && `, ${weather.country}`}
            </div>
            
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:15,marginBottom:20}}>
              <div>
                <strong>Temperature:</strong> {weather.temperature}°C
              </div>
              <div>
                <strong>Condition:</strong> {weather.condition}
              </div>
              {weather.humidity && (
                <div>
                  <strong>Humidity:</strong> {weather.humidity}%
                </div>
              )}
              {weather.windSpeed && (
                <div>
                  <strong>Wind:</strong> {weather.windSpeed} m/s
                </div>
              )}
            </div>
            
            <div style={{fontSize:'0.9rem',color:'#666'}}>
              Last update: {new Date(weather.updatedAt).toLocaleString()}
              {weather.fallback && <span style={{color:'#dc3545'}}> (Offline data)</span>}
            </div>
          </div>
        )}

        {/* 7-Day Forecast */}
        {forecast && forecast.forecasts && (
          <div style={{background:'white',padding:30,borderRadius:20,boxShadow:'0 8px 32px rgba(0,0,0,0.1)',marginBottom:20}}>
            <h3 style={{fontSize:'1.5rem',color:'#5b21b6',marginBottom:20,textAlign:'center'}}>7-Day Forecast</h3>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))',gap:15}}>
              {forecast.forecasts.map((day, index) => (
                <div key={index} style={{textAlign:'center',padding:15,border:'1px solid #e0e7ff',borderRadius:10}}>
                  <div style={{fontWeight:'bold',marginBottom:10}}>{day.dayName}</div>
                  <div style={{fontSize:'0.9rem',color:'#666',marginBottom:10}}>
                    {new Date(day.date).toLocaleDateString()}
                  </div>
                  <img 
                    src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                    alt={day.condition}
                    style={{width:50,height:50,marginBottom:10}}
                    onError={(e) => {e.target.src = getWeatherImage(day.condition)}}
                  />
                  <div style={{fontSize:'1.1rem',fontWeight:'bold',marginBottom:5}}>
                    {day.maxTemp}° / {day.minTemp}°
                  </div>
                  <div style={{fontSize:'0.9rem',color:'#666'}}>{day.condition}</div>
                </div>
              ))}
            </div>
            {forecast.fallback && (
              <div style={{textAlign:'center',marginTop:15,fontSize:'0.9rem',color:'#dc3545'}}>
                Offline forecast data
              </div>
            )}
          </div>
        )}
        
        {/* Action Buttons */}
        <div style={{display:'flex',gap:10,flexWrap:'wrap',justifyContent:'center'}}>
          <button 
            onClick={() => { setRefreshing(true); fetchWeather(); }} 
            disabled={refreshing} 
            style={{padding:'10px 20px',background:'#8ec5fc',color:'white',border:'none',borderRadius:8,cursor:'pointer'}}
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          
          {user && (
            <>
              <button 
                onClick={() => navigate('/dashboard')} 
                style={{padding:'10px 20px',background:'#28a745',color:'white',border:'none',borderRadius:8,cursor:'pointer'}}
              >
                Dashboard
              </button>
              <button 
                onClick={handleLogout} 
                style={{padding:'10px 20px',background:'#dc3545',color:'white',border:'none',borderRadius:8,cursor:'pointer'}}
              >
                Logout
              </button>
            </>
          )}
          
          {!user && (
            <button 
              onClick={() => navigate('/login')} 
              style={{padding:'10px 20px',background:'#007bff',color:'white',border:'none',borderRadius:8,cursor:'pointer'}}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Weather;