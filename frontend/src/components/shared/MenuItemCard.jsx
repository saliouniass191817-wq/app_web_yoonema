import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../lib/utils';

export function MenuItemCard({ item, onAddToCart, disabled = false }) {
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    onAddToCart({ ...item, quantity });
    setQuantity(1);
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img
          src={item.image_url || '/images/placeholder-food.jpg'}
          alt={item.name}
          className="w-full h-36 object-cover"
        />
        {!item.is_available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">Indisponible</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold mb-1">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-orange-500">
            {formatCurrency(item.price)}
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {item.category}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            disabled={disabled}
          >
            −
          </button>
          <span className="flex-1 text-center font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            disabled={disabled}
          >
            +
          </button>
        </div>

        <Button
          onClick={handleAdd}
          className="w-full mt-3"
          disabled={disabled || !item.is_available}
          size="sm"
        >
          Ajouter au panier
        </Button>
      </div>
    </Card>
  );
}
