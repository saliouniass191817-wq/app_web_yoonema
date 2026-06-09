import { create } from 'zustand';

const normalizeItem = (item, quantity = 1) => ({
  ...item,
  price: Number(item.price) || 0,
  quantity,
});

const selectSubtotal = (items) =>
  items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);

const selectItemCount = (items) =>
  items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

const useCartStore = create((set, get) => ({
  items: [],
  restaurantId: null,
  restaurantName: null,

  addItem: (item, restaurantId = item.restaurant_id ?? get().restaurantId, restaurantName = get().restaurantName) => {
    if (!restaurantId) {
      throw new Error('Restaurant introuvable pour cet article.');
    }

    const current = get();
    const existingItems = current.restaurantId && current.restaurantId !== restaurantId ? [] : current.items;
    const existing = existingItems.find((entry) => entry.id === item.id);

    const items = existing
      ? existingItems.map((entry) =>
          entry.id === item.id
            ? { ...entry, quantity: (Number(entry.quantity) || 0) + 1 }
            : entry
        )
      : [...existingItems, normalizeItem(item)];

    set({ items, restaurantId, restaurantName: restaurantName ?? item.restaurant_name ?? null });
  },

  removeItem: (itemId) => {
    const items = get()
      .items.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(0, (Number(item.quantity) || 0) - 1) } : item
      )
      .filter((item) => item.quantity > 0);

    set({
      items,
      restaurantId: items.length > 0 ? get().restaurantId : null,
      restaurantName: items.length > 0 ? get().restaurantName : null,
    });
  },

  updateQuantity: (itemId, quantity) => {
    const nextQuantity = Math.max(0, Number(quantity) || 0);
    const items = get()
      .items.map((item) => (item.id === itemId ? { ...item, quantity: nextQuantity } : item))
      .filter((item) => item.quantity > 0);

    set({
      items,
      restaurantId: items.length > 0 ? get().restaurantId : null,
      restaurantName: items.length > 0 ? get().restaurantName : null,
    });
  },

  setRestaurant: (restaurantId, restaurantName = null) => {
    const current = get();
    if (current.restaurantId && current.restaurantId !== restaurantId && current.items.length > 0) {
      set({ items: [], restaurantId, restaurantName });
      return;
    }

    set({ restaurantId, restaurantName: restaurantName ?? current.restaurantName });
  },

  clearCart: () => set({ items: [], restaurantId: null, restaurantName: null }),
  clear: () => get().clearCart(),
  getItemCount: () => selectItemCount(get().items),
  getTotal: () => selectSubtotal(get().items),
  get itemCount() {
    return selectItemCount(get().items);
  },
  get subtotal() {
    return selectSubtotal(get().items);
  },
  get isEmpty() {
    return get().items.length === 0;
  },
}));

export { useCartStore };
export default useCartStore;
