import { useState, useEffect } from 'react';
// 1. ADD THIS IMPORT: We need useNavigate to go back to the menu
import { useNavigate } from 'react-router-dom';

function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 2. ADD THIS HOOK: This allows us to change the route
  const navigate = useNavigate();

  useEffect(() => {
    // This fetches from your Flask backend (which gets it from Open-Meteo)
    fetch('/api/weather')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
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

  // What to show when the data successfully loads
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
}

export default Weather;