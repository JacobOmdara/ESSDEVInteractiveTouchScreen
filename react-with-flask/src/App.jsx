import { Routes, Route, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react';
import Weather from './pages/Weather'
import Transit from './pages/Transit'
import Events from './pages/Events'
import Loading from './pages/Loading'
import PhotoGallery from './pages/Photos'
import Map from './pages/Map'
import Error from './pages/Error'
import NotFound from './pages/NotFound'
import './App.css'

function MainMenu() {
  const navigate = useNavigate();

  const apps = [
    { id: 'weather', icon: null, gif: '/weathericon.gif',  name: 'Weather', route: '/weather' },
    { id: 'transit', icon: null, gif: 'transicon.gif', name: 'Transit', route: '/transit' },
    { id: 'events', icon: null, gif: '/calendaricon.gif', name: 'Events', route: '/events' },
    { id: 'map', icon: null, gif: '/mapicon.gif', name: 'Campus Map', route: '/map' },
    { id: 'photo', icon: null, gif: '/photoicon.gif', name: 'Photo Album', route: '/photos' },
    { id: 'rooms', icon: '🚪', name: 'Room Booking', route: '/loading' },
    { id: 'news', icon: '📰', name: 'News', route: '/loading' },
    { id: 'alumni', icon: '🎓', name: 'Alumni', route: '/loading' },
  ];

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="main-menu"
      style={{
        minHeight: '100vh',
        padding: '40px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', background: 'rgba(103, 58, 147, 0.75)', 
        borderRadius: '20px',
        padding: '30px 40px', marginBottom: '50px', marginTop: '70px' }}>
        <h1 style={{
          fontSize: '60px',
          color: 'white',
          marginBottom: '10px',
          fontWeight: '700'
        }}>
          Welcome to Beamish Munro Hall
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '30px', margin: 0 }}>
          {'It is '}
          {time.toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          {' · '}
          {time.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </p>
      </div>

      {/* App Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '30px',
        maxWidth: '1500px',
        margin: '60px auto',
        flex: 1,
      }}>
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => navigate(app.route)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '20px',
              padding: '40px 20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(5px)',
              textAlign: 'center',
              color: 'white',
              height: '300px',
              width: '300px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <div style={{ fontSize: '80px', marginBottom: '15px' }}>
            {app.gif
              ? <img src={app.gif} alt={app.name} style={{ width: '140px', height: '140px', objectFit: 'contain' }} />
              : app.icon
            }
          </div>
            <div style={{ fontSize: '28px', fontWeight: '600' }}>
              {app.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainMenu />} />
      <Route path="/weather" element={<Weather />} />
      <Route path="/transit" element={<Transit />} />
      <Route path="/events" element={<Events />} />
      <Route path="/loading" element={<Loading />} />
      <Route path="/photos" element={<PhotoGallery />} />
      <Route path="/error" element={<Error />} />
      <Route path="/map" element={<Map />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;