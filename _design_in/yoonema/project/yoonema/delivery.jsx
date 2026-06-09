/* Yoonema — Delivery (livreur) mobile screens */
const { useState: useDel } = React;

const DEL_NAV = [
  { label: 'Courses', icon: 'bike' },
  { label: 'Historique', icon: 'receipt' },
  { label: 'Profil', icon: 'user' },
];
function DelNav({ active }) {
  return (
    <nav className="bottomnav">
      {DEL_NAV.map((it, i) => (
        <button key={it.label} className={`nav-item ${i === active ? 'on' : ''}`}>
          <span className="nav-pill" />
          <Icon name={it.icon} size={23} stroke={i === active ? 2.2 : 1.9} />
          <span>{it.label}</span>
        </button>
      ))}
    </nav>
  );
}

/* --- Delivery dashboard: available courses --- */
function DeliveryDashboard() {
  const [online, setOnline] = useDel(true);
  return (
    <>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="avatar" style={{ background: 'linear-gradient(145deg,var(--indigo),#283C72)' }}>M</span>
          <div style={{ flex: 1, lineHeight: 1.15 }}>
            <div style={{ fontSize: 12.5, color: 'var(--ink-3)', fontWeight: 600 }}>Livreur</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17 }}>Modou Fall</div>
          </div>
          <button className={`avail ${online ? 'on' : 'off'}`} onClick={() => setOnline(!online)}>
            <span className="dot" style={{ background: online ? 'var(--forest)' : 'var(--ink-3)' }} />{online ? 'Disponible' : 'Hors-ligne'}
          </button>
        </div>
      </div>
      <div className="screen-scroll">
        <div style={{ padding: '14px 16px 0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div className="prof-stat"><b>8</b><small>COURSES</small></div>
          <div className="prof-stat"><b style={{ color: 'var(--forest)' }}>9 400</b><small>FCFA GAGNÉS</small></div>
          <div className="prof-stat"><b>★ 4.9</b><small>NOTE</small></div>
        </div>
        <div style={{ padding: '20px 16px 6px' }}><h3 className="dash-sub" style={{ margin: 0 }}>Courses disponibles</h3></div>
        <div style={{ padding: '6px 16px 0', display: 'flex', flexDirection: 'column', gap: 11 }}>
          {DATA.courses.map((c) => (
            <div className="card" key={c.id} style={{ padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="thumb thumb-lg"><FoodTile tone={c.tone} cap="" /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <b style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>{c.resto}</b>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', fontFamily: 'ui-monospace,Menlo,monospace', marginTop: 2 }}>{c.id}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--forest)' }}>+{fcfa(c.pay)}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-3)', fontWeight: 600 }}>{c.dist}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: 'var(--ink-2)', margin: '12px 0', fontWeight: 600 }}>
                <Icon name="mapPin" size={15} style={{ color: 'var(--terra)' }} />{c.addr}
              </div>
              <Button variant="primary" block size="sm" icon="check">Accepter la course</Button>
            </div>
          ))}
        </div>
        <div style={{ height: 86 }} />
      </div>
      <DelNav active={0} />
    </>
  );
}

/* --- Active course --- */
function DeliveryActive() {
  return (
    <>
      <div className="screen-scroll">
        <div style={{ position: 'relative', height: 220 }}>
          <FoodTile tone="fresh" cap="" style={{ height: '100%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(255,255,255,.08) 0 1px, transparent 1px 34px), repeating-linear-gradient(90deg, rgba(255,255,255,.08) 0 1px, transparent 1px 34px)' }} />
          <button className="m-back" style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(251,245,233,.92)' }}><Icon name="chevronLeft" size={20} /></button>
          <div style={{ position: 'absolute', left: '32%', top: '40%', width: 18, height: 18, borderRadius: 999, background: 'var(--terra)', boxShadow: '0 0 0 6px rgba(192,69,26,.28)' }} />
          <div style={{ position: 'absolute', left: '68%', top: '66%', color: 'var(--forest)' }}><Icon name="mapPin" size={28} /></div>
        </div>
        <div style={{ padding: '16px 16px 0', marginTop: -28, position: 'relative' }}>
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Badge status="active" />
              <span style={{ marginLeft: 'auto', fontFamily: 'ui-monospace,Menlo,monospace', fontSize: 12.5, color: 'var(--ink-3)' }}>YN-3041</span>
            </div>
            <div className="timeline" style={{ marginTop: 16 }}>
              <div className="tl-step done"><div className="tl-rail"><div className="tl-dot done"><Icon name="check" size={16} stroke={2.4} /></div><div className="tl-line done" /></div><div className="tl-body"><b>Récupérée chez Chez Aminata</b><small>13:38</small></div></div>
              <div className="tl-step now"><div className="tl-rail"><div className="tl-dot now"><Icon name="bike" size={16} /></div></div><div className="tl-body"><b>En route · Village H, Ch. 12</b><small>0,8 km · ~6 min</small></div></div>
            </div>
          </div>
        </div>
        <div style={{ padding: '14px 16px 0' }}>
          <div className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="avatar">A</span>
            <div style={{ flex: 1 }}><b style={{ fontSize: 14.5 }}>Awa Diop</b><div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Client · Village H</div></div>
            <button className="icon-btn" style={{ background: 'var(--forest-tint)', color: 'var(--forest)', boxShadow: 'inset 0 0 0 1.5px var(--forest-soft)' }}><Icon name="phone" size={18} /></button>
          </div>
        </div>
        <div style={{ height: 96 }} />
      </div>
      <div style={{ position: 'absolute', left: 14, right: 14, bottom: 16, zIndex: 55 }}>
        <Button variant="primary" size="lg" block icon="checkCircle">Marquer comme livrée</Button>
      </div>
    </>
  );
}

