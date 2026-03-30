import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Helper function to turn Open-Meteo weather codes into simple emojis
const getWeatherEmoji = (code) => {
  if (code === 0) return '☀️'; // Clear
  if (code === 1 || code === 2 || code === 3) return '⛅'; // Partly cloudy
  if (code >= 45 && code <= 48) return '🌫️'; // Fog
  if (code >= 51 && code <= 67) return '🌧️'; // Rain
  if (code >= 71 && code <= 77) return '❄️'; // Snow
  if (code >= 80 && code <= 82) return '🌦️'; // Showers
  if (code >= 95) return '⛈️'; // Thunderstorm
  return '☁️'; // Default cloud
};

// Helper to format "2026-03-30" into "Mon, Mar 30"
const formatDate = (dateString) => {
  const date = new Date(dateString);
  // We add the timezone offset fix so it doesn't accidentally show the day before
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  const correctedDate = new Date(date.getTime() + userTimezoneOffset);
  return correctedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/weather')
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setWeatherData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div style={{ padding: '20px', textAlign: 'center', marginTop: '100px', color: 'black' }}>
      <h2>Loading Kingston 7-Day Forecast...</h2>
    </div>
  );

  if (error) return (
    <div style={{ padding: '20px', textAlign: 'center', color: 'red', marginTop: '100px' }}>
      <h2>Error loading weather: {error}</h2>
      <button onClick={() => navigate('/')} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '18px', cursor: 'pointer' }}>
        Back to Menu
      </button>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '40px' }}>7-Day Forecast for {weatherData.city}</h1>
      
      {/* 7-Day Forecast Grid */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        flexWrap: 'wrap', 
        justifyContent: 'center',
        maxWidth: '1200px'
      }}>
        {weatherData.forecast.map((day, index) => (
          <div key={index} style={{
            background: index === 0 ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.2)', // Highlight today slightly more
            border: '1px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '15px',
            padding: '20px',
            minWidth: '140px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '20px' }}>
              {index === 0 ? 'Today' : formatDate(day.date)}
            </h3>
            <div style={{ fontSize: '50px', margin: '15px 0' }}>
              {getWeatherEmoji(day.weather_code)}
            </div>
            <div style={{ fontSize: '22px', fontWeight: 'bold' }}>
              High: {day.max_temp}{weatherData.unit}
            </div>
            <div style={{ fontSize: '18px', opacity: 0.9 }}>
              Low: {day.min_temp}{weatherData.unit}
            </div>
          </div>
        ))}
      </div>
      
      <button 
        onClick={() => navigate('/')}
        style={{ 
          marginTop: '60px', 
          padding: '15px 40px', 
          fontSize: '24px', 
          fontWeight: 'bold',
          cursor: 'pointer',
          background: 'rgba(255, 255, 255, 0.25)',
          border: '2px solid white',
          borderRadius: '12px',
          color: 'white',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.4)'}
        onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.25)'}
      >
        Back to Menu
      </button>
    </div>
  );
}

export default Weather;