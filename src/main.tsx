import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// We still need the core styles here
import '@mantine/core/styles.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);