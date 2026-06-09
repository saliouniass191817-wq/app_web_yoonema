import { useEffect } from 'react';
import AppRouter from './router';
import { useAuth } from './hooks/useAuth';
import { useAuthStore } from './store/authStore';
import InstallPrompt from './components/pwa/InstallPrompt';

function App() {
  const { token } = useAuth();
  const { initialized, initialize } = useAuthStore();

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">Chargement…</div>
    );
  }

  return (
    <>
      <AppRouter />
      <InstallPrompt />
    </>
  );
}

export default App;
