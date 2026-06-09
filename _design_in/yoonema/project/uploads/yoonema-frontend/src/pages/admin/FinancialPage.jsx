import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/ui/StatCard';
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
      <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
        <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">Finances</h1>
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100" />)}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['Aujourd’hui', data?.today, 'wallet', 'brand'],
                ['Cette semaine', data?.week, 'receipt', 'info'],
                ['Ce mois', data?.month, 'chart', 'success'],
              ].map(([label, period, icon, tone]) => (
                <StatCard
                  key={label}
                  icon={icon}
                  tone={tone}
                  label={label}
                  value={formatCurrency(total(period))}
                  hint={`Commissions ${formatCurrency(period?.commissions || 0)} · Livraison ${formatCurrency(period?.delivery_fees || 0)}`}
                />
              ))}
            </div>

            <Card>
              <CardBody>
                <h2 className="mb-4 text-lg font-bold text-gray-900">Virements vendeurs en attente</h2>
                {(data?.pending_payouts || []).length === 0 ? (
                  <p className="py-6 text-center text-sm text-gray-500">Aucun virement en attente.</p>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {(data?.pending_payouts || []).map((payout) => (
                      <div key={payout.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                        <div>
                          <p className="font-semibold text-gray-900">{formatCurrency(payout.amount)} · {payout.orders_count} commandes</p>
                          <p className="text-sm text-gray-500">{payout.period_start} → {payout.period_end}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="warning" dot>{payout.status}</Badge>
                          <Button size="sm" onClick={() => markProcessed(payout.id)}>Marquer traité</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h2 className="mb-5 text-lg font-bold text-gray-900">Revenus des 30 derniers jours</h2>
                <div className="flex h-52 items-end gap-1">
                  {(data?.chart || []).map((point) => {
                    const max = Math.max(...(data?.chart || []).map((item) => Number(item.revenue || 0)), 1);
                    return (
                      <div key={point.date} className="group flex flex-1 flex-col items-center gap-2">
                        <div
                          className="w-full rounded-t-md bg-orange-500/85 transition-colors group-hover:bg-orange-500"
                          style={{ height: `${Math.max(6, (Number(point.revenue || 0) / max) * 180)}px` }}
                          title={`${point.date}: ${formatCurrency(point.revenue || 0)}`}
                        />
                        <span className="text-[10px] text-gray-400">{point.date?.slice(5)}</span>
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
