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
  const [filterOpen, setFilterOpen] = useState(null);

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

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              onClick={() => setFilterOpen(filterOpen === 'all' ? null : 'all')}
              className="px-4 py-2 rounded-full bg-orange-500 text-white whitespace-nowrap"
            >
              Tous
            </button>
            <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 whitespace-nowrap hover:bg-gray-300">
              Populaire
            </button>
            <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 whitespace-nowrap hover:bg-gray-300">
              Plus rapide
            </button>
            <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 whitespace-nowrap hover:bg-gray-300">
              Moins cher
            </button>
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
