import React from 'react';
import { Icon } from './Icon';

export function Stepper({ value, onChange, min = 1 }) {
  return (
    <div className="stepper">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Diminuer">
        <Icon name="minus" size={16} />
      </button>
      <span className="q">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} aria-label="Augmenter">
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}

export default Stepper;
