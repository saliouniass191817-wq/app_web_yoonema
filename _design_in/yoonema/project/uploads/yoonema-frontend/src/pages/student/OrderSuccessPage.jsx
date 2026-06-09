import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';

export default function OrderSuccessPage() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-success-50 text-success-600">
          <Icon name="check" size={40} strokeWidth={2.4} />
        </span>
        <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-gray-900">Commande confirmée</h1>
        <p className="mt-2 text-gray-500">
          Ta commande a bien été passée. Tu recevras les mises à jour de statut en temps réel.
        </p>

        <div className="mt-8 w-full space-y-3">
          <Button onClick={() => navigate('/orders')} size="lg" className="w-full">
            Voir mes commandes
          </Button>
          <Button variant="outline" onClick={() => navigate('/home')} size="lg" className="w-full">
            Continuer les achats
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
