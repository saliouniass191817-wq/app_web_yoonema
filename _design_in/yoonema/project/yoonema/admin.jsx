/* Yoonema — Admin desktop dashboard screens */
const ADMIN_NAV = [
  { label: 'Tableau de bord', icon: 'grid' },
  { label: 'Restaurants', icon: 'store', badge: '2' },
  { label: 'Utilisateurs', icon: 'users' },
  { label: 'Commandes', icon: 'bag' },
  { label: 'Finances', icon: 'wallet' },
];
const ADMIN_USER = { initial: 'Y', name: 'Admin Yoonema', sub: 'Super-admin' };

function AShell({ active, title, sub, right, children }) {
  return (
    <DeskFrame url="yoonema.sn/admin">
      <Sidebar brand="Administration" items={ADMIN_NAV} active={active} user={ADMIN_USER} />
      <main className="dash-main">
        <DashTop title={title} sub={sub} right={right} />
        <div className="dash-content">{children}</div>
      </main>
    </DeskFrame>
  );
}

function roleBadgeColor(role) {
  return role === 'Vendeur' ? 'var(--forest)' : role === 'Livreur' ? 'var(--indigo)' : 'var(--terra)';
}

function AdminDashboard() {
  return (
    <AShell active="Tableau de bord" title="Vue d'ensemble" sub="Plateforme campus UCAD · temps réel"
      right={<div className="seg"><button>Jour</button><button>Semaine</button><button className="on">Mois</button></div>}>
      <div className="stat-grid">
        <Stat icon="users" color="var(--terra)" label="Utilisateurs" value="8 450" delta="+5.4%" up />
        <Stat icon="store" color="var(--forest)" label="Restaurants" value="32" delta="2 en attente" up />
        <Stat icon="bag" color="var(--indigo)" label="Commandes" value="12 480" delta="+7.2%" up />
        <Stat icon="wallet" color="var(--gold)" label="Revenus" value="24,5M" delta="+15.8%" up />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 18, marginTop: 18 }}>
        <Panel title="Volume de commandes · 7 jours" link="Exporter">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>2 184</span>
            <span className="delta up"><Icon name="arrowUp" size={13} stroke={2.5} />+7.2% cette semaine</span>
          </div>
          <BarChart data={[210, 260, 240, 320, 300, 410, 380]} labels={['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']} alt />
        </Panel>
        <Panel title="Répartition des rôles">
          <Donut segments={[
            { label: 'Étudiants', value: 7820, pct: 78, color: 'var(--terra)' },
            { label: 'Vendeurs', value: 32, pct: 8, color: 'var(--forest)' },
            { label: 'Livreurs', value: 96, pct: 14, color: 'var(--indigo)' },
          ]} />
        </Panel>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 18, marginTop: 18, alignItems: 'start' }}>
        <Panel title="Commandes récentes" link="Voir tout" bodyStyle={{ padding: '6px 8px 8px' }}>
          <table className="tbl">
            <thead><tr><th>Commande</th><th>Client</th><th>Restaurant</th><th>Total</th><th>Statut</th></tr></thead>
            <tbody>
              {DATA.orders.slice(0, 5).map((o) => (
                <tr key={o.id}>
                  <td className="mono">{o.id}</td>
                  <td className="strong">{o.client}</td>
                  <td>{o.resto}</td>
                  <td className="strong">{fcfa(o.total)}</td>
                  <td><SBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
        <Panel title="Tâches en attente">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[{ i: 'store', n: 2, t: 'restaurants à valider', c: 'var(--gold-deep)', bg: 'var(--gold-tint)' }, { i: 'x', n: 3, t: 'signalements à traiter', c: 'var(--clay)', bg: 'var(--clay-tint)' }, { i: 'headphones', n: 7, t: 'messages support', c: 'var(--indigo)', bg: 'var(--indigo-tint)' }].map((t) => (
              <div key={t.t} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--cream-2)', borderRadius: 12 }}>
                <span style={{ width: 36, height: 36, borderRadius: 10, display: 'grid', placeItems: 'center', background: t.bg, color: t.c }}><Icon name={t.i} size={17} /></span>
                <span style={{ fontSize: 13.5, color: 'var(--ink-2)' }}><b style={{ color: 'var(--ink)' }}>{t.n}</b> {t.t}</span>
                <Icon name="chevronRight" size={16} style={{ marginLeft: 'auto', color: 'var(--ink-3)' }} />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AShell>
  );
}

function AdminRestaurants() {
  const rows = [
    ...DATA.restaurants.map((r) => ({ ...r, pending: false })),
    { id: 9, name: 'Saveurs du Fleuve', desc: 'Spécialités du nord, Saint-Louisienne.', tone: 'bowl', rating: 0, orders: 0, rev: '—', pending: true },
    { id: 10, name: 'Mbalax Café', desc: 'Café, petit-déj et viennoiseries.', tone: 'sweet', rating: 0, orders: 0, rev: '—', pending: true },
  ];
  return (
    <AShell active="Restaurants" title="Restaurants" sub="32 actifs · 2 en attente de validation"
      right={<button className="btn btn-ghost btn-sm" style={{ height: 42 }}><Icon name="filter" size={16} />Filtrer</button>}>
      <Panel bodyStyle={{ padding: '6px 8px 8px' }}>
        <table className="tbl">
          <thead><tr><th>Restaurant</th><th>Note</th><th>Commandes</th><th>Revenus</th><th>Statut</th><th style={{ textAlign: 'right' }}>Action</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <div className="cell-user">
                    <span className="thumb" style={{ width: 38, height: 38 }}><FoodTile tone={r.tone} cap="" /></span>
                    <div><div className="strong">{r.name}</div><div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{r.desc}</div></div>
                  </div>
                </td>
                <td className="strong">{r.pending ? '—' : `${r.rating} ★`}</td>
                <td>{r.pending ? '—' : r.orders}</td>
                <td className="strong">{r.rev}</td>
                <td>{r.pending ? <span className="badge badge-pending"><span className="dot" />En attente</span> : <span className="badge badge-done"><span className="dot" />Validé</span>}</td>
                <td style={{ textAlign: 'right' }}>
                  {r.pending
                    ? <div style={{ display: 'inline-flex', gap: 6 }}><button className="btn btn-primary btn-sm">Valider</button><button className="btn btn-ghost btn-sm">Refuser</button></div>
                    : <button className="icon-btn" style={{ width: 34, height: 34, borderRadius: 10, display: 'inline-grid' }}><Icon name="more" size={16} /></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </AShell>
  );
}

function AdminUsers() {
  return (
    <AShell active="Utilisateurs" title="Utilisateurs" sub="8 450 comptes · 96 livreurs · 32 vendeurs"
      right={<button className="btn btn-primary btn-sm" style={{ height: 42 }}><Icon name="plus" size={16} />Inviter</button>}>
      <div className="kpi-row" style={{ marginBottom: 18 }}>
        {['Tous', 'Étudiants', 'Vendeurs', 'Livreurs', 'Suspendus'].map((c, i) => <button key={c} className={`chip ${i === 0 ? 'chip-on' : 'chip-off'}`}>{c}</button>)}
      </div>
      <Panel bodyStyle={{ padding: '6px 8px 8px' }}>
        <table className="tbl">
          <thead><tr><th>Utilisateur</th><th>Rôle</th><th>Inscrit</th><th>Statut</th><th style={{ textAlign: 'right' }}>Action</th></tr></thead>
          <tbody>
            {DATA.users.map((u) => (
              <tr key={u.mail}>
                <td>
                  <div className="cell-user">
                    <span className="ava" style={{ background: u.color }}>{u.name[0]}</span>
                    <div><div className="strong">{u.name}</div><div className="mono" style={{ fontSize: 12 }}>{u.mail}</div></div>
                  </div>
                </td>
                <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 700, color: roleBadgeColor(u.role) }}><span style={{ width: 7, height: 7, borderRadius: 999, background: roleBadgeColor(u.role) }} />{u.role}</span></td>
                <td>{u.joined}</td>
                <td>{u.status === 'Actif' ? <span className="badge badge-done"><span className="dot" />Actif</span> : <span className="badge badge-cancel"><span className="dot" />Suspendu</span>}</td>
                <td style={{ textAlign: 'right' }}><button className="icon-btn" style={{ width: 34, height: 34, borderRadius: 10, display: 'inline-grid' }}><Icon name="more" size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </AShell>
  );
}

function AdminOrders() {
  return (
    <AShell active="Commandes" title="Toutes les commandes" sub="12 480 commandes · 2 184 cette semaine"
      right={<button className="btn btn-ghost btn-sm" style={{ height: 42 }}><Icon name="send" size={16} />Exporter</button>}>
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 18 }}>
        <Stat icon="clock" color="var(--gold)" label="En attente" value="28" />
        <Stat icon="bike" color="var(--indigo)" label="En cours" value="64" />
        <Stat icon="checkCircle" color="var(--forest)" label="Livrées (jour)" value="412" />
        <Stat icon="x" color="var(--clay)" label="Annulées (jour)" value="9" />
      </div>
      <Panel bodyStyle={{ padding: '6px 8px 8px' }}>
        <table className="tbl">
          <thead><tr><th>Commande</th><th>Client</th><th>Restaurant</th><th>Articles</th><th>Total</th><th>Statut</th><th>Reçue</th></tr></thead>
          <tbody>
            {DATA.orders.map((o) => (
              <tr key={o.id}>
                <td className="mono">{o.id}</td>
                <td className="strong">{o.client}</td>
                <td>{o.resto}</td>
                <td>{o.items}</td>
                <td className="strong">{fcfa(o.total)}</td>
                <td><SBadge status={o.status} /></td>
                <td>{o.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </AShell>
  );
}

function AdminFinance() {
  const payouts = [
    { name: 'Chez Aminata', tone: 'thieb', amount: 1240000, status: 'done' },
    { name: 'Le Thiéboudienne', tone: 'yassa', amount: 1500000, status: 'pending' },
    { name: 'Dakar Grill', tone: 'grill', amount: 840000, status: 'pending' },
    { name: 'Teranga Pizza', tone: 'pizza', amount: 520000, status: 'done' },
  ];
  return (
    <AShell active="Finances" title="Finances" sub="Commissions, revenus & reversements"
      right={<div className="seg"><button>Semaine</button><button className="on">Mois</button><button>Année</button></div>}>
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
        <Stat icon="wallet" color="var(--forest)" label="Revenus bruts" value="24,5M" delta="+15.8%" up />
        <Stat icon="trending" color="var(--terra)" label="Commission (12%)" value="2,94M" delta="+15.8%" up />
        <Stat icon="clock" color="var(--gold)" label="À reverser" value="2,86M" delta="2 en attente" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 18, marginTop: 18, alignItems: 'start' }}>
        <Panel title="Revenus & commissions">
          <BarChart data={[18, 20, 19, 22, 21, 24.5].map((x) => x * 4)} labels={['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui']} alt />
        </Panel>
        <Panel title="Moyens de paiement">
          <Donut segments={[
            { label: 'Wave', value: 58, pct: 58, color: 'var(--indigo)' },
            { label: 'Orange Money', value: 30, pct: 30, color: 'var(--terra)' },
            { label: 'Espèces', value: 12, pct: 12, color: 'var(--forest)' },
          ]} />
        </Panel>
      </div>
      <div style={{ marginTop: 18 }}>
        <Panel title="Reversements aux restaurants" link="Tout payer" bodyStyle={{ padding: '6px 8px 8px' }}>
          <table className="tbl">
            <thead><tr><th>Restaurant</th><th>Montant net</th><th>Statut</th><th style={{ textAlign: 'right' }}>Action</th></tr></thead>
            <tbody>
              {payouts.map((p) => (
                <tr key={p.name}>
                  <td><div className="cell-user"><span className="thumb" style={{ width: 34, height: 34 }}><FoodTile tone={p.tone} cap="" /></span><span className="strong">{p.name}</span></div></td>
                  <td className="strong">{p.amount.toLocaleString('fr-FR')} FCFA</td>
                  <td>{p.status === 'done' ? <span className="badge badge-done"><span className="dot" />Reversé</span> : <span className="badge badge-pending"><span className="dot" />En attente</span>}</td>
                  <td style={{ textAlign: 'right' }}>{p.status === 'pending' ? <button className="btn btn-primary btn-sm">Reverser</button> : <span style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </AShell>
  );
}

Object.assign(window, { AdminDashboard, AdminRestaurants, AdminUsers, AdminOrders, AdminFinance });
