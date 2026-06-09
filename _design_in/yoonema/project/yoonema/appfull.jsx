/* Yoonema — full app assembly */
const { useState: useApp } = React;

function PhoneScreen({ label, sub, children }) {
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

function ScreenLabel({ children }) { return <p className="screen-label">{children}</p>; }

function RoleBanner({ id, color, icon, title, desc }) {
  return (
    <div className="role-banner" id={id}>
      <span className="rb-ico" style={{ background: color }}><Icon name={icon} size={26} /></span>
      <div><h2>{title}</h2><p>{desc}</p></div>
    </div>
  );
}

/* ---------- Design system recap ---------- */
const PALETTE = [
  { name: 'Terracotta', hex: '#C0451A', v: 'var(--terra)' },
  { name: 'Terracotta deep', hex: '#9B340F', v: 'var(--terra-deep)' },
  { name: 'Forêt', hex: '#1F5D44', v: 'var(--forest)' },
  { name: 'Or ocre', hex: '#D38A1E', v: 'var(--gold)' },
  { name: 'Indigo', hex: '#3B4E8C', v: 'var(--indigo)' },
  { name: 'Argile', hex: '#A02118', v: 'var(--clay)' },
  { name: 'Encre', hex: '#241405', v: 'var(--ink)' },
  { name: 'Sable', hex: '#EFE2C9', v: 'var(--sand)' },
  { name: 'Crème', hex: '#FBF5E9', v: 'var(--cream)' },
];

function DesignSystem() {
  const [chip, setChip] = useApp('Sénégalais');
  const chips = ['Tous', 'Sénégalais', 'Rapide', '< 20 min'];
  return (
    <section className="section" id="design">
      <RoleBanner color="var(--ink)" icon="grid" title="Design System" desc="Les jetons visuels « Teranga » qui unifient toute la plateforme." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, alignItems: 'start' }}>
        <div className="tok-card" style={{ gridColumn: '1 / -1' }}>
          <div className="tok-label">Palette</div>
          <div className="swatches">
            {PALETTE.map((c) => (
              <div className="swatch" key={c.name}>
                <div className="swatch-chip" style={{ background: c.v }} />
                <div className="swatch-meta"><div className="swatch-name">{c.name}</div><div className="swatch-hex">{c.hex}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div className="tok-card">
          <div className="tok-label">Typographie</div>
          <div className="spec-row"><span className="spec-tag">Display</span><span style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, lineHeight: 1 }}>Le campus a faim</span></div>
          <div className="spec-row"><span className="spec-tag">Titre</span><span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Menu du jour</span></div>
          <div className="spec-row"><span className="spec-tag">Corps</span><span style={{ fontSize: 15, color: 'var(--ink-2)' }}>Livré en quelques minutes sur ton campus.</span></div>
          <div className="spec-row"><span className="spec-tag">Mono</span><span style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 13, color: 'var(--ink-3)' }}>Bricolage Grotesque · Hanken Grotesk</span></div>
        </div>
        <div className="tok-card">
          <div className="tok-label">Boutons</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <Button variant="primary" icon="flame">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="danger" icon="x">Danger</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </div>
        <div className="tok-card">
          <div className="tok-label">Badges de statut</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <Badge status="pending" /><Badge status="active" /><Badge status="done" /><Badge status="cancel" />
          </div>
        </div>
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

/* ---------- Sections ---------- */
function StudentSection() {
  return (
    <section className="section" id="student">
      <RoleBanner color="var(--terra)" icon="user" title="Étudiant" desc="Parcours mobile complet : de la connexion à la livraison." />
      <ScreenLabel>Connexion &amp; inscription</ScreenLabel>
      <div className="stage" style={{ justifyContent: 'flex-start' }}>
        <PhoneScreen label="Connexion"><StudentLogin /></PhoneScreen>
        <PhoneScreen label="Inscription"><StudentRegister /></PhoneScreen>
      </div>
      <ScreenLabel>Découverte &amp; commande</ScreenLabel>
      <div className="stage" style={{ justifyContent: 'flex-start' }}>
        <PhoneScreen label="Accueil"><StudentHome /></PhoneScreen>
        <PhoneScreen label="Détail restaurant"><RestaurantDetail /></PhoneScreen>
        <PhoneScreen label="Panier"><StudentCart /></PhoneScreen>
      </div>
      <ScreenLabel>Suivi &amp; compte</ScreenLabel>
      <div className="stage" style={{ justifyContent: 'flex-start' }}>
        <PhoneScreen label="Confirmation"><StudentSuccess /></PhoneScreen>
        <PhoneScreen label="Suivi de commande"><StudentTracking /></PhoneScreen>
        <PhoneScreen label="Mes commandes"><StudentOrders /></PhoneScreen>
        <PhoneScreen label="Alertes"><StudentNotifs /></PhoneScreen>
        <PhoneScreen label="Profil"><StudentProfile /></PhoneScreen>
      </div>
      <ScreenLabel>Paiement &amp; avis</ScreenLabel>
      <div className="stage" style={{ justifyContent: 'flex-start' }}>
        <PaymentPhone />
        <PhoneScreen label="Notation"><StudentRating /></PhoneScreen>
      </div>
    </section>
  );
}

