import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useRealtime(table, filter = null, callback = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const channel = supabase
      .channel(`${table}:*`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter,
        },
        (payload) => {
          setData(payload.new);
          if (callback) callback(payload);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [table, filter, callback]);

  return { data, loading, error };
}

export function useRealtimeList(table, filter = null) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const channel = supabase
      .channel(`${table}:list`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table,
          filter,
        },
        (payload) => {
          setItems((prev) => [payload.new, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table,
          filter,
        },
        (payload) => {
          setItems((prev) =>
            prev.map((item) =>
              item.id === payload.new.id ? payload.new : item
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table,
          filter,
        },
        (payload) => {
          setItems((prev) =>
            prev.filter((item) => item.id !== payload.old.id)
          );
        }
      )
      .subscribe(() => setLoading(false));

    return () => {
      channel.unsubscribe();
    };
  }, [table, filter]);

  return { items, loading };
}
