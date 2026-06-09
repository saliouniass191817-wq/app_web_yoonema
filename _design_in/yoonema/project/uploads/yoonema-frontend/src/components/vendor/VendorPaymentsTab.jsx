import React from 'react';
import { Badge } from '../ui/Badge';
import { Card, CardBody } from '../ui/Card';
import { formatCurrency, formatDate } from '../../lib/utils';

export default function VendorPaymentsTab({ payments }) {
  const data = payments || {};
  const history = data.history || [];

  return (
    <Card>
      <CardBody>
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-600">Montant en attente</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.pending_amount || 0)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Dernier virement</p>
            <p className="text-lg font-semibold text-gray-900">{data.last_payout_date ? formatDate(data.last_payout_date) : 'Aucun virement'}</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-600">
              <tr>
                <th className="py-2">Période</th>
                <th className="py-2">Montant</th>
                <th className="py-2">Commandes</th>
                <th className="py-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row) => (
                <tr key={row.id} className="border-t border-gray-100">
                  <td className="py-3">{row.period_start} - {row.period_end}</td>
                  <td className="py-3">{formatCurrency(row.amount)}</td>
                  <td className="py-3">{row.orders_count}</td>
                  <td className="py-3"><Badge variant={row.status === 'completed' ? 'success' : 'info'}>{row.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}
