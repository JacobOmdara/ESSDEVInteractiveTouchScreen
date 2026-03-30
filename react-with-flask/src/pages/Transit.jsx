import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Transit = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Placeholder data - replace with GTFS API call later
  const [busRoutes, setBusRoutes] = useState([
    { route: '501', name: 'Express - Montreal St', destination: 'Downtown', arrival: 3, color: '#922A8E' },
    { route: '1', name: 'Montreal St', destination: 'St Lawrence College', arrival: 8, color: '#54B948' },
    { route: '2', name: 'Division St', destination: 'Train Station', arrival: 12, color: '#F99D31' },
    { route: '4', name: 'Downtown', destination: 'Cataraqui Centre', arrival: 15, color: '#ED1556' },
    { route: '601', name: 'Campus Connector', destination: 'Queen\'s University', arrival: 18, color: '#009DDC' },
    { route: '11', name: 'Cataraqui Centre', destination: 'Train Station', arrival: 22, color: '#008752' },
  ]);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // TODO: Replace with actual GTFS API call
  useEffect(() => {
    // fetch('http://localhost:5000/api/transit')
    //   .then(res => res.json())
    //   .then(data => setBusRoutes(data))
    //   .catch(err => console.error('Transit API error:', err));
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
              🚌 Kingston Transit
            </h1>
            <p style={{ margin: '5px 0 0 0', fontSize: '18px', opacity: 0.9 }}>
              Live bus arrivals near Queen's University
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

      {/* Bus Routes Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        {busRoutes.map((bus, idx) => (
          <div
            key={idx}
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.2)',
              borderRadius: '20px',
              padding: '30px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {/* Route Number Badge */}
              <div style={{
                background: bus.color,
                borderRadius: '12px',
                padding: '15px 20px',
                minWidth: '80px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '36px', fontWeight: '900' }}>
                  {bus.route}
                </div>
              </div>
              
              {/* Route Info */}
              <div>
                <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '5px' }}>
                  {bus.name}
                </div>
                <div style={{ fontSize: '18px', opacity: 0.9 }}>
                  → {bus.destination}
                </div>
              </div>
            </div>

            {/* Arrival Time */}
            <div style={{
              textAlign: 'right',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}>
              <div style={{
                fontSize: '48px',
                fontWeight: '900',
                color: bus.arrival <= 5 ? '#fbbf24' : '#4ade80',
                lineHeight: 1,
              }}>
                {bus.arrival}
              </div>
              <div style={{ fontSize: '20px', fontWeight: '600', opacity: 0.9 }}>
                minutes
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div style={{
        marginTop: '30px',
        textAlign: 'center',
        background: 'rgba(0,0,0,0.2)',
        padding: '20px',
        borderRadius: '15px',
        fontSize: '16px',
        opacity: 0.9,
      }}>
        <p style={{ margin: 0 }}>
          📍 Showing routes near Beamish-Munro Hall • Data updates every 30 seconds
        </p>
      </div>
    </div>
  );
};

export default Transit;