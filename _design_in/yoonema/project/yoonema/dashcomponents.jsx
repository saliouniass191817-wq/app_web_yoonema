/* Yoonema — dashboard & desktop chrome components */
const { useState: useDS } = React;

function DeskFrame({ url = 'yoonema.sn/dashboard', children }) {
  return (
    <div className="desk-stage">
      <div className="desk">
        <div className="desk-bar">
          <div className="desk-lights"><i style={{ background: '#FF5F57' }} /><i style={{ background: '#FEBC2E' }} /><i style={{ background: '#28C840' }} /></div>
          <div className="desk-url"><Icon name="shield" size={13} />{url}</div>
        </div>
        <div className="desk-body">{children}</div>
      </div>
    </div>
  );
}

function Sidebar({ brand, items, active, onNav, user }) {
  return (
    <aside className="side">
      <div className="side-logo">
        <span className="mark"><Icon name="utensils" size={20} /></span>
        <b>Yoonema</b>
      </div>
      <div className="side-label">{brand}</div>
      <nav className="side-nav">
        {items.map((it) => (
          <button key={it.label} className={`side-item ${it.label === active ? 'on' : ''}`} onClick={() => onNav && onNav(it.label)}>
            <Icon name={it.icon} size={19} stroke={1.9} />
            <span style={{ flex: 1 }}>{it.label}</span>
            {it.badge && <span className="badge-mini">{it.badge}</span>}
          </button>
        ))}
      </nav>
      <div className="side-user">
        <span className="ava">{user.initial}</span>
        <span className="meta"><b>{user.name}</b><small>{user.sub}</small></span>
        <button className="out" title="Déconnexion"><Icon name="logout" size={18} /></button>
      </div>
    </aside>
  );
}

function DashTop({ title, sub, search = 'Rechercher…', right }) {
  return (
    <div className="dash-top">
      <div>
        <h1>{title}</h1>
        {sub && <div className="sub">{sub}</div>}
      </div>
      <div className="dash-search">
        <Icon name="search" size={17} style={{ color: 'var(--ink-3)' }} />
        <input placeholder={search} />
      </div>
      {right}
      <button className="icon-btn" style={{ width: 42, height: 42 }}><Icon name="bell" size={19} /><span className="dot-badge">2</span></button>
    </div>
  );
}

function Stat({ icon, color, label, value, delta, up }) {
  return (
    <div className="stat">
      <div className="tile" style={{ background: color }}><Icon name={icon} size={21} /></div>
      <div className="lbl">{label}</div>
      <div className="val">{value}</div>
      {delta && <div className={`delta ${up ? 'up' : 'down'}`}><Icon name={up ? 'arrowUp' : 'arrowDown'} size={13} stroke={2.5} />{delta}</div>}
    </div>
  );
}

function Panel({ title, link, onLink, children, style, bodyStyle }) {
  return (
    <div className="panel" style={style}>
      {title && <div className="panel-head"><h3>{title}</h3>{link && <button className="link" onClick={onLink}>{link}</button>}</div>}
      <div className="panel-body" style={bodyStyle}>{children}</div>
    </div>
  );
}

function BarChart({ data, labels, alt }) {
  const max = Math.max(...data);
  return (
    <div>
      <div className="chart">
        <div className="bars">
          {data.map((v, i) => <div key={i} className={`bar ${alt && i === data.length - 2 ? 'alt' : ''}`} style={{ height: `${(v / max) * 100}%` }} title={String(v)} />)}
        </div>
      </div>
      {labels && <div className="chart-x">{labels.map((l) => <span key={l}>{l}</span>)}</div>}
    </div>
  );
}

function Donut({ segments }) {
  let acc = 0;
  const stops = segments.map((s) => { const from = acc; acc += s.pct; return `${s.color} ${from}% ${acc}%`; }).join(', ');
  const total = segments.reduce((a, b) => a + b.value, 0);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
      <div className="donut" style={{ background: `conic-gradient(${stops})` }}>
        <div className="hole"><b>{total}</b><small>total</small></div>
      </div>
      <div className="legend" style={{ flex: 1 }}>
        {segments.map((s) => (
          <div className="li" key={s.label}><span className="sw" style={{ background: s.color }} />{s.label}<span className="amt">{s.value}</span></div>
        ))}
      </div>
    </div>
  );
}

function Toggle({ on, onClick }) {
  return <button className={`toggle ${on ? 'on' : ''}`} onClick={onClick} aria-pressed={on}><i /></button>;
}

const STATUS_MAP = {
  pending: { cls: 'badge-pending', label: 'En attente' },
  active: { cls: 'badge-active', label: 'En cours' },
  done: { cls: 'badge-done', label: 'Livré' },
  cancel: { cls: 'badge-cancel', label: 'Annulé' },
};
function SBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.pending;
  return <span className={`badge ${s.cls}`}><span className="dot" />{s.label}</span>;
}

Object.assign(window, { DeskFrame, Sidebar, DashTop, Stat, Panel, BarChart, Donut, Toggle, SBadge });
