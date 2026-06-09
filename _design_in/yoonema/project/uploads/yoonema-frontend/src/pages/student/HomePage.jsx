import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { RestaurantCard } from '../../components/shared/RestaurantCard';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { Input } from '../../components/ui/Input';
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

  useEffect(() => {
    loadRestaurants();
  }, []);

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

  const categories = ['Sénégalais', 'Rapide', 'Pizzas', 'Sandwichs', 'Boissons'];
  const deliveryFilters = [20, 30, 45];
  const ratingFilters = [4, 4.5];

  const chipBase =
    'shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-150';
  const chipOn = 'bg-orange-500 text-white shadow-brand-sm';
  const chipOff = 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-900';
  const anyFilter = category || deliveryTime || openNow || rating;

  const filteredRestaurants = restaurants.filter((r) => {
    const text = `${r.name || ''} ${r.description || ''}`.toLowerCase();
    const matchesSearch = text.includes(searchQuery.toLowerCase());
    const matchesCategory = !category || text.includes(category.toLowerCase());
    const matchesTime = !deliveryTime || Number(r.delivery_time || 999) < deliveryTime;
    const matchesOpen = !openNow || r.is_open;
    const matchesRating = !rating || Number(r.rating || 0) >= rating;

    return matchesSearch && matchesCategory && matchesTime && matchesOpen && matchesRating;
  });

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">
            Que mange-t-on aujourd’hui ?
          </h1>
          <p className="mt-1 text-gray-500">Les restaurants de ton campus, livrés en quelques minutes.</p>
        </div>

        {/* Search */}
        <div className="mb-5">
          <Input
            placeholder="Rechercher un restaurant ou un plat…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Icon name="search" size={18} />}
          />
        </div>

        {/* Filters */}
        <div className="scrollbar-none mb-7 flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => { setCategory(null); setDeliveryTime(null); setOpenNow(false); setRating(null); }}
            className={`${chipBase} ${!anyFilter ? chipOn : chipOff}`}
          >
            Tous
          </button>
          {categories.map((item) => (
            <button key={item} onClick={() => setCategory(category === item ? null : item)}
              className={`${chipBase} ${category === item ? chipOn : chipOff}`}>
              {item}
            </button>
          ))}
          {deliveryFilters.map((item) => (
            <button key={item} onClick={() => setDeliveryTime(deliveryTime === item ? null : item)}
              className={`${chipBase} ${deliveryTime === item ? chipOn : chipOff}`}>
              &lt; {item} min
            </button>
          ))}
          <button onClick={() => setOpenNow(!openNow)}
            className={`${chipBase} ${openNow ? chipOn : chipOff}`}>
            Ouvert
          </button>
          {ratingFilters.map((item) => (
            <button key={item} onClick={() => setRating(rating === item ? null : item)}
              className={`${chipBase} ${rating === item ? chipOn : chipOff}`}>
              {item}+ ★
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gray-100 text-gray-400">
              <Icon name="search" size={26} />
            </span>
            <p className="mt-4 font-semibold text-gray-900">Aucun restaurant trouvé</p>
            <p className="mt-1 text-sm text-gray-500">Essaie un autre mot-clé ou retire des filtres.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onClick={() => navigate(`/restaurants/${restaurant.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
