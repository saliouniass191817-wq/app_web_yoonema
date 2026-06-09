/* Yoonema — core student phone screens (login, home, detail) for the full app */
const { useState: useCore } = React;

const QUICK_ACCOUNTS = [
  { role: 'Étudiant', icon: 'user', color: 'var(--terra)' },
  { role: 'Vendeur', icon: 'store', color: 'var(--forest)' },
  { role: 'Livreur', icon: 'bike', color: 'var(--indigo)' },
  { role: 'Admin', icon: 'shield', color: 'var(--gold-deep)' },
];

function StudentLogin() {
  return (
    <div className="screen-scroll" style={{ padding: 0 }}>
      <div style={{ position: 'relative', padding: '40px 24px 30px', background: 'radial-gradient(120% 120% at 0% 0%, #D9612C 0%, var(--terra) 45%, var(--terra-deep) 100%)', color: 'var(--cream)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(115deg, rgba(255,255,255,.07) 0 2px, transparent 2px 16px)' }} />
        <div style={{ position: 'relative' }}>
          <span style={{ width: 48, height: 48, borderRadius: 15, background: 'rgba(255,255,255,.16)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.4)', display: 'grid', placeItems: 'center' }}><Icon name="utensils" size={24} /></span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, marginTop: 18, lineHeight: 1.02, color: 'var(--cream)' }}>Le campus a faim.<br />On s'en occupe.</h2>
          <p style={{ marginTop: 10, color: 'rgba(255,245,230,.85)', fontSize: 14, lineHeight: 1.5 }}>Connecte-toi pour commander auprès des restos de ton université.</p>
        </div>
      </div>
      <div style={{ padding: '22px 22px 24px' }}>
        <div className="field" style={{ marginTop: 0 }}><label>Email</label><div className="inp"><Icon name="mail" size={18} style={{ color: 'var(--ink-3)' }} /><input placeholder="toi@univ.sn" /></div></div>
        <div className="field"><label>Mot de passe</label><div className="inp"><Icon name="lock" size={18} style={{ color: 'var(--ink-3)' }} /><input type="password" placeholder="••••••••" /></div></div>
        <div style={{ marginTop: 18 }}><Button variant="primary" size="lg" block icon="flame">Se connecter</Button></div>
        <div className="divider"><span className="ln" /><span>Comptes démo</span><span className="ln" /></div>
        <div className="quick-grid">
          {QUICK_ACCOUNTS.map((q) => (
            <button className="quick" key={q.role}>
              <span className="qi" style={{ background: q.color }}><Icon name={q.icon} size={17} /></span>
              <span className="qmeta"><b>{q.role}</b><small>Connexion rapide</small></span>
            </button>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-2)', marginTop: 16 }}>Pas de compte ? <a href="#" style={{ color: 'var(--terra)', fontWeight: 700, textDecoration: 'none' }}>Créer un compte</a></p>
      </div>
    </div>
  );
}

function StudentHome() {
  const [filter, setFilter] = useCore('Tous');
  const filters = ['Tous', 'Sénégalais', 'Rapide', 'Pizzas', '< 20 min', '4+ ★', 'Ouvert'];
  return (
    <>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="avatar">A</div>
          <div style={{ flex: 1, lineHeight: 1.15 }}>
            <div style={{ fontSize: 12.5, color: 'var(--ink-3)', fontWeight: 600 }}>Bonjour 👋</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17 }}>Awa Diop</div>
          </div>
          <button className="icon-btn"><Icon name="bell" size={20} /><span className="dot-badge">3</span></button>
        </div>
        <div className="search" style={{ marginTop: 14 }}>
          <Icon name="search" size={18} style={{ color: 'var(--ink-3)' }} />
          <input placeholder="Rechercher un resto ou un plat…" />
        </div>
      </div>
      <div className="screen-scroll">
        <div className="scroll-x" style={{ display: 'flex', gap: 9, padding: '14px 16px 6px' }}>
          {filters.map((f) => <Chip key={f} on={filter === f} onClick={() => setFilter(f)}>{f}</Chip>)}
        </div>
        <div style={{ padding: '6px 16px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13 }}>
          {DATA.restaurants.map((r) => <RestaurantCard key={r.id} r={r} />)}
        </div>
        <div style={{ height: 78 }} />
      </div>
      <BottomNav active={0} />
    </>
  );
}

function RestaurantDetail() {
  return (
    <>
      <div className="screen-scroll">
        <div className="rd-header">
          <FoodTile tone="thieb" cap="" />
          <div className="rd-overlay" />
          <button className="rd-back"><Icon name="chevronLeft" size={20} /></button>
          <button className="rd-fav"><Icon name="heart" size={19} /></button>
          <div className="rd-title-wrap">
            <span className="pill-status pill-open" style={{ position: 'static', display: 'inline-flex', marginBottom: 10 }}><span className="dot" />Ouvert</span>
            <h2 className="rd-title">Chez Aminata</h2>
            <div className="rd-meta">
              <span className="mi"><Icon name="star" size={14} style={{ color: 'var(--gold)' }} />4.8</span>
              <span className="mi"><Icon name="clock" size={14} />18 min</span>
              <span className="mi"><Icon name="bike" size={14} />500 FCFA</span>
              <span className="mi"><Icon name="mapPin" size={14} />Campus UCAD</span>
            </div>
          </div>
        </div>
        <div style={{ padding: '20px 16px 8px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>Menu du jour</h3>
          <span style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 600 }}>4 plats</span>
        </div>
        <div style={{ padding: '4px 16px 24px', display: 'flex', flexDirection: 'column', gap: 13 }}>
          {DATA.menu.slice(0, 3).map((m) => <MenuItemCard key={m.id} item={m} />)}
        </div>
        <div style={{ height: 90 }} />
      </div>
      <button className="cart-float">
        <span className="cart-badge">🛒</span>
        <span className="cart-mid"><b>Voir le panier</b><small>2 articles</small></span>
        <span className="cart-price">{fcfa(4500)}</span>
      </button>
    </>
  );
}

Object.assign(window, { StudentLogin, StudentHome, RestaurantDetail });
