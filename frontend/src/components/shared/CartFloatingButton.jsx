import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { Icon } from '../ui/Icon';
import { formatCurrency } from '../../lib/utils';

export function CartFloatingButton() {
  const { itemCount, total } = useCart();
  const { role } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Students only, never on the cart page itself, and only when non-empty.
  if (role !== 'student' || pathname === '/cart' || itemCount === 0) return null;

  return (
    <button
      onClick={() => navigate('/cart')}
      aria-label={`Voir le panier, ${itemCount} article(s)`}
      style={{ background: 'var(--ink)', color: 'var(--cream)', boxShadow: 'var(--shadow-pop)' }}
      className="fixed bottom-24 right-5 z-40 flex items-center gap-3 rounded-2xl py-2 pl-2 pr-4 transition-transform hover:-translate-y-0.5 md:bottom-6 md:right-8"
    >
      <span
        className="relative grid h-10 w-10 place-items-center rounded-xl"
        style={{ background: 'var(--terra)', color: '#fff' }}
      >
        <Icon name="bag" size={20} />
        <span
          className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] font-extrabold"
          style={{ background: 'var(--gold)', color: 'var(--ink)', border: '2px solid var(--ink)' }}
        >
          {itemCount}
        </span>
      </span>
      <span className="flex flex-col items-start leading-tight">
        <b style={{ fontFamily: 'var(--font-display)', fontSize: 14 }}>Voir le panier</b>
        <small style={{ fontSize: 11.5, color: 'rgba(255,235,205,.7)' }}>{formatCurrency(total)}</small>
      </span>
    </button>
  );
}

export default CartFloatingButton;
