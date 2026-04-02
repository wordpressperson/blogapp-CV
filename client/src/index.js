import React from 'react';
import ReactDOM from 'react-dom';                    // ← changed back to react-dom
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>          {/* ← your auth wrapper */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
