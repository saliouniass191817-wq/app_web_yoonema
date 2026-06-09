import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { RestaurantCard } from '../../components/shared/RestaurantCard';
import { Chip } from '../../components/ui/Chip';
import { Icon } from '../../components/ui/Icon';
import { restaurantAPI } from '../../api';

export default function StudentHomePage() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState(null);
  const [deliveryTime, setDeliveryTime] = useState(null);
  const [openNow, setOpenNow] = useState(false);
  const [rating, setRating] = useState(null);

  useEffect(() => { loadRestaurants(); }, []);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const response = await restaurantAPI.getAll({ is_approved: true, is_open: true });
      setRestaurants(response.data || []);
    } catch (err) {
      console.error('Failed to load restaurants:', err);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Sénégalais', 'Rapide', 'Pizzas', 'Boissons'];
  const anyFilter = category || deliveryTime || openNow || rating;

  const filtered = restaurants.filter((r) => {
    const text = `${r.name || ''} ${r.description || ''}`.toLowerCase();
    return text.includes(searchQuery.toLowerCase())
      && (!category || text.includes(category.toLowerCase()))
      && (!deliveryTime || Number(r.delivery_time || 999) < deliveryTime)
      && (!openNow || r.is_open)
      && (!rating || Number(r.rating || 0) >= rating);
  });

  return (
    <AppLayout>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '18px 16px 28px' }}>
        {/* Search */}
        <div className="search">
          <Icon name="search" size={18} style={{ color: 'var(--ink-3)' }} />
          <input placeholder="Rechercher un resto ou un plat…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>

        {/* Filters */}
        <div className="scroll-x" style={{ display: 'flex', gap: 9, padding: '14px 0 6px' }}>
          <Chip on={!anyFilter} onClick={() => { setCategory(null); setDeliveryTime(null); setOpenNow(false); setRating(null); }}>Tous</Chip>
          {categories.map((c) => <Chip key={c} on={category === c} onClick={() => setCategory(category === c ? null : c)}>{c}</Chip>)}
          <Chip on={deliveryTime === 20} onClick={() => setDeliveryTime(deliveryTime === 20 ? null : 20)}>&lt; 20 min</Chip>
          <Chip on={rating === 4} onClick={() => setRating(rating === 4 ? null : 4)}>4+ ★</Chip>
          <Chip on={openNow} onClick={() => setOpenNow(!openNow)}>Ouvert</Chip>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 13, marginTop: 6 }}>
            {[...Array(6)].map((_, i) => <div key={i} className="card" style={{ height: 230 }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 16px', color: 'var(--ink-2)' }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, display: 'grid', placeItems: 'center', background: 'var(--terra-tint)', color: 'var(--terra)', margin: '0 auto 14px' }}>
              <Icon name="search" size={26} />
            </div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--ink)' }}>Aucun restaurant trouvé</p>
            <p style={{ fontSize: 14, marginTop: 4 }}>Essaie un autre mot-clé ou retire des filtres.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 13, marginTop: 6 }}>
            {filtered.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} onClick={() => navigate(`/restaurants/${r.id}`)} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
