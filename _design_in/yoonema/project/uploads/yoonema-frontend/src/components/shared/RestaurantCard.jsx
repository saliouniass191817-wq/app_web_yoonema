import React from 'react';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { formatCurrency } from '../../lib/utils';

export function RestaurantCard({ restaurant, onClick }) {
  const open = restaurant.is_open;

  return (
    <Card
      interactive
      onClick={onClick}
      className="group cursor-pointer overflow-hidden"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={restaurant.image_url || '/images/placeholder-food.svg'}
          alt={restaurant.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-sm ${
            open ? 'bg-white/90 text-success-700' : 'bg-gray-900/80 text-white'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${open ? 'bg-success-500' : 'bg-gray-400'}`} />
          {open ? 'Ouvert' : 'Fermé'}
        </span>

        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-gray-900 shadow-soft backdrop-blur-sm">
          <Icon name="star" size={13} strokeWidth={0} className="fill-orange-500 text-orange-500" />
          {Number(restaurant.rating || 4.5).toFixed(1)}
        </span>
      </div>

      <div className="p-4">
        <h3 className="mb-1 truncate text-base font-bold text-gray-900">{restaurant.name}</h3>
        <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-gray-500">
          {restaurant.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="clock" size={15} className="text-gray-400" />
            {restaurant.delivery_time} min
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="bike" size={15} className="text-gray-400" />
            {formatCurrency(restaurant.delivery_fee)}
          </span>
        </div>
      </div>
    </Card>
  );
}

export default RestaurantCard;
