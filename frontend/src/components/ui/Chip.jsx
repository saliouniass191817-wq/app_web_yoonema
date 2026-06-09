import React from 'react';

export function Chip({ on = false, children, onClick }) {
  return (
    <button className={`chip ${on ? 'chip-on' : 'chip-off'}`} onClick={onClick} type="button">
      {children}
    </button>
  );
}

export default Chip;
