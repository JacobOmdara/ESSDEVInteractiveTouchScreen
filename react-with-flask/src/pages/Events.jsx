import React from 'react';
import { useNavigate } from 'react-router-dom';

const Events = () => {
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
            position: 'relative',
            zIndex: 20, // above the overlay
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          ← Back
        </button>
      </div>

      {/* Calendar Embed + Overlay */}
      <div style={{ position: 'relative', flex: 1 }}>
        <iframe
          src="https://calendar.google.com/calendar/embed?src=a04efe18b853877aea72c11273f54f62d805d8748d45dc230893c89fbfd1af3c%40group.calendar.google.com&color=%237B1FA2&src=en.canadian%23holiday%40group.v.calendar.google.com&src=53f4cd14eddad162fb532e92266db04c4dc166547e3457c383b53953c2fac6dd%40group.calendar.google.com&color=%23AB8B00&src=6969c28f872c50b822c9ff8dcc715b0beff7f3e85d1668ddfdd2c03b6b65e2e2%40group.calendar.google.com&color=%23B1365F&ctz=America%2FToronto&mode=WEEK&showTabs=0&showCalendars=0&showTitle=0&showPrint=0"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '16px',
          }}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>

    </div>
  );
};

export default Events;