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
      <div className="mx-auto max-w-2xl p-4 md:p-6 lg:p-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">Évaluer ta commande</h1>
        <p className="mt-1 mb-6 text-gray-500">Ton avis aide les autres étudiants.</p>

        <div className="space-y-5">
          <Card>
            <CardBody className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-gray-900">Le restaurant</h2>
                <p className="text-sm text-gray-500">Comment était ton repas ?</p>
              </div>
              <StarRating rating={restaurantRating} onRate={setRestaurantRating} size="lg" />
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-gray-900">La livraison</h2>
                <p className="text-sm text-gray-500">Comment s’est passée la livraison ?</p>
              </div>
              <StarRating rating={deliveryRating} onRate={setDeliveryRating} size="lg" />
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h2 className="mb-3 font-bold text-gray-900">Commentaire <span className="font-normal text-gray-400">(optionnel)</span></h2>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Partage ton expérience…"
                rows="4"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[15px] text-gray-900 placeholder:text-gray-400 transition-[border-color,box-shadow] focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/15"
              />
            </CardBody>
          </Card>

          <div className="flex gap-3">
            <Button onClick={handleSubmit} loading={loading} size="lg" className="flex-1">
              Envoyer l’avis
            </Button>
            <Button variant="outline" onClick={() => navigate('/orders')} size="lg" className="flex-1">
              Ignorer
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
