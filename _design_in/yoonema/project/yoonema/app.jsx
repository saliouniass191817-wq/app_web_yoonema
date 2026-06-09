/* Yoonema — redesign showcase: 4 stacked sections */
const { useState: useS } = React;

/* ---------------- mock data ---------------- */
const RESTAURANTS = [
  { id: 1, name: 'Chez Aminata', desc: 'Cuisine sénégalaise maison, thiéboudienne & yassa.', tone: 'thieb', dish: 'thiéboudienne', rating: 4.8, time: 18, fee: 500, open: true },
  { id: 2, name: 'Dakar Grill', desc: 'Grillades au feu de bois, dibi & brochettes.', tone: 'grill', dish: 'dibi', rating: 4.6, time: 25, fee: 700, open: true },
  { id: 3, name: 'Le Thiéboudienne', desc: 'Le plat national, riz rouge et poisson frais.', tone: 'yassa', dish: 'yassa poulet', rating: 4.9, time: 22, fee: 0, open: true },
  { id: 4, name: 'Teranga Pizza', desc: 'Pizzas au four, pâte fine, garnitures locales.', tone: 'pizza', dish: 'pizza thiof', rating: 4.4, time: 30, fee: 800, open: false },
];

const MENU = [
  { id: 1, category: 'Plat du jour', name: 'Thiéboudienne rouge', desc: 'Riz au poisson, légumes mijotés et sauce tomate.', price: 2500, tone: 'thieb', dish: 'thiéboudienne' },
  { id: 2, category: 'Grillade', name: 'Yassa poulet', desc: 'Poulet mariné aux oignons confits et citron vert.', price: 2000, tone: 'yassa', dish: 'yassa' },
  { id: 3, category: 'Boisson', name: 'Bissap maison', desc: 'Infusion d\u2019hibiscus glacée, menthe fraîche.', price: 500, tone: 'drink', dish: 'bissap' },
];

const QUICK = [
  { role: 'Étudiant', email: 'student@test.com', icon: 'user', color: 'var(--terra)' },
  { role: 'Vendeur', email: 'vendor@test.com', icon: 'store', color: 'var(--forest)' },
  { role: 'Livreur', email: 'delivery@test.com', icon: 'bike', color: 'var(--indigo)' },
  { role: 'Admin', email: 'admin@test.com', icon: 'wallet', color: 'var(--gold-deep)' },
];

/* =========================================================
   SECTION 1 — DESIGN SYSTEM
   ========================================================= */
const PALETTE = [
  { name: 'Terracotta', hex: '#C0451A', v: 'var(--terra)', dark: true },
  { name: 'Terracotta deep', hex: '#9B340F', v: 'var(--terra-deep)', dark: true },
  { name: 'Forêt', hex: '#1F5D44', v: 'var(--forest)', dark: true },
  { name: 'Or ocre', hex: '#D38A1E', v: 'var(--gold)', dark: true },
  { name: 'Argile', hex: '#A02118', v: 'var(--clay)', dark: true },
  { name: 'Indigo', hex: '#3B4E8C', v: 'var(--indigo)', dark: true },
  { name: 'Encre', hex: '#241405', v: 'var(--ink)', dark: true },
  { name: 'Sable', hex: '#EFE2C9', v: 'var(--sand)', dark: false },
  { name: 'Crème', hex: '#FBF5E9', v: 'var(--cream)', dark: false },
];

