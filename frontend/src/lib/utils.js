export function fcfa(amount) {
  const n = Number(amount || 0).toLocaleString('fr-FR');
  // Normalize any whitespace separator (incl. narrow/no-break space) to a regular space.
  return n.replace(/\s/g, ' ') + ' FCFA';
}

export function formatCurrency(amount) {
  return fcfa(amount);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function truncate(text, length) {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
}
