import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { StarRating } from '../../components/shared/StarRating';
import { useNotifications } from '../../hooks/useNotifications';
import { reviewAPI } from '../../api';

export default function RatingPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { success, error } = useNotifications();

  const [restaurantRating, setRestaurantRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (restaurantRating === 0) {
      error('Veuillez évaluer le restaurant');
      return;
    }

    setLoading(true);
    try {
      await reviewAPI.create({
        order_id: orderId,
        restaurant_rating: restaurantRating,
        delivery_rating: deliveryRating || null,
        comment: comment || null,
      });

      success('Avis envoyé avec succès!');
      navigate('/orders');
    } catch (err) {
      error(err.message || 'Erreur lors de l\'envoi de l\'avis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-8">Évaluer votre commande</h1>

        <div className="space-y-6">
          {/* Restaurant Rating */}
          <Card>
            <CardBody>
              <h2 className="font-semibold text-lg mb-4">Restaurant</h2>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-gray-600">Comment était votre repas?</span>
                <StarRating
                  rating={restaurantRating}
                  onRate={setRestaurantRating}
                  size="lg"
                />
              </div>
            </CardBody>
          </Card>

          {/* Delivery Rating */}
          <Card>
            <CardBody>
              <h2 className="font-semibold text-lg mb-4">Livraison</h2>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-gray-600">Comment était la livraison?</span>
                <StarRating
                  rating={deliveryRating}
                  onRate={setDeliveryRating}
                  size="lg"
                />
              </div>
            </CardBody>
          </Card>

          {/* Comment */}
          <Card>
            <CardBody>
              <h2 className="font-semibold text-lg mb-4">Commentaire (optionnel)</h2>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Partagez votre expérience..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows="4"
              />
            </CardBody>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              loading={loading}
              className="flex-1"
            >
              Envoyer l'avis
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/orders')}
              className="flex-1"
            >
              Ignorer
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
