import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { Button } from '../../components/ui/Button';

export default function OrderSuccessPage() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="max-w-md mx-auto p-4 md:p-6 text-center py-12">
        <div className="mb-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold mb-2">Commande confirmée!</h1>
          <p className="text-gray-600 mb-4">
            Votre commande a été passée avec succès.
          </p>
          <p className="text-gray-600">
            Vous recevrez des mises à jour en temps réel sur le statut de votre commande.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => navigate('/orders')}
            className="w-full"
          >
            Voir mes commandes
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/home')}
            className="w-full"
          >
            Continuer les achats
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
