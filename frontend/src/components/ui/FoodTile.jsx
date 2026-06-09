import React from 'react';

// Warm duotone gradients keyed to dish tones (from the Teranga design).
export const FOOD_TONES = {
  thieb: 'linear-gradient(150deg, #C0451A 0%, #7E2A0B 100%)',
  yassa: 'linear-gradient(150deg, #D38A1E 0%, #9B5410 100%)',
  grill: 'linear-gradient(150deg, #8A3A12 0%, #3A1606 100%)',
  fresh: 'linear-gradient(150deg, #2E7A57 0%, #16412F 100%)',
  pizza: 'linear-gradient(150deg, #C2531A 0%, #8E2A12 100%)',
  drink: 'linear-gradient(150deg, #4A6BB0 0%, #283C72 100%)',
  sweet: 'linear-gradient(150deg, #C97B8E 0%, #7E3A4E 100%)',
  bowl: 'linear-gradient(150deg, #B0791E 0%, #5E3A0E 100%)',
};

const TONE_KEYS = Object.keys(FOOD_TONES);

// Deterministic tone from any string so each dish keeps a stable color.
export function toneFor(seed = '') {
  let h = 0;
  const s = String(seed);
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return TONE_KEYS[h % TONE_KEYS.length];
}

export function FoodTile({ src, tone, seed, cap, className = '', style }) {
  if (src) {
    return (
      <div className={`food ${className}`} style={style}>
        <img src={src} alt={cap || ''} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
        {cap && <span className="food-cap">{cap}</span>}
      </div>
    );
  }
  const t = tone || toneFor(seed || cap || '');
  return (
    <div className={`food ${className}`} style={{ background: FOOD_TONES[t] || FOOD_TONES.thieb, ...style }}>
      <div className="food-plate"><div className="inner" /></div>
      {cap && <span className="food-cap">{cap}</span>}
    </div>
  );
}

export default FoodTile;
