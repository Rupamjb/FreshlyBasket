import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

// Redirection handler component for SPA routes
const RedirectionHandler = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if there's a redirect path in sessionStorage
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      // Clear the redirect path from storage
      sessionStorage.removeItem('redirectPath');
      // Navigate to the stored path
      navigate(redirectPath);
    }
  }, [navigate]);
  
  return null;
};

// Wrap App with BrowserRouter and add RedirectionHandler
const AppWithRouter = () => {
  return (
    <BrowserRouter>
      <RedirectionHandler />
      <App />
    </BrowserRouter>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithRouter />
  </StrictMode>,
)
