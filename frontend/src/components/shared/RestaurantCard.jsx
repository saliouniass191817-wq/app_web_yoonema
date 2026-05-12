import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatCurrency } from '../../lib/utils';

export function RestaurantCard({ restaurant, onClick }) {
  return (
    <Card
      onClick={onClick}
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-all"
    >
      <div className="relative">
        <img
          src={restaurant.image_url || 'https://via.placeholder.com/300x150'}
          alt={restaurant.name}
          className="w-full h-40 object-cover"
        />
        {!restaurant.is_open && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Fermé</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{restaurant.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {restaurant.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-yellow-500">★</span>
            <span className="font-semibold">{restaurant.rating || 4.5}</span>
          </div>
          <Badge variant="orange">
            {restaurant.delivery_time} min
          </Badge>
        </div>

        <p className="text-gray-600 text-sm">
          Frais: {formatCurrency(restaurant.delivery_fee)}
        </p>
      </div>
    </Card>
  );
}
