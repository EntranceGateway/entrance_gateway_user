
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// Ensure API token is set on app startup
import { setAccessToken } from './http/index';
const token = localStorage.getItem('accessToken');
if (token) setAccessToken(token);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
