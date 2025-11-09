import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState('loading');
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${backendUrl}/api/health`)
      .then(res => res.json())
      .then(data => {
        setStatus(data.status);
      })
      .catch(err => {
        console.error('Error fetching health:', err);
        setStatus('error');
      });

    fetch(`${backendUrl}/api/data`)
      .then(res => res.json())
      .then(response => {
        setData(response.data);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
      });
  }, [backendUrl]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Interactive Touch Screen</h1>
        <p>Backend Status: <span className={status}>{status}</span></p>
      </header>
      <main className="App-main">
        <h2>Data from Backend:</h2>
        <ul>
          {data.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
