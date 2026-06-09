/* Yoonema — Vendor (vendeur) desktop dashboard screens */
const VENDOR_NAV = [
  { label: 'Tableau de bord', icon: 'grid' },
  { label: 'Commandes', icon: 'utensils', badge: '3' },
  { label: 'Menu', icon: 'list' },
  { label: 'Statistiques', icon: 'chart' },
  { label: 'Profil', icon: 'store' },
];
const VENDOR_USER = { initial: 'A', name: 'Chez Aminata', sub: 'Vendeur · UCAD' };

function VShell({ active, title, sub, right, children }) {
  return (
    <DeskFrame url="yoonema.sn/vendor">
      <Sidebar brand="Espace vendeur" items={VENDOR_NAV} active={active} user={VENDOR_USER} />
      <main className="dash-main">
        <DashTop title={title} sub={sub} right={right} />
        <div className="dash-content">{children}</div>
      </main>
    </DeskFrame>
  );
}

function VendorDashboard() {
  return (
    <VShell active="Tableau de bord" title="Tableau de bord" sub="Lundi 5 juin · Aperçu de la journée"
      right={<div className="seg"><button>Jour</button><button className="on">Semaine</button><button>Mois</button></div>}>
      <div className="stat-grid">
        <Stat icon="bag" color="var(--terra)" label="Commandes du jour" value="24" delta="+12%" up />
        <Stat icon="wallet" color="var(--forest)" label="Revenus livrés" value="142k" delta="+8%" up />
        <Stat icon="star" color="var(--gold)" label="Note moyenne" value="4.8 ★" delta="+0.2" up />
        <Stat icon="clock" color="var(--indigo)" label="Paiements en attente" value="38k" delta="-5%" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 18, marginTop: 18 }}>
        <Panel title="Revenus · 7 derniers jours" link="Détails">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>CFA 842 000</span>
            <span className="delta up"><Icon name="arrowUp" size={13} stroke={2.5} />+8% vs semaine dernière</span>
          </div>
          <BarChart data={[62, 78, 54, 90, 72, 110, 95]} labels={['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']} alt />
        </Panel>
        <Panel title="Répartition des commandes">
          <Donut segments={[
            { label: 'Livrées', value: 142, pct: 62, color: 'var(--forest)' },
            { label: 'En cours', value: 38, pct: 17, color: 'var(--indigo)' },
            { label: 'En attente', value: 28, pct: 12, color: 'var(--gold)' },
            { label: 'Annulées', value: 20, pct: 9, color: 'var(--clay)' },
          ]} />
        </Panel>
      </div>
      <div style={{ marginTop: 18 }}>
        <Panel title="Commandes récentes" link="Voir tout" bodyStyle={{ padding: '6px 8px 8px' }}>
          <table className="tbl">
            <thead><tr><th>Commande</th><th>Client</th><th>Articles</th><th>Total</th><th>Statut</th><th>Reçue</th></tr></thead>
            <tbody>
              {DATA.orders.slice(0, 5).map((o) => (
                <tr key={o.id}>
                  <td className="mono">{o.id}</td>
                  <td className="strong">{o.client}</td>
                  <td>{o.items}</td>
                  <td className="strong">{fcfa(o.total)}</td>
                  <td><SBadge status={o.status} /></td>
                  <td>{o.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </VShell>
  );
}

function VendorOrders() {
  const cols = [
    { key: 'pending', label: 'En attente', tint: 'var(--gold-tint)', items: DATA.orders.filter((o) => o.status === 'pending') },
    { key: 'active', label: 'En préparation', tint: 'var(--indigo-tint)', items: DATA.orders.filter((o) => o.status === 'active') },
    { key: 'done', label: 'Prêtes / livrées', tint: 'var(--forest-tint)', items: DATA.orders.filter((o) => o.status === 'done') },
  ];
  return (
    <VShell active="Commandes" title="Commandes" sub="3 nouvelles · gère le flux en direct"
      right={<button className="btn btn-ghost btn-sm" style={{ height: 42 }}><Icon name="filter" size={16} />Filtrer</button>}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, alignItems: 'start' }}>
        {cols.map((c) => (
          <div key={c.key}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ width: 9, height: 9, borderRadius: 999, background: c.key === 'pending' ? 'var(--gold)' : c.key === 'active' ? 'var(--indigo)' : 'var(--forest)' }} />
              <b style={{ fontFamily: 'var(--font-display)', fontSize: 15 }}>{c.label}</b>
              <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 800, color: 'var(--ink-3)' }}>{c.items.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {c.items.map((o) => (
                <div className="panel" key={o.id} style={{ padding: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="thumb"><FoodTile tone={o.tone} cap="" /></span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <b style={{ fontSize: 13.5, fontWeight: 700 }}>{o.client}</b>
                      <div className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{o.id} · {o.items} art.</div>
                    </div>
                    <b style={{ fontFamily: 'var(--font-display)', fontSize: 15 }}>{fcfa(o.total)}</b>
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-3)', margin: '9px 0', fontWeight: 600 }}>{o.time}</div>
                  {c.key === 'pending' && <div style={{ display: 'flex', gap: 8 }}><button className="btn btn-primary btn-sm" style={{ flex: 1 }}>Accepter</button><button className="btn btn-ghost btn-sm">Refuser</button></div>}
                  {c.key === 'active' && <button className="btn btn-secondary btn-sm btn-block">Marquer prête</button>}
                  {c.key === 'done' && <button className="btn btn-ghost btn-sm btn-block">Voir le détail</button>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </VShell>
  );
}

function VendorMenu() {
  return (
    <VShell active="Menu" title="Mon menu" sub="4 plats · 1 indisponible"
      right={<button className="btn btn-primary btn-sm" style={{ height: 42 }}><Icon name="plus" size={17} />Ajouter un plat</button>}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
        {DATA.menu.map((m) => (
          <div className="panel" key={m.id} style={{ padding: 14, display: 'flex', gap: 14, opacity: m.avail ? 1 : 0.66 }}>
            <span className="thumb thumb-lg" style={{ width: 86, height: 86 }}><FoodTile tone={m.tone} cap="" /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="cat-pill">{m.category}</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                  <button className="icon-btn" style={{ width: 34, height: 34, borderRadius: 10 }}><Icon name="edit" size={15} /></button>
                  <button className="icon-btn" style={{ width: 34, height: 34, borderRadius: 10, color: 'var(--clay)' }}><Icon name="trash" size={15} /></button>
                </div>
              </div>
              <b style={{ fontFamily: 'var(--font-display)', fontSize: 16, display: 'block', marginTop: 7 }}>{m.name}</b>
              <p style={{ fontSize: 12.5, color: 'var(--ink-2)', margin: '3px 0 0', lineHeight: 1.35 }}>{m.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
                <span className="price" style={{ fontSize: 17 }}>{m.price.toLocaleString('fr-FR')}<small> FCFA</small></span>
                <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: m.avail ? 'var(--forest)' : 'var(--ink-3)' }}>{m.avail ? 'Disponible' : 'Épuisé'}</span>
                <VToggleAvail on={m.avail} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </VShell>
  );
}
function VToggleAvail({ on }) { const [v, setV] = React.useState(on); return <Toggle on={v} onClick={() => setV(!v)} />; }

function VendorStats() {
  const dishes = [
    { name: 'Thiéboudienne rouge', n: 142, pct: 100, tone: 'thieb' },
    { name: 'Yassa poulet', n: 98, pct: 69, tone: 'yassa' },
    { name: 'Bissap maison', n: 76, pct: 53, tone: 'drink' },
    { name: 'Thiakry', n: 41, pct: 29, tone: 'sweet' },
  ];
  return (
    <VShell active="Statistiques" title="Statistiques" sub="Performance du mois de juin"
      right={<div className="seg"><button>Semaine</button><button className="on">Mois</button><button>Année</button></div>}>
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
        <Stat icon="wallet" color="var(--forest)" label="Revenus du mois" value="3,1M" delta="+18%" up />
        <Stat icon="bag" color="var(--terra)" label="Commandes" value="468" delta="+11%" up />
        <Stat icon="trending" color="var(--gold)" label="Panier moyen" value="6 620" delta="+4%" up />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 18, marginTop: 18 }}>
        <Panel title="Revenus mensuels">
          <BarChart data={[1.9, 2.2, 2.0, 2.6, 2.4, 3.1].map((x) => x * 30)} labels={['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui']} alt />
        </Panel>
        <Panel title="Plats les plus vendus">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {dishes.map((d) => (
              <div key={d.name}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span className="thumb" style={{ width: 30, height: 30, borderRadius: 8 }}><FoodTile tone={d.tone} cap="" /></span>
                  <b style={{ fontSize: 13, fontWeight: 700, flex: 1 }}>{d.name}</b>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--ink-3)' }}>{d.n}</span>
                </div>
                <div style={{ height: 7, borderRadius: 999, background: 'var(--cream-2)', overflow: 'hidden' }}><div style={{ height: '100%', width: `${d.pct}%`, background: 'var(--terra)', borderRadius: 999 }} /></div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </VShell>
  );
}

function VendorProfile() {
  return (
    <VShell active="Profil" title="Profil du restaurant" sub="Informations visibles par les étudiants"
      right={<button className="btn btn-primary btn-sm" style={{ height: 42 }}><Icon name="check" size={16} />Enregistrer</button>}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 18, alignItems: 'start' }}>
        <Panel title="Image de couverture">
          <div style={{ borderRadius: 14, overflow: 'hidden', position: 'relative', height: 180 }}>
            <FoodTile tone="thieb" cap="couverture" style={{ height: '100%' }} />
            <button className="btn btn-ghost btn-sm" style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', background: 'rgba(251,245,233,.94)' }}><Icon name="image" size={15} />Changer la photo</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, padding: '12px 14px', background: 'var(--forest-tint)', borderRadius: 12, color: 'var(--forest)', fontSize: 13, fontWeight: 700 }}>
            <Icon name="checkCircle" size={18} />Restaurant validé · visible sur le campus
          </div>
        </Panel>
        <Panel title="Informations">
          <div className="field" style={{ marginTop: 0 }}><label>Nom du restaurant</label><div className="inp"><input defaultValue="Chez Aminata" /></div></div>
          <div className="field"><label>Description</label><div className="inp" style={{ height: 'auto', padding: 12, alignItems: 'flex-start' }}><input style={{ height: 24 }} defaultValue="Cuisine sénégalaise maison, thiéboudienne & yassa." /></div></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="field"><label>Catégorie</label><div className="inp"><input defaultValue="Sénégalais" /><Icon name="chevronDown" size={16} style={{ color: 'var(--ink-3)' }} /></div></div>
            <div className="field"><label>Frais de livraison</label><div className="inp"><input defaultValue="500 FCFA" /></div></div>
            <div className="field"><label>Ouverture</label><div className="inp"><Icon name="clock" size={17} style={{ color: 'var(--ink-3)' }} /><input defaultValue="11:00" /></div></div>
            <div className="field"><label>Fermeture</label><div className="inp"><Icon name="clock" size={17} style={{ color: 'var(--ink-3)' }} /><input defaultValue="22:00" /></div></div>
          </div>
          <div className="field"><div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--cream-2)', borderRadius: 12 }}><div style={{ flex: 1 }}><b style={{ fontSize: 13.5 }}>Restaurant ouvert</b><div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Accepte les commandes maintenant</div></div><VToggleAvail on={true} /></div></div>
        </Panel>
      </div>
    </VShell>
  );
}

Object.assign(window, { VendorDashboard, VendorOrders, VendorMenu, VendorStats, VendorProfile });