/* --- History --- */
function DeliveryHistory() {
  return (
    <>
      <div className="topbar"><h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>Historique</h2>
        <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 4, fontWeight: 600 }}>3 courses · <span style={{ color: 'var(--forest)', fontWeight: 800 }}>{fcfa(3700)}</span> aujourd'hui</div>
      </div>
      <div className="screen-scroll">
        <div style={{ padding: '14px 16px 0', display: 'flex', flexDirection: 'column', gap: 11 }}>
          {DATA.history.map((h) => (
            <div className="card" key={h.id} style={{ padding: 13, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="thumb thumb-lg"><FoodTile tone={h.tone} cap="" /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <b style={{ fontSize: 14.5, fontWeight: 700 }}>{h.resto}</b>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="mapPin" size={13} />{h.addr}</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 3 }}>{h.date}</div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--forest)' }}>+{fcfa(h.pay)}</div>
            </div>
          ))}
        </div>
        <div style={{ height: 86 }} />
      </div>
      <DelNav active={1} />
    </>
  );
}

/* --- Delivery profile --- */
function DeliveryProfile() {
  const [online, setOnline] = useDel(true);
  return (
    <>
      <div className="screen-scroll">
        <div className="prof-hero">
          <div className="prof-ava" style={{ background: 'linear-gradient(145deg,var(--indigo),#283C72)' }}>M</div>
          <div className="prof-name">Modou Fall</div>
          <div className="prof-mail">modou@livr.sn · Vélo</div>
        </div>
        <div className="prof-stats">
          <div className="prof-stat"><b>214</b><small>LIVRAISONS</small></div>
          <div className="prof-stat"><b>★ 4.9</b><small>NOTE</small></div>
          <div className="prof-stat"><b>98%</b><small>À TEMPS</small></div>
        </div>
        <div style={{ padding: '4px 16px 0' }}>
          <div className="card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="mi" style={{ width: 38, height: 38, borderRadius: 11, display: 'grid', placeItems: 'center', background: 'var(--forest-tint)', color: 'var(--forest)' }}><Icon name="power" size={18} /></span>
            <div style={{ flex: 1 }}><b style={{ fontSize: 14, fontWeight: 700 }}>Disponibilité</b><div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Reçois de nouvelles courses</div></div>
            <Toggle on={online} onClick={() => setOnline(!online)} />
          </div>
        </div>
        <div className="menu-list">
          <button className="menu-row"><span className="mi"><Icon name="wallet" size={18} /></span><span className="mt">Mes gains</span><span className="ar"><Icon name="chevronRight" size={18} /></span></button>
          <button className="menu-row"><span className="mi"><Icon name="bike" size={18} /></span><span className="mt">Mon véhicule</span><span className="ar"><Icon name="chevronRight" size={18} /></span></button>
          <button className="menu-row"><span className="mi"><Icon name="headphones" size={18} /></span><span className="mt">Aide & support</span><span className="ar"><Icon name="chevronRight" size={18} /></span></button>
          <button className="menu-row"><span className="mi" style={{ background: 'var(--clay-tint)', color: 'var(--clay)', boxShadow: 'none' }}><Icon name="logout" size={18} /></span><span className="mt" style={{ color: 'var(--clay)' }}>Déconnexion</span></button>
        </div>
        <div style={{ height: 86 }} />
      </div>
      <DelNav active={2} />
    </>
  );
}

Object.assign(window, { DeliveryDashboard, DeliveryActive, DeliveryHistory, DeliveryProfile });
