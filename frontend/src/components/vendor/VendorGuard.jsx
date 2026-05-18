import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useVendorRestaurant } from '../../context/VendorRestaurantContext';

export function VendorGuard({ children }) {
  const { loading, needsSetup } = useVendorRestaurant();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-gray-600">
        Chargement...
      </div>
    );
  }

  if (needsSetup && location.pathname !== '/vendor/setup') {
    return <Navigate to="/vendor/setup" replace state={{ from: location.pathname }} />;
  }

  return children;
}
