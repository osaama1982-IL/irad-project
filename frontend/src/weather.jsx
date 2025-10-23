import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
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
  const [germanCities, setGermanCities] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [searchInput, setSearchInput] = useState("Berlin");
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const searchTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  // Optimized filtered cities with useMemo for better performance
  const filteredCities = useMemo(() => {
    if (!searchInput || searchInput.length < 1) {
      // Show popular cities when no search input
      return ['Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt am Main', 'Stuttgart', 'Düsseldorf', 'Leipzig'];
    }
    
    const searchTerm = searchInput.toLowerCase().trim();
    return germanCities
      .filter(cityName => cityName.toLowerCase().includes(searchTerm))
      .slice(0, 8) // Limit to 8 results for better performance
      .sort((a, b) => {
        // Sort by relevance: exact match first, then starts with, then contains
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();
        const aExact = aLower === searchTerm;
        const bExact = bLower === searchTerm;
        const aStarts = aLower.startsWith(searchTerm);
        const bStarts = bLower.startsWith(searchTerm);
        
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.localeCompare(b);
      });
  }, [searchInput, germanCities]);

  // Fetch German cities on component mount with error handling
  useEffect(() => {
    const fetchGermanCities = async () => {
      try {
        const response = await fetch('/api/cities/german/major');
        if (response.ok) {
          const data = await response.json();
          setGermanCities(data.cities || []);
        } else {
          throw new Error('Failed to fetch cities');
        }
      } catch (error) {
        console.error('Failed to fetch German cities:', error);
        // Enhanced fallback with more cities
        const fallbackCities = [
          "Berlin", "Hamburg", "München", "Köln", "Frankfurt am Main", "Stuttgart", 
          "Düsseldorf", "Leipzig", "Dortmund", "Essen", "Bremen", "Dresden", 
          "Hannover", "Nürnberg", "Duisburg", "Bochum", "Wuppertal", "Bielefeld",
          "Bonn", "Münster", "Mannheim", "Karlsruhe", "Augsburg", "Wiesbaden"
        ];
        setGermanCities(fallbackCities);
      }
    };

    fetchGermanCities();
  }, []);

  // Debounced search input handler for better performance
  const handleSearchInputChange = useCallback((e) => {
    const value = e.target.value;
    setSearchInput(value);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Debounce the dropdown show/hide logic
    searchTimeoutRef.current = setTimeout(() => {
      setShowCityDropdown(value.length > 0 || document.activeElement === inputRef.current);
    }, 150); // 150ms debounce for smooth experience
  }, []);

  // Fast city fetching function
  const fetchWeatherForCity = useCallback(async (targetCity) => {
    setRefreshing(true);
    await fetchWeather(targetCity || city);
  }, [city, fetchWeather]);

  // Optimized city selection handler
  const handleCitySelect = useCallback((selectedCity) => {
    setCity(selectedCity);
    setSearchInput(selectedCity);
    setShowCityDropdown(false);
    
    // Clear search timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Auto-fetch weather for selected city
    fetchWeatherForCity(selectedCity);
  }, [fetchWeatherForCity]);

  // Handle input focus and blur for dropdown visibility
  const handleInputFocus = useCallback(() => {
    setShowCityDropdown(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    // Delay hiding dropdown to allow for clicks
    setTimeout(() => setShowCityDropdown(false), 200);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCities.length > 0) {
        handleCitySelect(filteredCities[0]);
      } else {
        fetchWeatherForCity(searchInput);
      }
    } else if (e.key === 'Escape') {
      setShowCityDropdown(false);
      inputRef.current?.blur();
    }
  }, [filteredCities, searchInput, handleCitySelect, fetchWeatherForCity]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch {
      navigate('/');
    }
  };

  const fetchWeather = useCallback(async (targetCity = city) => {
    setLoading(true);
    setError("");
    
    try {
      // Fetch current weather
      const weatherRes = await fetch(`/api/weather?city=${targetCity}`);
      if (!weatherRes.ok) throw new Error("Could not fetch weather data");
      const weatherData = await weatherRes.json();
      setWeather(weatherData);

      // Fetch 7-day forecast
      const forecastRes = await fetch(`/api/weather/forecast?city=${targetCity}`);
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
        <div style={{background:'white',padding:20,borderRadius:20,boxShadow:'0 8px 32px rgba(0,0,0,0.1)',marginBottom:20,position:'relative'}}>
          <h3 style={{fontSize:'1.2rem',color:'#5b21b6',marginBottom:15,textAlign:'center'}}>
            🇩🇪 Search German Cities
          </h3>
          
          <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:10}}>
            <input
              ref={inputRef}
              type="text"
              value={searchInput}
              onChange={handleSearchInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              placeholder="Start typing German city name..."
              autoComplete="off"
              style={{
                flex:1,
                padding:'12px 16px',
                border:'2px solid #e0e7ff',
                borderRadius:12,
                fontSize:'1rem',
                outline:'none',
                transition:'border-color 0.2s ease',
                ':focus': {borderColor:'#8ec5fc'}
              }}
            />
            <button 
              onClick={() => fetchWeatherForCity(searchInput)}
              disabled={refreshing}
              style={{
                padding:'12px 20px',
                background: refreshing ? '#94a3b8' : '#8ec5fc',
                color:'white',
                border:'none',
                borderRadius:12,
                cursor: refreshing ? 'not-allowed' : 'pointer',
                fontSize:'1rem',
                fontWeight:'500',
                transition:'all 0.2s ease',
                ':hover': {background: refreshing ? '#94a3b8' : '#7c3aed'}
              }}
            >
              {refreshing ? '⏳ Searching...' : '🔍 Search'}
            </button>
          </div>

          {/* Optimized German Cities Dropdown */}
          {showCityDropdown && filteredCities.length > 0 && (
            <div style={{
              position:'absolute',
              top:'100%',
              left:'20px',
              right:'20px',
              background:'white',
              border:'1px solid #e0e7ff',
              borderRadius:12,
              boxShadow:'0 8px 24px rgba(0,0,0,0.12)',
              maxHeight:'240px',
              overflowY:'auto',
              zIndex:1000,
              marginTop:'4px'
            }}>
              {filteredCities.map((cityName, index) => {
                const searchTerm = searchInput.toLowerCase();
                const cityLower = cityName.toLowerCase();
                const matchIndex = cityLower.indexOf(searchTerm);
                
                return (
                  <div
                    key={`${cityName}-${index}`}
                    onClick={() => handleCitySelect(cityName)}
                    style={{
                      padding:'14px 18px',
                      cursor:'pointer',
                      borderBottom: index < filteredCities.length - 1 ? '1px solid #f1f5f9' : 'none',
                      backgroundColor: 'transparent',
                      transition:'background-color 0.15s ease',
                      fontSize:'0.95rem',
                      fontWeight: matchIndex === 0 ? '500' : '400'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f8fafc';
                      e.target.style.color = '#1e293b';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#374151';
                    }}
                  >
                    {searchInput.length > 0 && matchIndex >= 0 ? (
                      <>
                        {cityName.substring(0, matchIndex)}
                        <span style={{backgroundColor:'#fef3c7', padding:'1px 2px', borderRadius:'2px', fontWeight:'600'}}>
                          {cityName.substring(matchIndex, matchIndex + searchInput.length)}
                        </span>
                        {cityName.substring(matchIndex + searchInput.length)}
                      </>
                    ) : (
                      cityName
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Optimized Popular German Cities Quick Select */}
          <div style={{marginTop:18}}>
            <div style={{fontSize:'0.9rem',color:'#64748b',marginBottom:10,fontWeight:'500'}}>
              🌟 Popular Cities:
            </div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              {['Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt am Main', 'Stuttgart', 'Düsseldorf', 'Leipzig'].map((cityName, index) => (
                <button
                  key={`popular-${cityName}-${index}`}
                  onClick={() => handleCitySelect(cityName)}
                  disabled={refreshing}
                  style={{
                    padding:'8px 14px',
                    background: city === cityName ? 'linear-gradient(135deg, #8ec5fc 0%, #7c3aed 100%)' : '#f8fafc',
                    color: city === cityName ? 'white' : '#475569',
                    border: city === cityName ? 'none' : '1px solid #e2e8f0',
                    borderRadius:24,
                    fontSize:'0.85rem',
                    fontWeight: city === cityName ? '600' : '500',
                    cursor: refreshing ? 'not-allowed' : 'pointer',
                    transition:'all 0.2s ease',
                    boxShadow: city === cityName ? '0 2px 8px rgba(124, 58, 237, 0.3)' : 'none',
                    opacity: refreshing ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!refreshing && city !== cityName) {
                      e.target.style.background = '#e2e8f0';
                      e.target.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!refreshing && city !== cityName) {
                      e.target.style.background = '#f8fafc';
                      e.target.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {cityName}
                </button>
              ))}
            </div>
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
            onClick={() => { setRefreshing(true); fetchWeatherForCity(); }} 
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