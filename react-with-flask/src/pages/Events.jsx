import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Events = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
      padding: '30px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
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
              📅 Events Calendar
            </h1>
            <p style={{ margin: '5px 0 0 0', fontSize: '18px', opacity: 0.9 }}>
              Queen's Engineering & Campus Events
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

      {/* Google Calendar Embed */}
      <div style={{
        flex: 1,
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(10px)',
        border: '2px solid rgba(255,255,255,0.2)',
        borderRadius: '20px',
        padding: '20px',
        overflow: 'hidden',
      }}>
        <iframe
          src="https://calendar.google.com/calendar/embed?src=a04efe18b853877aea72c11273f54f62d805d8748d45dc230893c89fbfd1af3c%40group.calendar.google.com&color=%237B1FA2&src=en.canadian%23holiday%40group.v.calendar.google.com&src=53f4cd14eddad162fb532e92266db04c4dc166547e3457c383b53953c2fac6dd%40group.calendar.google.com&color=%23AB8B00&src=6969c28f872c50b822c9ff8dcc715b0beff7f3e85d1668ddfdd2c03b6b65e2e2%40group.calendar.google.com&color=%23B1365F&ctz=America%2FToronto&mode=WEEK&showTabs=0&showCalendars=0&showTitle=0&showPrint=0"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '12px',
          }}
          sandbox="allow-scripts allow-same-origin"
          title="Queen's Events Calendar"
        />
      </div>
    </div>
  );
};

export default Events;