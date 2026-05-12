import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardBody } from '../../components/ui/Card';
import { useCart } from '../../hooks/useCart';
import { useCartStore } from '../../store';
import { useNotifications } from '../../hooks/useNotifications';
import { formatCurrency } from '../../lib/utils';
import { orderAPI } from '../../api';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, restaurantId, clear, removeItem, updateQuantity, total } = useCart();
  const { success, error } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState(null);

  // `total` is provided by the `useCart` hook
  const deliveryFee = 1000; // Example fee
  const finalTotal = total + deliveryFee;

  const handleSubmitOrder = async () => {
    if (!deliveryAddress.trim()) {
      error('Veuillez entrer une adresse de livraison');
      return;
    }

    setLoading(true);
    try {
      const response = await orderAPI.create({
        restaurant_id: restaurantId,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        delivery_address: deliveryAddress,
        delivery_person_id: selectedDeliveryPerson,
        total_amount: total,
        delivery_fee: deliveryFee,
      });

      if (response.success) {
        success('Commande passée avec succès!');
        clear();
        navigate(`/orders/${response.data.id}`);
      }
    } catch (err) {
      error(err.message || 'Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  // attempt to rehydrate quickly from localStorage if zustand persist hasn't finished
  useEffect(() => {
    if (items.length === 0) {
      try {
        const raw = localStorage.getItem('yoonema_cart');
        if (raw) {
          const parsed = JSON.parse(raw);
          const persisted = parsed && parsed.state ? parsed.state : parsed;
          if (persisted && Array.isArray(persisted.items) && persisted.items.length > 0) {
            useCartStore.setState({ items: persisted.items, restaurantId: persisted.restaurantId || null });
          }
        }
      } catch (e) {
        // ignore parse errors
      }
    }
  }, []);

  if (items.length === 0) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto p-4 md:p-6 text-center py-12">
          <p className="text-3xl mb-4">🛒</p>
          <p className="text-2xl font-semibold mb-4">Votre panier est vide</p>
          <Button onClick={() => navigate('/home')}>
            Continuer les achats
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-8">Panier</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Items */}
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardBody className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">{formatCurrency(item.price)} x {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <div className="md:col-span-1">
            <Card>
              <CardBody className="space-y-4">
                <h2 className="font-semibold text-lg">Résumé</h2>

                <div className="space-y-2 pb-4 border-b border-gray-200">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frais de livraison</span>
                    <span>{formatCurrency(deliveryFee)}</span>
                  </div>
                </div>

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-orange-500">{formatCurrency(finalTotal)}</span>
                </div>

                <Input
                  label="Adresse de livraison"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Rue, bâtiment, numéro..."
                />

                <Button
                  onClick={handleSubmitOrder}
                  loading={loading}
                  className="w-full"
                >
                  Passer la commande
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate('/home')}
                  className="w-full"
                >
                  Continuer les achats
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
