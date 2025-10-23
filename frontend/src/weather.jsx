import React, { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
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

  const fetchWeather = () => {
    setLoading(true);
    setError("");
    fetch("/api/weather")
      .then((res) => {
        if (!res.ok) throw new Error("Could not fetch weather data");
        return res.json();
      })
      .then((data) => {
        setWeather(data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((err) => {
        setError(err.message || "Something went wrong");
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  if (loading)
    return (
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#f0f0f0'}}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
          <div style={{width:48,height:48,border:'4px solid #bbb',borderTop:'4px solid #6366f1',borderRadius:'50%',animation:'spin 1s linear infinite',marginBottom:16}}></div>
          <div style={{fontSize:'1.2rem',color:'#333'}}>Loading weather status...</div>
        </div>
        <style>{`@keyframes spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}`}</style>
      </div>
    );
  if (error)
    return (
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#f0f0f0'}}>
        <div style={{fontSize:'1.2rem',color:'#b91c1c',fontWeight:'bold',background:'#fff',padding:24,borderRadius:8,boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
          {error}
          <button onClick={fetchWeather} style={{marginLeft:16,padding:'6px 16px',background:'#6366f1',color:'#fff',border:'none',borderRadius:6,cursor:'pointer'}}>Retry</button>
        </div>
      </div>
    );

  if (!weather) return null;

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{background:'white',padding:30,borderRadius:20,boxShadow:'0 8px 32px rgba(0,0,0,0.1)',maxWidth:400,width:'100%',textAlign:'center'}}>
        
        {user && (
          <div style={{marginBottom:20,padding:15,backgroundColor:'#f8f9fa',borderRadius:10}}>
            <strong>Welcome, {user.firstname}!</strong>
            <div style={{fontSize:'0.9rem',color:'#666',marginTop:5}}>
              {user.email} • {user.city}
            </div>
          </div>
        )}
        
        <img src={getWeatherImage(weather.condition)} alt={weather.condition} style={{width:80,height:80,marginBottom:20}} />
        <h2 style={{fontSize:'2rem',color:'#5b21b6',marginBottom:10}}>Weather Status</h2>
        <div style={{fontSize:'1.2rem',color:'#444',marginBottom:20}}>{weather.city}</div>
        
        <div style={{marginBottom:15}}>
          <div><strong>Temperature:</strong> {weather.temperature}°C</div>
          <div><strong>Condition:</strong> {weather.condition}</div>
        </div>
        
        <div style={{fontSize:'0.9rem',color:'#666',marginBottom:20}}>
          Last update: {new Date(weather.updatedAt).toLocaleString()}
        </div>
        
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