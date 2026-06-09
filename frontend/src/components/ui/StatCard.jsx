import React from 'react';
import { Icon } from './Icon';

const TONE_BG = {
  brand: 'var(--terra)',
  success: 'var(--forest)',
  info: 'var(--indigo)',
  warning: 'var(--gold)',
  gray: 'var(--ink-3)',
};

export function StatCard({ icon, label, value, hint, tone = 'brand', delta, loading = false }) {
  return (
    <div className="stat">
      {icon && (
        <div className="tile" style={{ background: TONE_BG[tone] || TONE_BG.brand }}>
          <Icon name={icon} size={20} />
        </div>
      )}
      <div className="lbl">{label}</div>
      <div className="val">
        {loading ? <span style={{ opacity: 0.4 }}>···</span> : value}
      </div>
      {delta ? (
        <div className={`delta ${delta.dir === 'down' ? 'down' : 'up'}`}>
          <Icon name={delta.dir === 'down' ? 'arrowDown' : 'arrowUp'} size={13} />
          {delta.text}
        </div>
      ) : hint ? (
        <div className="lbl" style={{ marginTop: 9, fontWeight: 600 }}>{hint}</div>
      ) : null}
    </div>
  );
}

export default StatCard;
