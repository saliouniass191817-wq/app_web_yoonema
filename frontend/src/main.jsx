import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ErrorBoundary } from './components/ui/ErrorBoundary.jsx';
import './styles/index.css';
import './styles/teranga-base.css';
import './styles/teranga-dash.css';

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
