import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useVendorRealtime(restaurantId, onNewOrder) {
  useEffect(() => {
    if (!restaurantId) return undefined;

    const channel = supabase
      .channel(`vendor-orders-${restaurantId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders', filter: `restaurant_id=eq.${restaurantId}` },
        (payload) => {
          const audio = new Audio('/sounds/new-order.mp3');
          audio.play().catch(() => {});

          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Nouvelle commande', {
              body: 'Une nouvelle commande attend votre validation.',
              icon: '/favicon.ico',
            });
          }

          onNewOrder?.(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [restaurantId, onNewOrder]);
}
