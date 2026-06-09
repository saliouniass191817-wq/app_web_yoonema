/* Yoonema — Student mobile screens (beyond Home/Detail/Login) */
const { useState: useStu } = React;

function MHead({ title, right }) {
  return (
    <div className="m-head">
      <button className="m-back"><Icon name="chevronLeft" size={20} /></button>
      <h2>{title}</h2>
      {right}
    </div>
  );
}

/* --- Register --- */
function StudentRegister() {
  const [role, setRole] = useStu('Étudiant');
  const roles = ['Étudiant', 'Vendeur', 'Livreur'];
  return (
    <div className="screen-scroll" style={{ padding: '0 0 24px' }}>
      <div style={{ padding: '28px 22px 6px' }}>
        <span className="avatar" style={{ borderRadius: 16 }}><Icon name="utensils" size={22} /></span>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, marginTop: 16 }}>Crée ton compte</h2>
        <p style={{ color: 'var(--ink-2)', fontSize: 14, marginTop: 4 }}>Rejoins ton campus et commande en quelques clics.</p>
      </div>
      <div style={{ padding: '12px 22px' }}>
        <div className="field"><label>Nom complet</label><div className="inp"><Icon name="user" size={18} style={{ color: 'var(--ink-3)' }} /><input placeholder="Awa Diop" /></div></div>
        <div className="field"><label>Email</label><div className="inp"><Icon name="mail" size={18} style={{ color: 'var(--ink-3)' }} /><input placeholder="toi@univ.sn" /></div></div>
        <div className="field"><label>Mot de passe</label><div className="inp"><Icon name="lock" size={18} style={{ color: 'var(--ink-3)' }} /><input type="password" placeholder="••••••••" /></div></div>
        <div className="field">
          <label>Je suis</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {roles.map((r) => <button key={r} className={`chip ${role === r ? 'chip-on' : 'chip-off'}`} style={{ flex: 1, justifyContent: 'center' }} onClick={() => setRole(r)}>{r}</button>)}
          </div>
        </div>
        <div style={{ marginTop: 20 }}><Button variant="primary" size="lg" block icon="flame">Créer mon compte</Button></div>
        <p style={{ textAlign: 'center', fontSize: 13.5, color: 'var(--ink-2)', marginTop: 16 }}>Déjà inscrit ? <a href="#" style={{ color: 'var(--terra)', fontWeight: 700, textDecoration: 'none' }}>Se connecter</a></p>
      </div>
    </div>
  );
}

/* --- Cart --- */
function StudentCart() {
  const [items, setItems] = useStu([
    { id: 1, name: 'Thiéboudienne rouge', price: 2500, q: 1, tone: 'thieb', dish: 'thiéb' },
    { id: 2, name: 'Yassa poulet', price: 2000, q: 1, tone: 'yassa', dish: 'yassa' },
  ]);
  const sub = items.reduce((s, i) => s + i.price * i.q, 0);
  const fee = 500;
  const set = (id, q) => setItems(items.map((i) => i.id === id ? { ...i, q: Math.max(1, q) } : i));
  return (
    <>
      <div className="screen-scroll">
        <MHead title="Mon panier" />
        <div style={{ padding: '4px 16px 0', display: 'flex', flexDirection: 'column', gap: 11 }}>
          {items.map((it) => (
            <div className="card" key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 11 }}>
              <span className="thumb"><FoodTile tone={it.tone} cap="" /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <b style={{ fontSize: 14.5, fontWeight: 700, display: 'block' }}>{it.name}</b>
                <span style={{ fontSize: 13, color: 'var(--terra)', fontWeight: 700 }}>{fcfa(it.price)}</span>
              </div>
              <Stepper value={it.q} set={(q) => set(it.id, q)} />
            </div>
          ))}
          <button style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--terra)', fontWeight: 700, fontSize: 13.5, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 2px' }}><Icon name="plus" size={16} />Ajouter d'autres plats</button>
        </div>
        <div style={{ padding: '8px 16px 0' }}>
          <div className="card grain" style={{ padding: 16 }}>
            <div className="sum-row">Sous-total<span className="v">{fcfa(sub)}</span></div>
            <div className="sum-row">Livraison<span className="v">{fcfa(fee)}</span></div>
            <div className="sum-row total">Total<span>{fcfa(sub + fee)}</span></div>
            <div className="field" style={{ marginTop: 14 }}>
              <label>Adresse de livraison</label>
              <div className="inp"><Icon name="mapPin" size={18} style={{ color: 'var(--ink-3)' }} /><input placeholder="Village H · Chambre 12" /></div>
            </div>
          </div>
        </div>
        <div style={{ height: 90 }} />
      </div>
      <button className="cart-float">
        <span className="cart-badge"><Icon name="card" size={19} /></span>
        <span className="cart-mid"><b>Confirmer et payer</b><small>{items.length} articles · livraison incluse</small></span>
        <span className="cart-price">{fcfa(sub + fee)}</span>
      </button>
    </>
  );
}

