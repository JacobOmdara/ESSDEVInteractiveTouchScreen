// src/pages/Idle.jsx

import { useState, useEffect } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../App.css' // Import the necessary CSS

const Idle = () => {
  const [count, setCount] = useState(0)
  const [currentTime, setCurrentTime] = useState(0);

  // Note: This fetch won't work unless you change it to axios.get('http://localhost:5000/api/time')
  // But we're leaving it here for now to preserve the tutorial's code structure.
  useEffect(() => {
    fetch('/api/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>The current time is {new Date(currentTime * 1000).toLocaleString()}.</p>
        <p>
          Edit <code>src/pages/Idle.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default Idle;