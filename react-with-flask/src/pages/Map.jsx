import React from 'react';
import { useNavigate } from 'react-router-dom';
import mapImage from '../assets/map.png';

const Map = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#111',
      padding: '20px',
      boxSizing: 'border-box',
      gap: '16px',
    }}>

      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '2px solid rgba(255,255,255,0.3)',
            color: 'white',
            fontSize: '18px',
            padding: '10px 24px',
            borderRadius: '10px',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          ← Back
        </button>
      </div>

      {/* Map Image */}
      <div style={{ flex: 1, overflow: 'auto', borderRadius: '12px' }}>
        <img
          src={mapImage}
          alt="Map"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            borderRadius: '12px',
          }}
        />
      </div>

    </div>
  );
};

export default Map;