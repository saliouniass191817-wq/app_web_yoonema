import React from 'react';

export function OrderStatusTimeline({ status }) {
  const steps = [
    { key: 'pending', label: 'Commandée' },
    { key: 'confirmed', label: 'Confirmée' },
    { key: 'preparing', label: 'Préparation' },
    { key: 'ready', label: 'Prête' },
    { key: 'delivering', label: 'Livraison' },
    { key: 'delivered', label: 'Livrée' },
  ];

  const currentIndex = steps.findIndex((s) => s.key === status);

  return (
    <div className="py-6">
      <div className="flex justify-between mb-4">
        {steps.map((step, index) => (
          <div key={step.key} className="flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold mb-2 transition-all ${
                index <= currentIndex
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {index + 1}
            </div>
            <p className="text-xs text-center text-gray-600">{step.label}</p>
          </div>
        ))}
      </div>

      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-500 rounded-full transition-all duration-300"
          style={{
            width: `${((currentIndex + 1) / steps.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
