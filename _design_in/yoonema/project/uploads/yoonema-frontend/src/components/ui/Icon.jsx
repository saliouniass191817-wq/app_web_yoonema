import React from 'react';

// Lucide-style stroke icons. Single source so nav, cards and buttons share
// one consistent icon vocabulary (no emoji). Color follows `currentColor`.
const paths = {
  home: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></>,
  bag: <><path d="M6 7h12l1 13H5L6 7Z" /><path d="M9 7a3 3 0 0 1 6 0" /></>,
  bell: <><path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  list: <><path d="M8 6h13" /><path d="M8 12h13" /><path d="M8 18h13" /><path d="M3 6h.01M3 12h.01M3 18h.01" /></>,
  chart: <><path d="M3 3v18h18" /><rect x="7" y="11" width="3" height="6" rx="1" /><rect x="12" y="7" width="3" height="10" rx="1" /><rect x="17" y="13" width="3" height="4" rx="1" /></>,
  utensils: <><path d="M4 3v7a2 2 0 0 0 2 2v9" /><path d="M7 3v6" /><path d="M10 3v6" /><path d="M18 3c-1.5 0-3 1.8-3 5s1 4 1.5 4H18v9" /></>,
  store: <><path d="M4 9 5 4h14l1 5" /><path d="M4 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" /><path d="M5 11v9h14v-9" /></>,
  bike: <><circle cx="6" cy="18" r="3" /><circle cx="18" cy="18" r="3" /><path d="M6 18 10 7h3l3 11" /><path d="M9 7h5" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 5a3.5 3.5 0 0 1 0 7" /><path d="M17 14.5a6.5 6.5 0 0 1 4.5 5.5" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m21 21-3.5-3.5" /></>,
  star: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8-4.3-4.1 5.9-.9L12 3.5Z" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  minus: <path d="M5 12h14" />,
  logout: <><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" /><path d="M10 17l5-5-5-5" /><path d="M15 12H3" /></>,
  chevronRight: <path d="m9 6 6 6-6 6" />,
  mapPin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
  check: <path d="M5 12.5 10 17.5 19.5 7" />,
  x: <><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>,
  sliders: <><path d="M4 6h10" /><path d="M18 6h2" /><path d="M4 12h4" /><path d="M12 12h8" /><path d="M4 18h12" /><path d="M18 18h2" /><circle cx="14" cy="6" r="2" /><circle cx="8" cy="12" r="2" /><circle cx="14" cy="18" r="2" /></>,
  wallet: <><path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1" /><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6H7a2 2 0 0 1 0-4" /><circle cx="17" cy="13" r="1" /></>,
  receipt: <><path d="M5 3v18l2-1 2 1 2-1 2 1 2-1 2 1V3l-2 1-2-1-2 1-2-1-2 1-2-1Z" /><path d="M8 8h8" /><path d="M8 12h8" /></>,
  phone: <path d="M5 4h3l2 5-2 1a11 11 0 0 0 5 5l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
};

export function Icon({ name, size = 22, strokeWidth = 1.75, className = '', ...props }) {
  const d = paths[name];
  if (!d) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {d}
    </svg>
  );
}

export default Icon;
