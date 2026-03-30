import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Weather = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Placeholder data - replace with OpenWeather API call later
  const [weatherData, setWeatherData] = useState({
    current: {
      temp: 22,
      feelsLike: 20,
      condition: 'Partly Cloudy',
      icon: '⛅',
      humidity: 65,
      windSpeed: 12,
    },
    forecast: [
      { day: 'Today', high: 25, low: 18, condition: 'Partly Cloudy', icon: '⛅', precip: 20 },
      { day: 'Tomorrow', high: 23, low: 16, condition: 'Rain', icon: '🌧️', precip: 80 },
      { day: 'Wednesday', high: 26, low: 19, condition: 'Sunny', icon: '☀️', precip: 10 },
      { day: 'Thursday', high: 24, low: 17, condition: 'Cloudy', icon: '☁️', precip: 30 },
      { day: 'Friday', high: 27, low: 20, condition: 'Sunny', icon: '☀️', precip: 5 },
    ]
  });

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // TODO: Replace with actual OpenWeather API call
  useEffect(() => {
    // fetch('http://localhost:5000/api/weather')
    //   .then(res => res.json())
    //   .then(data => setWeatherData(data))
    //   .catch(err => console.error('Weather API error:', err));
  }, []);

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
              Kingston, ON
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <div style={{ fontSize: '120px' }}>
              {weatherData.current.icon}
            </div>
            <div>
              <div style={{ fontSize: '96px', fontWeight: '900', lineHeight: 1 }}>
                {weatherData.current.temp}°C
              </div>
              <div style={{ fontSize: '28px', opacity: 0.9, marginTop: '10px' }}>
                {weatherData.current.condition}
              </div>
              <div style={{ fontSize: '20px', opacity: 0.8, marginTop: '5px' }}>
                Feels like {weatherData.current.feelsLike}°C
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '40px', fontSize: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '5px' }}>💧</div>
              <div style={{ fontWeight: '700' }}>{weatherData.current.humidity}%</div>
              <div style={{ opacity: 0.8 }}>Humidity</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '5px' }}>💨</div>
              <div style={{ fontWeight: '700' }}>{weatherData.current.windSpeed} km/h</div>
              <div style={{ opacity: 0.8 }}>Wind</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px' }}>
          5-Day Forecast
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '20px',
        }}>
          {weatherData.forecast.map((day, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255,255,255,0.2)',
                borderRadius: '15px',
                padding: '25px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
              }}
            >
              <div style={{ fontSize: '22px', fontWeight: '700', marginBottom: '15px' }}>
                {day.day}
              </div>
              <div style={{ fontSize: '64px', margin: '15px 0' }}>
                {day.icon}
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700' }}>
                {day.high}° / {day.low}°
              </div>
              <div style={{ fontSize: '16px', opacity: 0.9, marginTop: '10px' }}>
                {day.condition}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '10px' }}>
                💧 {day.precip}% chance
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Weather;