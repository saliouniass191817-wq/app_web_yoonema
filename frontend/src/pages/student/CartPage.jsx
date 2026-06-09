import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Icon } from '../../components/ui/Icon';
import { Card, CardBody } from '../../components/ui/Card';
import { useCart } from '../../hooks/useCart';
import { useCartStore } from '../../store';
import { useNotifications } from '../../hooks/useNotifications';
import { formatCurrency } from '../../lib/utils';
import { orderAPI } from '../../api';
import PaymentModal from '../../components/payment/PaymentModal';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, restaurantId, clear, removeItem, updateQuantity, total } = useCart();
  const { success, error } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState(null);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const inFlightRef = useRef(false);

  // `total` is provided by the `useCart` hook
  const deliveryFee = items.reduce((sum, item) => sum + (Number(item.quantity) || 1) * 200, 0);
  const finalTotal = total + deliveryFee;

  const handleSubmitOrder = async () => {
    if (!deliveryAddress.trim()) {
      error('Veuillez entrer une adresse de livraison');
      return;
    }
    // prevent duplicate submissions (double-clicks or rapid repeats)
    if (inFlightRef.current) return;
    inFlightRef.current = true;
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
        success('Commande créée. Passez au paiement.');
        setCreatedOrder(response.data);
        setPaymentOpen(true);
      }
    } catch (err) {
      error(err.message || 'Erreur lors de la commande');
    } finally {
      setLoading(false);
      inFlightRef.current = false;
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
        <div className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-20 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-orange-50 text-orange-500">
            <Icon name="bag" size={30} />
          </span>
          <p className="mt-5 text-xl font-bold text-gray-900">Ton panier est vide</p>
          <p className="mt-1 text-gray-500">Ajoute des plats depuis un restaurant pour commander.</p>
          <Button onClick={() => navigate('/home')} className="mt-6">
            Découvrir les restaurants
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl p-4 md:p-6 lg:p-8">
        <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">Mon panier</h1>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Items */}
          <div className="space-y-3 md:col-span-2">
            {items.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-gray-900">{item.name}</h3>
                    <p className="mt-0.5 text-sm text-gray-500">{formatCurrency(item.price)} / unité</p>
                  </div>

                  <div className="inline-flex items-center rounded-xl border border-gray-200 bg-gray-50">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="grid h-8 w-8 place-items-center rounded-l-xl text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-40"
                      disabled={item.quantity <= 1}
                      aria-label="Diminuer"
                    >
                      <Icon name="minus" size={15} />
                    </button>
                    <span className="w-7 text-center text-sm font-bold tabular-nums">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="grid h-8 w-8 place-items-center rounded-r-xl text-gray-600 transition-colors hover:bg-gray-100"
                      aria-label="Augmenter"
                    >
                      <Icon name="plus" size={15} />
                    </button>
                  </div>

                  <p className="w-24 text-right font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-gray-400 transition-colors hover:bg-danger-50 hover:text-danger-600"
                    aria-label="Retirer"
                  >
                    <Icon name="x" size={16} />
                  </button>
                </div>
              </Card>
            ))}

            <button
              onClick={() => navigate('/home')}
              className="inline-flex items-center gap-1.5 px-1 text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              <Icon name="plus" size={16} />
              Ajouter d’autres plats
            </button>
          </div>

          {/* Summary */}
          <div className="md:col-span-1">
            <Card className="md:sticky md:top-24">
              <CardBody className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900">Résumé</h2>

                <div className="space-y-2 border-b border-gray-200/70 pb-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span className="font-medium text-gray-900">{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Frais de livraison</span>
                    <span className="font-medium text-gray-900">{formatCurrency(deliveryFee)}</span>
                  </div>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-extrabold text-orange-600">{formatCurrency(finalTotal)}</span>
                </div>

                <Input
                  label="Adresse de livraison"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Village H, chambre 12…"
                  icon={<Icon name="mapPin" size={18} />}
                />

                <Button onClick={handleSubmitOrder} loading={loading} size="lg" className="w-full">
                  Confirmer et payer
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
      <PaymentModal
        order={createdOrder}
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        onPaid={() => {
          success('Paiement confirmé.');
          clear();
          navigate(`/orders/${createdOrder.id}`);
        }}
        onError={(message) => error(message)}
      />
    </AppLayout>
  );
}