/* --- Order tracking --- */
const TL = [
  { label: 'Commande confirmée', time: '13:24', state: 'done' },
  { label: 'En préparation', time: '13:28', state: 'done' },
  { label: 'En route vers toi', time: '13:41', state: 'now' },
  { label: 'Livrée', time: 'Estimée 13:52', state: 'todo' },
];
function StudentTracking() {
  return (
    <>
      <div className="screen-scroll">
        <MHead title="Commande YN-3041" />
        <div style={{ padding: '4px 16px 0' }}>
          <div className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="thumb thumb-lg"><FoodTile tone="thieb" cap="" /></span>
            <div style={{ flex: 1 }}>
              <b style={{ fontFamily: 'var(--font-display)', fontSize: 17 }}>Chez Aminata</b>
              <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 2 }}>2 articles · {fcfa(4500)}</div>
            </div>
            <Badge status="active" />
          </div>
        </div>
        <div style={{ padding: '14px 16px 0' }}>
          <div className="card" style={{ padding: 18 }}>
            <div className="timeline">
              {TL.map((s, i) => (
                <div className={`tl-step ${s.state}`} key={s.label}>
                  <div className="tl-rail">
                    <div className={`tl-dot ${s.state}`}><Icon name={s.state === 'todo' ? 'clock' : 'check'} size={16} stroke={2.4} /></div>
                    {i < TL.length - 1 && <div className={`tl-line ${s.state === 'done' ? 'done' : ''}`} />}
                  </div>
                  <div className="tl-body"><b>{s.label}</b><small>{s.time}</small></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ padding: '14px 16px 0' }}>
          <div className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="avatar" style={{ background: 'linear-gradient(145deg,var(--indigo),#283C72)' }}>M</span>
            <div style={{ flex: 1 }}>
              <b style={{ fontSize: 14.5 }}>Modou Fall</b>
              <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Ton livreur · ★ 4.9</div>
            </div>
            <button className="icon-btn" style={{ background: 'var(--forest-tint)', color: 'var(--forest)', boxShadow: 'inset 0 0 0 1.5px var(--forest-soft)' }}><Icon name="phone" size={18} /></button>
          </div>
        </div>
        <div style={{ padding: '14px 16px 0' }}>
          <Button variant="outline" block icon="x" style={{ borderRadius: 14 }}>Annuler la commande</Button>
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink-3)', marginTop: 8 }}>Annulation gratuite encore 4 min 12 s</p>
        </div>
        <div style={{ height: 24 }} />
      </div>
    </>
  );
}

/* --- Order success --- */
function StudentSuccess() {
  return (
    <div className="success-wrap">
      <div className="success-ring"><div className="core"><Icon name="check" size={38} stroke={2.6} /></div></div>
      <h2>Commande confirmée !</h2>
      <p>Ta commande <b style={{ color: 'var(--ink)' }}>YN-3041</b> est en préparation chez Chez Aminata. Livraison estimée à <b style={{ color: 'var(--ink)' }}>13:52</b>.</p>
      <div className="card" style={{ width: '100%', padding: 14, margin: '22px 0 18px' }}>
        <div className="sum-row">Sous-total<span className="v">{fcfa(4000)}</span></div>
        <div className="sum-row">Livraison<span className="v">{fcfa(500)}</span></div>
        <div className="sum-row total">Total payé<span>{fcfa(4500)}</span></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
        <Button variant="primary" size="lg" block icon="bike">Suivre ma commande</Button>
        <Button variant="ghost" block>Retour à l'accueil</Button>
      </div>
    </div>
  );
}

