import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { MenuItemCard } from '../../components/shared/MenuItemCard';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { FoodTile } from '../../components/ui/FoodTile';
import { useCart } from '../../hooks/useCart';
import { useNotifications } from '../../hooks/useNotifications';
import { restaurantAPI } from '../../api';

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, setRestaurant } = useCart();
  const { success } = useNotifications();

  const [restaurant, setRestaurantData] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [restaurantRes, menuRes] = await Promise.all([restaurantAPI.getById(id), restaurantAPI.getMenu(id)]);
      setRestaurantData(restaurantRes.data);
      setMenu(menuRes.data || []);
      setRestaurant(id);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    addItem(item);
    success(`${item.name} ajouté au panier`);
  };

  if (loading || !restaurant) {
    return (
      <AppLayout>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: 16 }}>
          <div className="card" style={{ height: 248 }} />
          <div className="card" style={{ height: 132, marginTop: 14 }} />
        </div>
      </AppLayout>
    );
  }

  const open = restaurant.is_open;

  return (
    <AppLayout>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        {/* Hero */}
        <div className="rd-header">
          <FoodTile src={restaurant.cover_url || restaurant.image_url} seed={restaurant.name} />
          <div className="rd-overlay" />
          <button className="rd-back" onClick={() => navigate('/home')}><Icon name="chevronLeft" size={20} /></button>
          <button className="rd-fav"><Icon name="heart" size={19} /></button>
          <div className="rd-title-wrap">
            <span className={`pill-status ${open ? 'pill-open' : 'pill-closed'}`} style={{ position: 'static', display: 'inline-flex', marginBottom: 10 }}>
              <span className="dot" />{open ? 'Ouvert' : 'Fermé'}
            </span>
            <h2 className="rd-title">{restaurant.name}</h2>
            <div className="rd-meta">
              <span className="mi"><Icon name="star" size={14} style={{ color: 'var(--gold)' }} />{Number(restaurant.rating || 4.5).toFixed(1)}</span>
              <span className="mi"><Icon name="clock" size={14} />{restaurant.delivery_time} min</span>
              <span className="mi"><Icon name="bike" size={14} />{Number(restaurant.delivery_fee || 0) === 0 ? 'Gratuit' : `${restaurant.delivery_fee} FCFA`}</span>
              {restaurant.address && <span className="mi"><Icon name="mapPin" size={14} />{restaurant.address}</span>}
            </div>
          </div>
        </div>

        {/* Menu */}
        <div style={{ padding: '20px 16px 8px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>Au menu</h3>
          <span style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 600 }}>{menu.length} plat{menu.length > 1 ? 's' : ''}</span>
        </div>

        {menu.length === 0 ? (
          <div style={{ margin: '4px 16px 24px', padding: '40px 16px', textAlign: 'center', color: 'var(--ink-3)', border: '2px dashed var(--hairline)', borderRadius: 18 }}>
            Aucun article disponible pour le moment.
          </div>
        ) : (
          <div style={{ padding: '4px 16px 28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 13 }}>
            {menu.map((item) => <MenuItemCard key={item.id} item={item} onAddToCart={handleAddToCart} />)}
          </div>
        )}

        <div style={{ padding: '0 16px 16px' }}>
          <Button variant="ghost" onClick={() => navigate('/home')}>
            <Icon name="chevronLeft" size={18} />Retour aux restaurants
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
