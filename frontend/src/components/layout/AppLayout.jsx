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
    <div className="flex h-screen" style={{ background: 'transparent' }}>
      {/* Desktop sidebar (espresso) */}
      <aside className="hidden md:block" style={{ width: 240, flex: 'none' }}>
        <Sidebar />
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto" style={{ paddingBottom: 96 }}>
          {children}
        </main>

        {/* Mobile bottom nav */}
        <div className="md:hidden" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50 }}>
          <BottomNav />
        </div>
      </div>

      <ToastContainer toasts={notifications} removeToast={removeNotification} />
      <CartFloatingButton />
    </div>
  );
}

export default AppLayout;
