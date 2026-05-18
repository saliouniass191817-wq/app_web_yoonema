import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { adminAPI } from '../../api';
import { formatCurrency } from '../../lib/utils';

export default function AdminFinancialPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadFinance = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getFinance();
      setData(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinance();
  }, []);

  const markProcessed = async (id) => {
    await adminAPI.markPayoutProcessed(id);
    loadFinance();
  };

  const total = (period) => (Number(period?.commissions || 0) + Number(period?.delivery_fees || 0));

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <h1 className="mb-8 text-3xl font-bold">Finances</h1>
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ['Aujourd’hui', data?.today],
                ['Cette semaine', data?.week],
                ['Ce mois', data?.month],
              ].map(([label, period]) => (
                <Card key={label}>
                  <CardBody>
                    <p className="text-sm text-gray-600">{label}</p>
                    <p className="text-2xl font-bold">{formatCurrency(total(period))}</p>
                    <p className="mt-2 text-xs text-gray-500">Commissions {formatCurrency(period?.commissions || 0)} · Livraison {formatCurrency(period?.delivery_fees || 0)}</p>
                  </CardBody>
                </Card>
              ))}
            </div>

            <Card>
              <CardBody>
                <h2 className="mb-4 text-lg font-semibold">Virements vendeurs en attente</h2>
                <div className="space-y-3">
                  {(data?.pending_payouts || []).map((payout) => (
                    <div key={payout.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
                      <div>
                        <p className="font-medium">{formatCurrency(payout.amount)} · {payout.orders_count} commandes</p>
                        <p className="text-sm text-gray-600">{payout.period_start} - {payout.period_end}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="info">{payout.status}</Badge>
                        <Button size="sm" onClick={() => markProcessed(payout.id)}>Marquer traité</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h2 className="mb-4 text-lg font-semibold">Revenus des 30 derniers jours</h2>
                <div className="flex h-52 items-end gap-1">
                  {(data?.chart || []).map((point) => {
                    const max = Math.max(...(data?.chart || []).map((item) => Number(item.revenue || 0)), 1);
                    return (
                      <div key={point.date} className="flex flex-1 flex-col items-center gap-2">
                        <div className="w-full rounded-t bg-orange-500" style={{ height: `${Math.max(6, (Number(point.revenue || 0) / max) * 180)}px` }} />
                        <span className="text-[10px] text-gray-500">{point.date?.slice(5)}</span>
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
