import { useEffect } from 'react';
import AppRouter from './router';
import { useAuth } from './hooks/useAuth';

function App() {
  const { token } = useAuth();

  useEffect(() => {
    // Token is already available from localStorage when hydrated
    // No need to fetch user here - it will be fetched on demand
  }, [token]);

  return <AppRouter />;
}

export default App;
