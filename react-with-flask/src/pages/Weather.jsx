import { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
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

const Weather = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 2. ADD THIS HOOK: This allows us to change the route
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

  // What to show while waiting for the Flask server
  if (loading) return (
    <div style={{ padding: '20px', textAlign: 'center', marginTop: '100px' }}>
      <h2>Loading Kingston weather...</h2>
    </div>
  );

  // What to show if something goes wrong
  if (error) return (
    <div style={{ padding: '20px', textAlign: 'center', color: 'red', marginTop: '100px' }}>
      <h2>Error loading weather: {error}</h2>
      {/* ADDED A BACK BUTTON HERE TOO JUST IN CASE */}
      <button 
        onClick={() => navigate('/')}
        style={{ marginTop: '20px', padding: '10px 20px', fontSize: '18px', cursor: 'pointer' }}
      >
        Back to Menu
      </button>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <h1>Today's Weather in {weatherData.city}</h1>
      <p style={{ fontSize: '72px', fontWeight: 'bold', margin: '20px 0' }}>
        {weatherData.temperature}{weatherData.unit}
      </p>
      
      {/* 3. ADD THIS BUTTON: The user clicks this to go back to the main menu */}
      <button 
        onClick={() => navigate('/')}
        style={{ 
          marginTop: '40px', 
          padding: '15px 30px', 
          fontSize: '24px', 
          cursor: 'pointer',
          background: 'rgba(255, 255, 255, 0.2)',
          border: '2px solid rgba(255, 255, 255, 0.5)',
          borderRadius: '10px',
          color: 'white',
          backdropFilter: 'blur(5px)'
        }}
      >
        Back to Menu
      </button>
    </div>
  );
};

export default Weather;