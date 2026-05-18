import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { MenuItemCard } from '../../components/shared/MenuItemCard';
import { Button } from '../../components/ui/Button';
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

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Restaurant Header */}
        <div className="mb-8">
          <img
            src={restaurant.cover_url || '/images/placeholder-food.jpg'}
            alt={restaurant.name}
            className="w-full h-48 md:h-64 object-cover rounded-2xl mb-6"
          />

          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
              <p className="text-gray-600 max-w-2xl">{restaurant.description}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl">★ {restaurant.rating || 4.5}</p>
              <p className="text-gray-600 text-sm">Note</p>
            </div>
          </div>

          <div className="flex gap-4 text-sm text-gray-600">
            <span>⏱️ {restaurant.delivery_time} min</span>
            <span>🚚 {restaurant.delivery_fee} FCFA</span>
            <span>📍 {restaurant.address}</span>
          </div>
        </div>

        {/* Menu */}
        <h2 className="text-2xl font-bold mb-6">Menu</h2>
        {menu.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <p>Aucun article disponible</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menu.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8">
          <Button
            variant="outline"
            onClick={() => navigate('/home')}
          >
            ← Retour
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
