import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Weather = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real weather data from Flask API
  useEffect(() => {
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

  // Loading state
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        <h2 style={{ fontSize: '36px' }}>Loading Kingston weather...</h2>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        <h2 style={{ fontSize: '36px', color: '#fca5a5' }}>Error loading weather: {error}</h2>
        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: '30px',
            background: 'rgba(255,255,255,0.2)',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '10px',
            padding: '15px 30px',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          ← Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
      padding: '30px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: 'white',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        background: 'rgba(0,0,0,0.2)',
        padding: '20px 30px',
        borderRadius: '15px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '10px',
              padding: '10px 20px',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            ← Back
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: '42px', fontWeight: '700' }}>
              🌤️ Weather
            </h1>
            <p style={{ margin: '5px 0 0 0', fontSize: '18px', opacity: 0.9 }}>
              {weatherData?.city || 'Kingston, ON'}
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '32px', fontWeight: '700' }}>
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div style={{ fontSize: '16px', opacity: 0.9 }}>
            {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Current Weather */}
      <div style={{
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(10px)',
        border: '2px solid rgba(255,255,255,0.2)',
        borderRadius: '20px',
        padding: '40px',
        marginBottom: '30px',
        maxWidth: '1400px',
        margin: '0 auto 30px auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '96px', fontWeight: '900', lineHeight: 1 }}>
              {weatherData?.temperature}{weatherData?.unit || '°C'}
            </div>
            <div style={{ fontSize: '28px', opacity: 0.9, marginTop: '10px' }}>
              Current Temperature
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;