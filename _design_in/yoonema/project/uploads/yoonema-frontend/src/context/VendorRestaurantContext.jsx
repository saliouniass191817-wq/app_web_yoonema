import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { vendorAPI } from '../api';

const VendorRestaurantContext = createContext(null);

export function VendorRestaurantProvider({ children }) {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await vendorAPI.getRestaurant();
      setRestaurant(response.data ?? null);
    } catch (err) {
      setRestaurant(null);
      const message = err?.message || 'Impossible de charger le restaurant.';
      if (err?.success === false || message.toLowerCase().includes('restaurant')) {
        setError(null);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      restaurant,
      loading,
      error,
      needsSetup: !loading && !restaurant,
      refresh,
    }),
    [restaurant, loading, error, refresh]
  );

  return (
    <VendorRestaurantContext.Provider value={value}>
      {children}
    </VendorRestaurantContext.Provider>
  );
}

export function useVendorRestaurant() {
  const context = useContext(VendorRestaurantContext);
  if (!context) {
    throw new Error('useVendorRestaurant must be used within VendorRestaurantProvider');
  }
  return context;
}
