import { useCartStore } from '../store';

export function useCart() {
  const {
    items,
    restaurantId,
    addItem,
    removeItem,
    updateQuantity,
    setRestaurant,
    clear,
    getTotal,
    getItemCount,
  } = useCartStore();

  const total = getTotal();
  const itemCount = getItemCount();

  const handleAddItem = (item) => {
    addItem(item);
  };

  const handleRemoveItem = (itemId) => {
    removeItem(itemId);
  };

  const handleUpdateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, quantity);
    }
  };

  const handleClear = () => {
    clear();
  };

  return {
    items,
    restaurantId,
    total,
    itemCount,
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    updateQuantity: handleUpdateQuantity,
    setRestaurant,
    clear: handleClear,
  };
}