function VendorSection() {
  return (
    <section className="section" id="vendor">
      <RoleBanner color="var(--forest)" icon="store" title="Vendeur" desc="Tableau de bord desktop pour piloter le restaurant en direct." />
      <ScreenLabel>Tableau de bord</ScreenLabel>
      <VendorDashboard />
      <ScreenLabel>Commandes en direct</ScreenLabel>
      <VendorOrders />
      <ScreenLabel>Gestion du menu</ScreenLabel>
      <VendorMenu />
      <ScreenLabel>Statistiques</ScreenLabel>
      <VendorStats />
      <ScreenLabel>Profil du restaurant</ScreenLabel>
      <VendorProfile />
    </section>
  );
}

function DeliverySection() {
  return (
    <section className="section" id="delivery">
      <RoleBanner color="var(--indigo)" icon="bike" title="Livreur" desc="App mobile pour accepter et suivre les courses sur le campus." />
      <ScreenLabel>Courses &amp; livraison</ScreenLabel>
      <div className="stage" style={{ justifyContent: 'flex-start' }}>
        <PhoneScreen label="Courses disponibles"><DeliveryDashboard /></PhoneScreen>
        <PhoneScreen label="Course en cours"><DeliveryActive /></PhoneScreen>
        <PhoneScreen label="Historique"><DeliveryHistory /></PhoneScreen>
        <PhoneScreen label="Profil"><DeliveryProfile /></PhoneScreen>
      </div>
    </section>
  );
}

function AdminSection() {
  return (
    <section className="section" id="admin">
      <RoleBanner color="var(--gold-deep)" icon="shield" title="Admin" desc="Supervision de la plateforme : utilisateurs, restos, finances." />
      <ScreenLabel>Vue d'ensemble</ScreenLabel>
      <AdminDashboard />
      <ScreenLabel>Validation des restaurants</ScreenLabel>
      <AdminRestaurants />
      <ScreenLabel>Utilisateurs</ScreenLabel>
      <AdminUsers />
      <ScreenLabel>Commandes</ScreenLabel>
      <AdminOrders />
      <ScreenLabel>Finances</ScreenLabel>
      <AdminFinance />
    </section>
  );
}

const NAV_LINKS = [
  { id: 'design', icon: 'grid', label: 'Design' },
  { id: 'student', icon: 'user', label: 'Étudiant' },
  { id: 'vendor', icon: 'store', label: 'Vendeur' },
  { id: 'delivery', icon: 'bike', label: 'Livreur' },
  { id: 'admin', icon: 'shield', label: 'Admin' },
];

function App() {
  return (
    <>
      <nav className="index-nav">
        {NAV_LINKS.map((l) => <a key={l.id} href={`#${l.id}`}><span className="ico"><Icon name={l.icon} size={17} /></span>{l.label}</a>)}
      </nav>
      <div className="page">
        <header className="page-head">
          <span className="eyebrow"><Icon name="flame" size={13} />Refonte complète · Teranga</span>
          <h1 className="page-title">Yoonema</h1>
          <p className="page-sub">La plateforme de livraison sur les campus du Sénégal, repensée de bout en bout. Quatre rôles, un seul système chaleureux — sable &amp; terracotta, typographie expressive, food-first.</p>
        </header>
        <DesignSystem />
        <StudentSection />
        <VendorSection />
        <DeliverySection />
        <AdminSection />
        <footer style={{ marginTop: 96, paddingTop: 28, borderTop: '2px dashed var(--hairline)', color: 'var(--ink-3)', fontSize: 13, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span>Yoonema — design system « Teranga » · 23 écrans, 4 rôles</span>
          <span style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>Bricolage Grotesque · Hanken Grotesk</span>
        </footer>
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
