import React from 'react';
import { useCart } from '../../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../lib/utils';

export function CartFloatingButton() {
  const { itemCount, total } = useCart();
  const navigate = useNavigate();

  if (itemCount === 0) return null;

  return (
    <button
      onClick={() => navigate('/cart')}
      className="fixed bottom-24 md:bottom-6 right-6 md:right-10 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:bg-orange-600 transition-all scale-animation z-30 flex items-center gap-2"
    >
      <div className="relative">
        <span className="text-2xl">🛒</span>
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount}
        </span>
      </div>
      <div className="hidden sm:flex flex-col items-start">
        <span className="text-sm font-semibold">{itemCount} article(s)</span>
        <span className="text-xs">{formatCurrency(total)}</span>
      </div>
    </button>
  );
}
