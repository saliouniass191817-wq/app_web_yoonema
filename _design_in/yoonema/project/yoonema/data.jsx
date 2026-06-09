/* Yoonema — shared mock data */
window.DATA = {
  restaurants: [
    { id: 1, name: 'Chez Aminata', desc: 'Cuisine sénégalaise maison, thiéboudienne & yassa.', tone: 'thieb', dish: 'thiéboudienne', rating: 4.8, time: 18, fee: 500, open: true, orders: 142, rev: 'CFA 1.2M' },
    { id: 2, name: 'Dakar Grill', desc: 'Grillades au feu de bois, dibi & brochettes.', tone: 'grill', dish: 'dibi', rating: 4.6, time: 25, fee: 700, open: true, orders: 98, rev: 'CFA 840k' },
    { id: 3, name: 'Le Thiéboudienne', desc: 'Le plat national, riz rouge et poisson frais.', tone: 'yassa', dish: 'yassa poulet', rating: 4.9, time: 22, fee: 0, open: true, orders: 167, rev: 'CFA 1.5M' },
    { id: 4, name: 'Teranga Pizza', desc: 'Pizzas au four, pâte fine, garnitures locales.', tone: 'pizza', dish: 'pizza thiof', rating: 4.4, time: 30, fee: 800, open: false, orders: 61, rev: 'CFA 520k' },
  ],
  menu: [
    { id: 1, category: 'Plat du jour', name: 'Thiéboudienne rouge', desc: 'Riz au poisson, légumes mijotés et sauce tomate.', price: 2500, tone: 'thieb', dish: 'thiéboudienne', avail: true },
    { id: 2, category: 'Grillade', name: 'Yassa poulet', desc: 'Poulet mariné aux oignons confits et citron vert.', price: 2000, tone: 'yassa', dish: 'yassa', avail: true },
    { id: 3, category: 'Boisson', name: 'Bissap maison', desc: "Infusion d'hibiscus glacée, menthe fraîche.", price: 500, tone: 'drink', dish: 'bissap', avail: true },
    { id: 4, category: 'Dessert', name: 'Thiakry', desc: 'Couscous sucré au lait caillé et vanille.', price: 1000, tone: 'sweet', dish: 'thiakry', avail: false },
  ],
  orders: [
    { id: 'YN-3041', client: 'Awa Diop', resto: 'Chez Aminata', items: 3, total: 8500, status: 'pending', time: 'Il y a 2 min', tone: 'thieb' },
    { id: 'YN-3040', client: 'Modou Fall', resto: 'Dakar Grill', items: 2, total: 4200, status: 'active', time: 'Il y a 8 min', tone: 'grill' },
    { id: 'YN-3039', client: 'Fatou Sow', resto: 'Le Thiéboudienne', items: 1, total: 2500, status: 'active', time: 'Il y a 14 min', tone: 'yassa' },
    { id: 'YN-3038', client: 'Cheikh Ba', resto: 'Chez Aminata', items: 4, total: 11000, status: 'done', time: 'Il y a 32 min', tone: 'thieb' },
    { id: 'YN-3037', client: 'Aïssatou Ndiaye', resto: 'Teranga Pizza', items: 2, total: 6400, status: 'cancel', time: 'Il y a 51 min', tone: 'pizza' },
    { id: 'YN-3036', client: 'Ousmane Sy', resto: 'Dakar Grill', items: 3, total: 7100, status: 'done', time: 'Il y a 1 h', tone: 'grill' },
  ],
  users: [
    { name: 'Awa Diop', role: 'Étudiant', mail: 'awa@univ.sn', joined: '12 mai', status: 'Actif', color: 'var(--terra)' },
    { name: 'Chez Aminata', role: 'Vendeur', mail: 'aminata@resto.sn', joined: '04 avr', status: 'Actif', color: 'var(--forest)' },
    { name: 'Modou Fall', role: 'Livreur', mail: 'modou@livr.sn', joined: '22 avr', status: 'Actif', color: 'var(--indigo)' },
    { name: 'Fatou Sow', role: 'Étudiant', mail: 'fatou@univ.sn', joined: '30 mai', status: 'Suspendu', color: 'var(--gold-deep)' },
    { name: 'Dakar Grill', role: 'Vendeur', mail: 'grill@resto.sn', joined: '18 mar', status: 'Actif', color: 'var(--clay)' },
  ],
  courses: [
    { id: 'YN-3041', resto: 'Chez Aminata', addr: 'Village H · Chambre 12', pay: 1200, dist: '0,8 km', status: 'ready', tone: 'thieb' },
    { id: 'YN-3035', resto: 'Le Thiéboudienne', addr: 'Pavillon B · Chambre 04', pay: 900, dist: '1,2 km', status: 'ready', tone: 'yassa' },
  ],
  history: [
    { id: 'YN-3030', resto: 'Dakar Grill', addr: 'Village A · Ch. 22', pay: 1000, date: "Aujourd'hui 13:40", tone: 'grill' },
    { id: 'YN-3028', resto: 'Chez Aminata', addr: 'Pavillon C · Ch. 08', pay: 1200, date: "Aujourd'hui 12:15", tone: 'thieb' },
    { id: 'YN-3021', resto: 'Teranga Pizza', addr: 'Village H · Ch. 31', pay: 1500, date: 'Hier 19:50', tone: 'pizza' },
  ],
  notifs: [
    { icon: 'checkCircle', tone: 'var(--forest)', bg: 'var(--forest-tint)', title: 'Commande livrée', body: 'Ta commande YN-3038 chez Chez Aminata a été livrée. Bon appétit !', time: 'Il y a 5 min', unread: true },
    { icon: 'bike', tone: 'var(--indigo)', bg: 'var(--indigo-tint)', title: 'Livreur en route', body: 'Modou arrive dans 6 minutes avec ta commande.', time: 'Il y a 18 min', unread: true },
    { icon: 'gift', tone: 'var(--gold-deep)', bg: 'var(--gold-tint)', title: '-15% ce midi', body: 'Profite de 15% chez Le Thiéboudienne jusqu’à 14h.', time: 'Il y a 2 h', unread: false },
    { icon: 'star', tone: 'var(--terra)', bg: 'var(--terra-tint)', title: 'Note ta commande', body: 'Comment était ton repas chez Dakar Grill ?', time: 'Hier', unread: false },
  ],
};
