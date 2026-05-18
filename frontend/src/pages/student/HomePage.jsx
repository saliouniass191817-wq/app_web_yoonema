import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { RestaurantCard } from '../../components/shared/RestaurantCard';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { Input } from '../../components/ui/Input';
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
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Bienvenue sur Yoonema 🍽️</h1>
          <p className="text-gray-600">Découvrez les meilleurs restaurants de votre université</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <Input
            placeholder="Rechercher un restaurant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => {
                setCategory(null);
                setDeliveryTime(null);
                setOpenNow(false);
                setRating(null);
              }}
              className="px-4 py-2 rounded-full bg-orange-500 text-white whitespace-nowrap"
            >
              Tous
            </button>
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(category === item ? null : item)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${category === item ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {item}
              </button>
            ))}
            {deliveryFilters.map((item) => (
              <button
                key={item}
                onClick={() => setDeliveryTime(deliveryTime === item ? null : item)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${deliveryTime === item ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                &lt; {item} min
              </button>
            ))}
            <button
              onClick={() => setOpenNow(!openNow)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${openNow ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Ouvert maintenant
            </button>
            {ratingFilters.map((item) => (
              <button
                key={item}
                onClick={() => setRating(rating === item ? null : item)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${rating === item ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {item}+ étoiles
              </button>
            ))}
          </div>
        </div>

        {/* Restaurants Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-2xl mb-2">😢 Aucun restaurant trouvé</p>
            <p className="text-gray-600">Essayez une autre recherche</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
