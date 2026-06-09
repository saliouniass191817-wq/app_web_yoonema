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
      <aside className="hidden w-64 shrink-0 border-r border-gray-200/70 md:block">
        <Sidebar />
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar />

        <main className="flex-1 overflow-y-auto pb-24 md:pb-8">
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200/70 bg-white/90 backdrop-blur-md md:hidden">
          <BottomNav />
        </nav>
      </div>

      <ToastContainer toasts={notifications} removeToast={removeNotification} />
      <CartFloatingButton />
    </div>
  );
}

export default AppLayout;
