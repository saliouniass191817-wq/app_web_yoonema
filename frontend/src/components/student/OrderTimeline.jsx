import React from 'react';

const steps = [
  { key: 'pending', label: 'En attente' },
  { key: 'confirmed', label: 'Acceptée' },
  { key: 'delivering', label: 'En livraison' },
  { key: 'delivered', label: 'Livrée' },
];

export default function OrderTimeline({ status, deliveryTime, deliveryPerson }) {
  const activeIndex = Math.max(0, steps.findIndex((step) => step.key === status));
  const terminal = ['refused', 'cancelled', 'expired'].includes(status);

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        {steps.map((step, index) => {
          const active = !terminal && index <= activeIndex;

          return (
            <div key={step.key} className="flex flex-1 items-center">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${active ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`mx-2 h-1 flex-1 rounded-full ${index < activeIndex && !terminal ? 'bg-orange-500' : 'bg-gray-100'}`} />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2 text-xs text-gray-600">
        {steps.map((step) => <span key={step.key}>{step.label}</span>)}
      </div>
      {deliveryTime && !terminal && status !== 'delivered' && (
        <p className="mt-4 text-sm text-gray-700">Livraison estimée: {deliveryTime} minutes</p>
      )}
      {deliveryPerson && ['delivering', 'delivered'].includes(status) && (
        <p className="mt-2 text-sm text-gray-700">
          Livreur: {deliveryPerson.name}{deliveryPerson.phone ? ` · ${deliveryPerson.phone}` : ''}
        </p>
      )}
      {terminal && (
        <p className="mt-4 text-sm font-medium text-red-600">Cette commande n’est plus active.</p>
      )}
    </div>
  );
}