function DesignSystem() {
  const [chip, setChip] = useS('Sénégalais');
  const chips = ['Tous', 'Sénégalais', 'Rapide', '< 20 min'];
  return (
    <section className="section">
      <div className="section-head">
        <span className="section-num">01</span>
        <h2 className="section-title">Design System</h2>
        <p className="section-desc">Jetons visuels : palette Teranga, typographie, boutons, statuts et filtres.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 22, alignItems: 'start' }}>
        {/* Palette */}
        <div className="tok-card" style={{ gridColumn: '1 / -1' }}>
          <div className="tok-label">Palette</div>
          <div className="swatches">
            {PALETTE.map((c) => (
              <div className="swatch" key={c.name}>
                <div className="swatch-chip" style={{ background: c.v }} />
                <div className="swatch-meta">
                  <div className="swatch-name">{c.name}</div>
                  <div className="swatch-hex">{c.hex}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div className="tok-card">
          <div className="tok-label">Typographie</div>
          <div className="spec-row"><span className="spec-tag">Display 40</span><span style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, lineHeight: 1 }}>Le campus a faim</span></div>
          <div className="spec-row"><span className="spec-tag">Display 22</span><span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>Menu du jour</span></div>
          <div className="spec-row"><span className="spec-tag">Body 15</span><span style={{ fontSize: 15, color: 'var(--ink-2)' }}>Commande tes repas et fais-toi livrer en quelques minutes.</span></div>
          <div className="spec-row"><span className="spec-tag">Mono</span><span style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 13, color: 'var(--ink-3)' }}>Bricolage Grotesque · Hanken Grotesk</span></div>
        </div>

        {/* Buttons */}
        <div className="tok-card">
          <div className="tok-label">Boutons</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <Button variant="primary" icon="flame">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="danger" icon="minus">Danger</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </div>

        {/* Status badges */}
        <div className="tok-card">
          <div className="tok-label">Badges de statut</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <Badge status="pending" />
            <Badge status="active" />
            <Badge status="done" />
            <Badge status="cancel" />
          </div>
        </div>

        {/* Chips */}
        <div className="tok-card">
          <div className="tok-label">Chips de filtre</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {chips.map((c) => <Chip key={c} on={chip === c} onClick={() => setChip(c)}>{c}</Chip>)}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   SECTION 2 — STUDENT HOME
   ========================================================= */
function StudentHome() {
  const [active, setActive] = useS(0);
  const [filter, setFilter] = useS('Tous');
  const [query, setQuery] = useS('');
  const filters = ['Tous', 'Sénégalais', 'Rapide', 'Pizzas', '< 20 min', '4+ ★', 'Ouvert'];

  return (
    <section className="section">
      <div className="section-head">
        <span className="section-num">02</span>
        <h2 className="section-title">Vue étudiant — Accueil</h2>
        <p className="section-desc">Recherche, filtres scrollables et grille de restaurants du campus.</p>
      </div>

      <div className="stage">
        <PhoneFrame label="StudentHomePage" sub="étudiant">
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
              <input placeholder="Rechercher un resto ou un plat…" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>

          <div className="screen-scroll">
            <div className="scroll-x" style={{ display: 'flex', gap: 9, padding: '14px 16px 6px' }}>
              {filters.map((f) => <Chip key={f} on={filter === f} onClick={() => setFilter(f)}>{f}</Chip>)}
            </div>

            <div style={{ padding: '6px 16px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13 }}>
              {RESTAURANTS.map((r) => <RestaurantCard key={r.id} r={r} />)}
            </div>
            <div style={{ height: 78 }} />
          </div>

          <BottomNav active={active} onChange={setActive} />
        </PhoneFrame>
      </div>
    </section>
  );
}

/* =========================================================
   SECTION 3 — RESTAURANT DETAIL
   ========================================================= */
function RestaurantDetail() {
  const [count, setCount] = useS(2);
  const [total, setTotal] = useS(4500);
  const add = (item, q) => { setCount((c) => c + q); setTotal((t) => t + item.price * q); };

  return (
    <section className="section">
      <div className="section-head">
        <span className="section-num">03</span>
        <h2 className="section-title">Détail restaurant</h2>
        <p className="section-desc">En-tête immersif, menu du jour et panier flottant persistant.</p>
      </div>

      <div className="stage">
        <PhoneFrame label="RestaurantDetailPage" sub="menu + panier">
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
              <span style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 600 }}>{MENU.length} plats</span>
            </div>

            <div style={{ padding: '4px 16px 24px', display: 'flex', flexDirection: 'column', gap: 13 }}>
              {MENU.map((m) => <MenuItemCard key={m.id} item={m} onAdd={add} />)}
            </div>
            <div style={{ height: 90 }} />
          </div>

          <button className="cart-float">
            <span className="cart-badge">🛒</span>
            <span className="cart-mid">
              <b>Voir le panier</b>
              <small>{count} article{count > 1 ? 's' : ''}</small>
            </span>
            <span className="cart-price">{fcfa(total)}</span>
          </button>
        </PhoneFrame>
      </div>
    </section>
  );
}

