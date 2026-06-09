import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ErrorBoundary } from './components/ui/ErrorBoundary.jsx';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
