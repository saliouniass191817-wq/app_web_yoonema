import { useEffect } from 'react';
import AppRouter from './router';
import { useAuth } from './hooks/useAuth';
import InstallPrompt from './components/pwa/InstallPrompt';

function App() {
  const { token } = useAuth();

  useEffect(() => {
    // Token is already available from localStorage when hydrated
    // No need to fetch user here - it will be fetched on demand
  }, [token]);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  return (
    <>
      <AppRouter />
      <InstallPrompt />
    </>
  );
}

export default App;
