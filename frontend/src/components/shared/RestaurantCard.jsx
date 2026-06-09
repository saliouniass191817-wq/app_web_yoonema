import React from 'react';
import { Icon } from '../ui/Icon';
import { FoodTile } from '../ui/FoodTile';
import { fcfa } from '../../lib/utils';

export function RestaurantCard({ restaurant, onClick }) {
  const open = restaurant.is_open;
  const fee = Number(restaurant.delivery_fee || 0);

  return (
    <div className="card rcard" style={{ cursor: 'pointer' }} onClick={onClick}>
      <div style={{ position: 'relative' }}>
        <FoodTile src={restaurant.image_url} seed={restaurant.name} cap={restaurant.cuisine} />
        <span className={`pill-status ${open ? 'pill-open' : 'pill-closed'}`}>
          <span className="dot" />
          {open ? 'Ouvert' : 'Fermé'}
        </span>
        <span className="pill-rating">
          <Icon name="star" size={12} style={{ color: 'var(--gold)' }} />
          {Number(restaurant.rating || 4.5).toFixed(1)}
        </span>
      </div>
      <div className="rcard-body">
        <h3 className="rcard-name">{restaurant.name}</h3>
        <p className="rcard-desc">{restaurant.description}</p>
        <div className="rcard-meta">
          <span className="mi"><Icon name="clock" size={14} style={{ color: 'var(--ink-3)' }} />{restaurant.delivery_time} min</span>
          <span className="mi"><Icon name="bike" size={14} style={{ color: 'var(--ink-3)' }} />{fee === 0 ? 'Gratuit' : fcfa(fee)}</span>
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;
