import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { MenuItemCard } from '../../components/shared/MenuItemCard';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { CardSkeleton } from '../../components/ui/Skeleton';
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

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [restaurantRes, menuRes] = await Promise.all([
        restaurantAPI.getById(id),
        restaurantAPI.getMenu(id),
      ]);
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

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <CardSkeleton />
        </div>
      </AppLayout>
    );
  }

  if (!restaurant) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto p-4 md:p-6 text-center">
          <p className="text-2xl">Restaurant non trouvé</p>
          <Button onClick={() => navigate('/home')} className="mt-4">
            Retour à l'accueil
          </Button>
        </div>
      </AppLayout>
    );
  }

  const open = restaurant.is_open;

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
        <button
          onClick={() => navigate('/home')}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
        >
          <Icon name="chevronRight" size={16} className="rotate-180" />
          Retour aux restaurants
        </button>

        {/* Hero */}
        <div className="relative mb-6 h-52 overflow-hidden rounded-3xl md:h-72">
          <img
            src={restaurant.cover_url || restaurant.image_url || '/images/placeholder-food.svg'}
            alt={restaurant.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <span
            className={`absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm ${
              open ? 'bg-white/90 text-success-700' : 'bg-gray-900/80 text-white'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${open ? 'bg-success-500' : 'bg-gray-400'}`} />
            {open ? 'Ouvert' : 'Fermé'}
          </span>

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                {restaurant.name}
              </h1>
              <p className="mt-1 line-clamp-2 max-w-2xl text-sm text-white/85">{restaurant.description}</p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-sm font-bold text-gray-900 shadow-soft">
              <Icon name="star" size={15} strokeWidth={0} className="fill-orange-500 text-orange-500" />
              {Number(restaurant.rating || 4.5).toFixed(1)}
            </span>
          </div>
        </div>

        {/* Info row */}
        <div className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="clock" size={16} className="text-gray-400" />
            {restaurant.delivery_time} min
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="bike" size={16} className="text-gray-400" />
            {restaurant.delivery_fee} FCFA de livraison
          </span>
          {restaurant.address && (
            <span className="inline-flex items-center gap-1.5">
              <Icon name="mapPin" size={16} className="text-gray-400" />
              {restaurant.address}
            </span>
          )}
        </div>

        {/* Menu */}
        <h2 className="mb-5 text-xl font-bold text-gray-900">Au menu</h2>
        {menu.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-14 text-center text-gray-500">
            Aucun article disponible pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {menu.map((item) => (
              <MenuItemCard key={item.id} item={item} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
