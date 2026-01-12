// // src/App.jsx

// // 1. Core Routing Imports
// import { Routes, Route, Link } from 'react-router-dom'; 

// // 2. Import ALL your page components
// import Idle from './pages/Idle'; // This now holds your tutorial's original content
// import Menu from './pages/Menu';
// import Weather from './pages/Weather';
// import Transit from './pages/Transit';
// import Events from './pages/Events';
// import Loading from './pages/Loading';
// import Error from './pages/Error';
// import NotFound from './pages/NotFound'; 

// // We don't need any state or useEffect here anymore! App.jsx only handles navigation.
// function App() {
//   return (
//     <>
//       {/* 3. Navigation Links: Click these to see your pages! */}
//       <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
//         <Link to="/">**HOME (Idle)**</Link> |{' '}
//         <Link to="/menu">Menu</Link> |{' '}
//         <Link to="/weather">Weather</Link> |{' '}
//         <Link to="/events">Events</Link> |{' '}
//         <Link to="/transit">Transit</Link>
//       </nav>

//       {/* 4. The Routes Definition */}
//       <div className="main-content">
//         <Routes>
//           {/* Default Route: Shows the original tutorial content */}
//           <Route path="/" element={<Idle />} /> 
          
//           {/* Required Deliverable Pages (make sure you created these files) */}
//           <Route path="/menu" element={<Menu />} />
//           <Route path="/weather" element={<Weather />} />
//           <Route path="/transit" element={<Transit />} />
//           <Route path="/events" element={<Events />} />
//           <Route path="/loading" element={<Loading />} />
//           <Route path="/error" element={<Error />} />

//           {/* 404 Catch-all */}
//           <Route path="*" element={<NotFound />} /> 
//         </Routes>
//       </div>
//     </>
//   );
// }

// export default App;

import { Routes, Route, useNavigate } from 'react-router-dom'
import Weather from './pages/Weather'
import Transit from './pages/Transit'
import Events from './pages/Events'
import Loading from './pages/Loading'
import Error from './pages/Error'
import NotFound from './pages/NotFound'
import './App.css'

function MainMenu() {
  const navigate = useNavigate();

  const apps = [
    { id: 'weather', icon: '🌤️', name: 'Weather', route: '/weather' },
    { id: 'transit', icon: '🚌', name: 'Transit', route: '/transit' },
    { id: 'events', icon: '📅', name: 'Events', route: '/events' },
    { id: 'map', icon: '🗺️', name: 'Campus Map', route: '/loading' },
    { id: 'photo', icon: '📸', name: 'Photo Booth', route: '/loading' },
    { id: 'rooms', icon: '🚪', name: 'Room Booking', route: '/loading' },
    { id: 'news', icon: '📰', name: 'News', route: '/loading' },
    { id: 'alumni', icon: '🎓', name: 'Alumni', route: '/loading' },
  ];

  const handleAppClick = (route) => {
    navigate(route);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ 
          fontSize: '48px', 
          color: 'white', 
          marginBottom: '-15px',
          fontWeight: '700'
        }}>
          BMH Interactive Display
        </h1>

      </div>

      {/* App Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '30px',
        maxWidth: '1400px',
        margin: '60px auto',
        flex: 1,
      }}>
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => handleAppClick(app.route)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '20px',
              padding: '40px 20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
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
              {app.icon}
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
      <Route path="/error" element={<Error />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;