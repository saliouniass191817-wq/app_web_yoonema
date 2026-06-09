/* Lucide-style inline icon set for Yoonema */
const ICON_PATHS = {
  search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>,
  bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a2 2 0 0 0 3.4 0" /></>,
  home: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></>,
  bag: <><path d="M6 7h12l-1 14H7L6 7z" /><path d="M9 7a3 3 0 0 1 6 0" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" /></>,
  star: <path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 17l-5.3 2.6 1-5.8L3.5 9.7l5.9-.9L12 3.5z" />,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  bike: <><circle cx="6" cy="17" r="3" /><circle cx="18" cy="17" r="3" /><path d="M6 17l4-8h4l2 4M9 9h4" /></>,
  plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  minus: <path d="M5 12h14" />,
  store: <><path d="M4 9l1-5h14l1 5" /><path d="M4 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" /><path d="M5 11v9h14v-9" /></>,
  wallet: <><path d="M4 7h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4z" /><path d="M4 7V5h12" /><circle cx="17" cy="13" r="1.4" /></>,
  utensils: <><path d="M7 3v8a2 2 0 0 0 4 0V3M9 3v18" /><path d="M16 3c-1.5 0-2.5 2-2.5 5 0 2 1 3 2.5 3v10" /></>,
  heart: <path d="M12 20s-7-4.5-9.2-9C1.5 8 3 5 6 5c2 0 3 1.3 3.7 2.3C10.5 6.3 11.5 5 13.5 5c3 0 4.5 3 3.2 6-2.2 4.5-9.2 9-9.2 9z" transform="translate(.3 0)" />,
  chevronLeft: <path d="M15 5l-7 7 7 7" />,
  chevronRight: <path d="M9 5l7 7-7 7" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M4 7l8 6 8-6" /></>,
  lock: <><rect x="5" y="11" width="14" height="9" rx="2.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  mapPin: <><path d="M12 21c5-5 7-8 7-11a7 7 0 1 0-14 0c0 3 2 6 7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
  flame: <path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-1 .5-2 1-2.5C8 11 7 13 7 15a5 5 0 0 0 10 0c0-5-5-7-5-12z" />,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  truck: <><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="2" /><circle cx="17.5" cy="17.5" r="2" /></>,
  grid: <><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" /></>,
  list: <><path d="M8 6h12M8 12h12M8 18h12" /><circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" /></>,
  chart: <><path d="M4 20V4" /><path d="M4 20h16" /><rect x="7" y="11" width="3" height="6" rx="1" /><rect x="12" y="7" width="3" height="10" rx="1" /><rect x="17" y="13" width="3" height="4" rx="1" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M12 2.5v3M12 18.5v3M4.2 7l2.6 1.5M17.2 15.5l2.6 1.5M4.2 17l2.6-1.5M17.2 8.5l2.6-1.5" /></>,
  logout: <><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" /><path d="M10 12H3m0 0l3-3m-3 3l3 3" /></>,
  users: <><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" /><path d="M16 5.2a3.2 3.2 0 0 1 0 6M18 20c0-2.6-1-4.2-3-5" /></>,
  receipt: <><path d="M5 3h14v18l-2.5-1.5L14 21l-2-1.5L10 21l-2.5-1.5L5 21z" /><path d="M9 8h6M9 12h6" /></>,
  phone: <path d="M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  chevronDown: <path d="M5 9l7 7 7-7" />,
  filter: <path d="M3 5h18l-7 8v5l-4 2v-7z" />,
  edit: <><path d="M4 20h4l10-10-4-4L4 16z" /><path d="M14 6l4 4" /></>,
  trash: <><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" /></>,
  eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>,
  package: <><path d="M3 7l9-4 9 4v10l-9 4-9-4z" /><path d="M3 7l9 4 9-4M12 11v10" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="16" rx="2.5" /><path d="M3.5 9.5h17M8 3v4M16 3v4" /></>,
  arrowUp: <path d="M12 19V5m0 0l-6 6m6-6l6 6" />,
  arrowDown: <path d="M12 5v14m0 0l6-6m-6 6l-6-6" />,
  more: <><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></>,
  card: <><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3 10h18" /></>,
  checkCircle: <><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-5" /></>,
  gift: <><rect x="4" y="9" width="16" height="11" rx="1.5" /><path d="M2.5 9h19v3.5h-19zM12 9v11M12 9s-1-4-3.5-4S6 8 12 9zM12 9s1-4 3.5-4S18 8 12 9z" /></>,
  headphones: <><path d="M4 13a8 8 0 0 1 16 0" /><rect x="3" y="13" width="4" height="7" rx="1.5" /><rect x="17" y="13" width="4" height="7" rx="1.5" /></>,
  image: <><rect x="3.5" y="4.5" width="17" height="15" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M5 18l5-5 4 3 3-2 3 4" /></>,
  trending: <path d="M3 17l6-6 4 4 8-8m0 0h-5m5 0v5" />,
  send: <path d="M21 4L3 11l7 3 3 7z" />,
  shield: <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="M9 12l2 2 4-4" /></>,
  power: <><path d="M12 3v8" /><path d="M6.5 7a8 8 0 1 0 11 0" /></>,
};

function Icon({ name, size = 22, stroke = 2, fill = "none", className = "", style }) {
  const path = ICON_PATHS[name];
  if (!path) return null;
  const solid = name === "star" || name === "heart" || name === "flame";
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill={solid ? "currentColor" : fill}
      stroke={solid ? "none" : "currentColor"}
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      className={className} style={style} aria-hidden="true"
    >
      {path}
    </svg>
  );
}

window.Icon = Icon;
