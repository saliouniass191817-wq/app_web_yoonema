import React, { useState } from 'react';
import { Icon } from '../ui/Icon';
import { FoodTile } from '../ui/FoodTile';
import { Stepper } from '../ui/Stepper';

export function MenuItemCard({ item, onAddToCart, disabled = false }) {
  const [q, setQ] = useState(1);
  const unavailable = disabled || !item.is_available;

  const handleAdd = () => {
    onAddToCart({ ...item, quantity: q });
    setQ(1);
  };

  return (
    <div className="card mcard">
      <FoodTile src={item.image_url} seed={item.name} cap={item.category} />
      <div className="mcard-body">
        {item.category && <span className="cat-pill">{item.category}</span>}
        <h3 className="mcard-name">{item.name}</h3>
        <p className="mcard-desc">{item.description}</p>
        <div className="mcard-foot">
          <span className="price">
            {Number(item.price).toLocaleString('fr-FR')}<small> FCFA</small>
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Stepper value={q} onChange={setQ} />
            <button className="add-btn" onClick={handleAdd} disabled={unavailable} style={unavailable ? { opacity: 0.45, cursor: 'default' } : undefined}>
              <Icon name="plus" size={15} />Ajouter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuItemCard;