/* =========================================================
   SECTION 4 — LOGIN
   ========================================================= */
const FEATURES = [
  { icon: 'store', text: 'Tous les restos du campus, au même endroit' },
  { icon: 'bike', text: 'Livraison rapide par des étudiants' },
  { icon: 'wallet', text: 'Paiement mobile sécurisé' },
];

function Login() {
  const [email, setEmail] = useS('');
  const [pw, setPw] = useS('');
  return (
    <section className="section">
      <div className="section-head">
        <span className="section-num">04</span>
        <h2 className="section-title">Connexion</h2>
        <p className="section-desc">Split-screen : branding chaleureux à gauche, formulaire et comptes démo à droite.</p>
      </div>

      <div className="login-wrap">
        <div className="login-card grain">
          {/* brand panel */}
          <div className="login-brand">
            <div className="brand-logo">
              <span className="mark"><Icon name="utensils" size={24} /></span>
              Yoonema
            </div>
            <div className="brand-head">
              <h2>Le campus a faim. On s'en occupe.</h2>
              <p>Commande tes repas auprès des restaurants de l'université et fais-toi livrer en quelques minutes.</p>
              <div className="feature-list">
                {FEATURES.map((f) => (
                  <div className="feature" key={f.text}>
                    <span className="fi"><Icon name={f.icon} size={19} /></span>
                    {f.text}
                  </div>
                ))}
              </div>
            </div>
            <div className="brand-foot">Fait pour les étudiants universitaires du Sénégal.</div>
          </div>

          {/* form */}
          <div className="login-form">
            <h3>Bon retour 👋</h3>
            <p className="lead">Connecte-toi pour commander.</p>

            <div className="field">
              <label>Email</label>
              <div className="inp">
                <Icon name="mail" size={18} style={{ color: 'var(--ink-3)' }} />
                <input type="email" placeholder="toi@univ.sn" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>Mot de passe</label>
              <div className="inp">
                <Icon name="lock" size={18} style={{ color: 'var(--ink-3)' }} />
                <input type="password" placeholder="••••••••" value={pw} onChange={(e) => setPw(e.target.value)} />
              </div>
            </div>

            <div style={{ marginTop: 22 }}>
              <Button variant="primary" size="lg" block icon="flame">Se connecter</Button>
            </div>

            <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--ink-2)', marginTop: 16 }}>
              Pas encore de compte ? <a href="#" style={{ color: 'var(--terra)', fontWeight: 700, textDecoration: 'none' }}>Créer un compte</a>
            </p>

            <div className="divider"><span className="ln" /><span>Comptes démo</span><span className="ln" /></div>
            <div className="quick-grid">
              {QUICK.map((q) => (
                <button className="quick" key={q.email} onClick={() => { setEmail(q.email); setPw('password123'); }}>
                  <span className="qi" style={{ background: q.color }}><Icon name={q.icon} size={18} /></span>
                  <span className="qmeta"><b>{q.role}</b><small>Connexion rapide</small></span>
                </button>
              ))}
            </div>
            <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink-3)', marginTop: 12 }}>Mot de passe : password123</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   APP
   ========================================================= */
function App() {
  return (
    <div className="page">
      <header className="page-head">
        <span className="eyebrow"><Icon name="flame" size={13} />Refonte visuelle · Teranga</span>
        <h1 className="page-title">Yoonema</h1>
        <p className="page-sub">Une refonte chaleureuse et ancrée dans son contexte : livraison de repas sur les campus du Sénégal. Quatre écrans, un seul système — sable & terracotta, typographie expressive, cartes texturées.</p>
      </header>

      <DesignSystem />
      <StudentHome />
      <RestaurantDetail />
      <Login />

      <footer style={{ marginTop: 96, paddingTop: 28, borderTop: '2px dashed var(--hairline)', color: 'var(--ink-3)', fontSize: 13, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span>Yoonema — design system « Teranga »</span>
        <span style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>Bricolage Grotesque · Hanken Grotesk</span>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