/* --- Orders list --- */
const MY_ORDERS = [
  { id: 'YN-3041', resto: 'Chez Aminata', total: 4500, status: 'active', date: "Aujourd'hui 13:24", tone: 'thieb' },
  { id: 'YN-3038', resto: 'Dakar Grill', total: 7100, status: 'done', date: 'Hier 20:10', tone: 'grill' },
  { id: 'YN-3029', resto: 'Le Thiéboudienne', total: 2500, status: 'done', date: '02 juin', tone: 'yassa' },
  { id: 'YN-3018', resto: 'Teranga Pizza', total: 6400, status: 'cancel', date: '28 mai', tone: 'pizza' },
];
function StudentOrders() {
  const [tab, setTab] = useStu('Tout');
  const tabs = ['Tout', 'En cours', 'Terminées'];
  const list = MY_ORDERS.filter((o) => tab === 'Tout' || (tab === 'En cours' ? o.status === 'active' : o.status !== 'active'));
  return (
    <>
      <div className="topbar"><h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>Mes commandes</h2>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>{tabs.map((t) => <Chip key={t} on={tab === t} onClick={() => setTab(t)}>{t}</Chip>)}</div>
      </div>
      <div className="screen-scroll">
        <div style={{ padding: '14px 16px 0', display: 'flex', flexDirection: 'column', gap: 11 }}>
          {list.map((o) => (
            <div className="card" key={o.id} style={{ padding: 13, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="thumb thumb-lg"><FoodTile tone={o.tone} cap="" /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
                  <b style={{ fontSize: 14.5, fontWeight: 700 }}>{o.resto}</b>
                  <Badge status={o.status} />
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4, fontFamily: 'ui-monospace,Menlo,monospace' }}>{o.id} · {o.date}</div>
                <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 800, marginTop: 4 }}>{fcfa(o.total)}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: 86 }} />
      </div>
      <BottomNav active={1} />
    </>
  );
}

/* --- Notifications --- */
function StudentNotifs() {
  return (
    <>
      <div className="topbar"><div style={{ display: 'flex', alignItems: 'center' }}><h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, flex: 1 }}>Alertes</h2><button style={{ background: 'none', border: 'none', color: 'var(--terra)', fontWeight: 700, fontSize: 13 }}>Tout lire</button></div></div>
      <div className="screen-scroll">
        {DATA.notifs.map((n, i) => (
          <div className={`notif ${n.unread ? 'unread' : ''}`} key={i}>
            <span className="ni" style={{ background: n.bg, color: n.tone }}><Icon name={n.icon} size={19} /></span>
            <div className="nb" style={{ flex: 1 }}>
              <b>{n.title}</b>
              <p>{n.body}</p>
              <time>{n.time}</time>
            </div>
            {n.unread && <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--terra)', flex: 'none', marginTop: 6 }} />}
          </div>
        ))}
        <div style={{ height: 86 }} />
      </div>
      <BottomNav active={2} />
    </>
  );
}

/* --- Profile --- */
const PROF_MENU = [
  { icon: 'mapPin', t: 'Mes adresses' }, { icon: 'card', t: 'Moyens de paiement' },
  { icon: 'heart', t: 'Favoris' }, { icon: 'gift', t: 'Parrainage & points' },
  { icon: 'headphones', t: 'Aide & support' }, { icon: 'settings', t: 'Paramètres' },
];
function StudentProfile() {
  return (
    <>
      <div className="screen-scroll">
        <div className="prof-hero">
          <div className="prof-ava">A</div>
          <div className="prof-name">Awa Diop</div>
          <div className="prof-mail">awa@univ.sn · Village H</div>
        </div>
        <div className="prof-stats">
          <div className="prof-stat"><b>27</b><small>COMMANDES</small></div>
          <div className="prof-stat"><b>6</b><small>FAVORIS</small></div>
          <div className="prof-stat"><b>340</b><small>POINTS</small></div>
        </div>
        <div className="menu-list">
          {PROF_MENU.map((m) => (
            <button className="menu-row" key={m.t}><span className="mi"><Icon name={m.icon} size={18} /></span><span className="mt">{m.t}</span><span className="ar"><Icon name="chevronRight" size={18} /></span></button>
          ))}
          <button className="menu-row"><span className="mi" style={{ background: 'var(--clay-tint)', color: 'var(--clay)', boxShadow: 'none' }}><Icon name="logout" size={18} /></span><span className="mt" style={{ color: 'var(--clay)' }}>Déconnexion</span></button>
        </div>
        <div style={{ height: 86 }} />
      </div>
      <BottomNav active={3} />
    </>
  );
}

Object.assign(window, { MHead, StudentRegister, StudentCart, StudentTracking, StudentSuccess, StudentOrders, StudentNotifs, StudentProfile });
