/* Yoonema core components */
const { useState } = React;

const fcfa = (n) => n.toLocaleString('fr-FR').replace(/\u202f/g, ' ') + ' FCFA';

/* warm duotone gradients keyed to dish tones */
const FOOD_TONES = {
  thieb:   'linear-gradient(150deg, #C0451A 0%, #7E2A0B 100%)',
  yassa:   'linear-gradient(150deg, #D38A1E 0%, #9B5410 100%)',
  grill:   'linear-gradient(150deg, #8A3A12 0%, #3A1606 100%)',
  fresh:   'linear-gradient(150deg, #2E7A57 0%, #16412F 100%)',
  pizza:   'linear-gradient(150deg, #C2531A 0%, #8E2A12 100%)',
  drink:   'linear-gradient(150deg, #4A6BB0 0%, #283C72 100%)',
  sweet:   'linear-gradient(150deg, #C97B8E 0%, #7E3A4E 100%)',
  bowl:    'linear-gradient(150deg, #B0791E 0%, #5E3A0E 100%)',
};

function FoodTile({ tone = 'thieb', cap, className = '', style }) {
  return (
    <div className={`food ${className}`} style={{ background: FOOD_TONES[tone] || FOOD_TONES.thieb, ...style }}>
      <div className="food-plate"><div className="inner" /></div>
      {cap && <span className="food-cap">{cap}</span>}
    </div>
  );
}

function Button({ variant = 'primary', size, block, children, icon, ...rest }) {
  const cls = ['btn', `btn-${variant}`, size === 'sm' && 'btn-sm', size === 'lg' && 'btn-lg', block && 'btn-block']
    .filter(Boolean).join(' ');
  return <button className={cls} {...rest}>{icon && <Icon name={icon} size={size === 'lg' ? 20 : 17} />}{children}</button>;
}

const STATUS = {
  pending: { cls: 'badge-pending', label: 'En attente' },
  active:  { cls: 'badge-active',  label: 'En cours' },
  done:    { cls: 'badge-done',    label: 'Livré' },
  cancel:  { cls: 'badge-cancel',  label: 'Annulé' },
};
function Badge({ status, children }) {
  const s = STATUS[status] || STATUS.pending;
  return <span className={`badge ${s.cls}`}><span className="dot" />{children || s.label}</span>;
}

function Chip({ on, children, onClick }) {
  return <button className={`chip ${on ? 'chip-on' : 'chip-off'}`} onClick={onClick}>{children}</button>;
}

function Stepper({ value, set, min = 1 }) {
  return (
    <div className="stepper">
      <button onClick={() => set(Math.max(min, value - 1))} disabled={value <= min} aria-label="Diminuer"><Icon name="minus" size={16} /></button>
      <span className="q">{value}</span>
      <button onClick={() => set(value + 1)} aria-label="Augmenter"><Icon name="plus" size={16} /></button>
    </div>
  );
}

function RestaurantCard({ r, onClick }) {
  return (
    <div className="card rcard" style={{ cursor: 'pointer' }} onClick={onClick}>
      <div style={{ position: 'relative' }}>
        <FoodTile tone={r.tone} cap={r.dish} />
        <span className={`pill-status ${r.open ? 'pill-open' : 'pill-closed'}`}><span className="dot" />{r.open ? 'Ouvert' : 'Fermé'}</span>
        <span className="pill-rating"><Icon name="star" size={12} style={{ color: 'var(--gold)' }} />{r.rating.toFixed(1)}</span>
      </div>
      <div className="rcard-body">
        <h3 className="rcard-name">{r.name}</h3>
        <p className="rcard-desc">{r.desc}</p>
        <div className="rcard-meta">
          <span className="mi"><Icon name="clock" size={14} style={{ color: 'var(--ink-3)' }} />{r.time} min</span>
          <span className="mi"><Icon name="bike" size={14} style={{ color: 'var(--ink-3)' }} />{r.fee === 0 ? 'Gratuit' : fcfa(r.fee)}</span>
        </div>
      </div>
    </div>
  );
}

function MenuItemCard({ item, onAdd }) {
  const [q, setQ] = useState(1);
  return (
    <div className="card mcard">
      <FoodTile tone={item.tone} cap={item.dish} />
      <div className="mcard-body">
        <span className="cat-pill">{item.category}</span>
        <h3 className="mcard-name">{item.name}</h3>
        <p className="mcard-desc">{item.desc}</p>
        <div className="mcard-foot">
          <span className="price">{item.price.toLocaleString('fr-FR')}<small> FCFA</small></span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Stepper value={q} set={setQ} />
            <button className="add-btn" onClick={() => { onAdd && onAdd(item, q); setQ(1); }}><Icon name="plus" size={15} />Ajouter</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const NAV_ITEMS = [
  { label: 'Accueil', icon: 'home' },
  { label: 'Commandes', icon: 'bag' },
  { label: 'Alertes', icon: 'bell' },
  { label: 'Profil', icon: 'user' },
];
function BottomNav({ active = 0, onChange }) {
  return (
    <nav className="bottomnav">
      {NAV_ITEMS.map((it, i) => (
        <button key={it.label} className={`nav-item ${i === active ? 'on' : ''}`} onClick={() => onChange && onChange(i)}>
          <span className="nav-pill" />
          <Icon name={it.icon} size={23} stroke={i === active ? 2.2 : 1.9} />
          <span>{it.label}</span>
        </button>
      ))}
    </nav>
  );
}

function PhoneFrame({ label, sub, children }) {
  return (
    <div>
      <div className="phone">
        <div className="phone-notch" />
        <div className="phone-screen">{children}</div>
      </div>
      <div className="phone-label">{label}{sub && <span> · {sub}</span>}</div>
    </div>
  );
}

Object.assign(window, { fcfa, FoodTile, FOOD_TONES, Button, Badge, Chip, Stepper, RestaurantCard, MenuItemCard, BottomNav, PhoneFrame });
