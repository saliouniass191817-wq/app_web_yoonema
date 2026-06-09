import React, { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { orderAPI } from '../../api';

export default function PaymentModal({ order, open, onClose, onPaid, onError }) {
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    if (!open || !order?.id || !polling) return undefined;

    const timer = window.setInterval(async () => {
      try {
        const response = await orderAPI.paymentStatus(order.id);
        if (response.data?.payment_status === 'paid') {
          window.clearInterval(timer);
          setPolling(false);
          onPaid?.(response.data);
        }
      } catch (err) {
        onError?.(err?.message || 'Impossible de vérifier le paiement.');
      }
    }, 3000);

    return () => window.clearInterval(timer);
  }, [open, order?.id, polling, onPaid, onError]);

  const handlePay = async () => {
    setLoading(true);
    try {
      const response = await orderAPI.initiatePayment(order.id, 'cinetpay');
      const url = response.data?.payment_url;
      if (url) {
        setPolling(true);
        window.location.href = url;
      }
    } catch (err) {
      onError?.(err?.message || 'Paiement indisponible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Paiement de la commande">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Paiement sécurisé via CinetPay (Wave, Orange Money et cartes selon votre opérateur).
        </p>
        {polling && <p className="text-sm text-gray-600">Vérification du paiement en cours...</p>}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Plus tard</Button>
          <Button loading={loading} onClick={handlePay}>Payer avec CinetPay</Button>
        </div>
      </div>
    </Modal>
  );
}
