import React from 'react';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';
import { ToastContainer } from '../ui/Toast';
import { CartFloatingButton } from '../shared/CartFloatingButton';
import { useNotifications } from '../../hooks/useNotifications';

export function AppLayout({ children }) {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 border-r border-gray-200">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Bar */}
        <TopBar />

        {/* Content */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-6">
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <BottomNav />
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        toasts={notifications}
        removeToast={removeNotification}
      />
      <CartFloatingButton />
    </div>
  );
}
