import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Events = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Placeholder data - replace with Google Calendar API call later
  const [events, setEvents] = useState([
    {
      time: '2:00 PM',
      title: 'ESSDev Team Meeting',
      location: 'BMH 201',
      type: 'Meeting',
      color: '#8b5cf6',
    },
    {
      time: '4:30 PM',
      title: 'Engineering Networking Social',
      location: 'ILC Atrium',
      type: 'Social',
      color: '#ec4899',
    },
    {
      time: '6:00 PM',
      title: 'Robotics Workshop',
      location: 'BMH Lab',
      type: 'Workshop',
      color: '#f59e0b',
    },
    {
      time: '7:30 PM',
      title: 'Study Group - ELEC 279',
      location: 'BMH 306',
      type: 'Study',
      color: '#10b981',
    },
    {
      time: 'Feb 12',
      title: 'Engineering Design Showcase',
      location: 'JDUC',
      type: 'Event',
      color: '#3b82f6',
    },
    {
      time: 'Feb 15',
      title: 'Career Fair',
      location: 'ARC',
      type: 'Career',
      color: '#ef4444',
    },
  ]);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // TODO: Replace with actual Google Calendar API call
  useEffect(() => {
    // fetch('http://localhost:5000/api/events')
    //   .then(res => res.json())
    //   .then(data => setEvents(data))
    //   .catch(err => console.error('Events API error:', err));
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
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

      {/* Events List */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        {events.map((event, idx) => (
          <div
            key={idx}
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.2)',
              borderLeft: `6px solid ${event.color}`,
              borderRadius: '15px',
              padding: '30px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(10px)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'inline-block',
                background: event.color,
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '700',
                marginBottom: '12px',
              }}>
                {event.type}
              </div>
              <h3 style={{
                margin: '0 0 10px 0',
                fontSize: '32px',
                fontWeight: '700',
              }}>
                {event.title}
              </h3>
              <div style={{ fontSize: '20px', opacity: 0.9 }}>
                📍 {event.location}
              </div>
            </div>
            <div style={{
              textAlign: 'right',
              fontSize: '28px',
              fontWeight: '700',
              background: 'rgba(255,255,255,0.2)',
              padding: '20px 30px',
              borderRadius: '12px',
            }}>
              🕐 {event.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;