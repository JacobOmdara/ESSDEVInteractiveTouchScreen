// src/App.jsx

// 1. Core Routing Imports
import { Routes, Route, Link } from 'react-router-dom'; 

// 2. Import ALL your page components
import Idle from './pages/Idle'; // This now holds your tutorial's original content
import Menu from './pages/Menu';
import Weather from './pages/Weather';
import Transit from './pages/Transit';
import Events from './pages/Events';
import Loading from './pages/Loading';
import Error from './pages/Error';
import NotFound from './pages/NotFound'; 

// We don't need any state or useEffect here anymore! App.jsx only handles navigation.
function App() {
  return (
    <>
      {/* 3. Navigation Links: Click these to see your pages! */}
      <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <Link to="/">**HOME (Idle)**</Link> |{' '}
        <Link to="/menu">Menu</Link> |{' '}
        <Link to="/weather">Weather</Link> |{' '}
        <Link to="/events">Events</Link> |{' '}
        <Link to="/transit">Transit</Link>
      </nav>

      {/* 4. The Routes Definition */}
      <div className="main-content">
        <Routes>
          {/* Default Route: Shows the original tutorial content */}
          <Route path="/" element={<Idle />} /> 
          
          {/* Required Deliverable Pages (make sure you created these files) */}
          <Route path="/menu" element={<Menu />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/transit" element={<Transit />} />
          <Route path="/events" element={<Events />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/error" element={<Error />} />

          {/* 404 Catch-all */}
          <Route path="*" element={<NotFound />} /> 
        </Routes>
      </div>
    </>
  );
}

export default App;