import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { formatCurrency } from '../../lib/utils';

export function MenuItemCard({ item, onAddToCart, disabled = false }) {
  const [quantity, setQuantity] = useState(1);
  const unavailable = disabled || !item.is_available;

  const handleAdd = () => {
    onAddToCart({ ...item, quantity });
    setQuantity(1);
  };

  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="relative h-36 overflow-hidden">
        <img
          src={item.image_url || '/images/placeholder-food.svg'}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        {item.category && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-gray-700 backdrop-blur-sm">
            {item.category}
          </span>
        )}
        {!item.is_available && (
          <div className="absolute inset-0 grid place-items-center bg-gray-900/55">
            <span className="text-sm font-semibold text-white">Indisponible</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-gray-900">{item.name}</h3>
        <p className="mb-3 mt-0.5 line-clamp-2 text-sm leading-relaxed text-gray-500">
          {item.description}
        </p>

        <div className="mt-auto">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-lg font-extrabold text-gray-900">{formatCurrency(item.price)}</span>

            <div className="inline-flex items-center rounded-xl border border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="grid h-9 w-9 place-items-center rounded-l-xl text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-40"
                disabled={unavailable || quantity <= 1}
                aria-label="Diminuer"
              >
                <Icon name="minus" size={16} />
              </button>
              <span className="w-7 text-center text-sm font-bold tabular-nums text-gray-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="grid h-9 w-9 place-items-center rounded-r-xl text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-40"
                disabled={unavailable}
                aria-label="Augmenter"
              >
                <Icon name="plus" size={16} />
              </button>
            </div>
          </div>

          <Button onClick={handleAdd} className="w-full" disabled={unavailable} size="sm">
            <Icon name="plus" size={16} strokeWidth={2.2} />
            Ajouter
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default MenuItemCard;
