import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppLayout } from '../layout/AppLayout';
import { VendorRestaurantProvider } from '../../context/VendorRestaurantContext';
import { VendorGuard } from './VendorGuard';

export function VendorShell() {
  return (
    <VendorRestaurantProvider>
      <Outlet />
    </VendorRestaurantProvider>
  );
}

export function VendorAppLayout() {
  return (
    <VendorGuard>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </VendorGuard>
  );
}
