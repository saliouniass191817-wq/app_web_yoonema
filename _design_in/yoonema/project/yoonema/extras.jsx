/* Yoonema — Rating screen + Payment bottom-sheet */
const { useState: useEx } = React;

const RATE_WORDS = ['', 'Décevant', 'Moyen', 'Bien', 'Très bien', 'Excellent !'];

function StarRating({ value, onRate, size = 30 }) {
  const [hover, setHover] = useEx(0);
  const shown = hover || value;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div className="stars" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} className={`star-btn ${n <= shown ? 'on' : ''}`} onMouseEnter={() => setHover(n)} onClick={() => onRate(n)} aria-label={`${n} étoiles`}>
            <Icon name="star" size={size} />
          </button>
        ))}
      </div>
      {shown > 0 && <span className="rate-result">{RATE_WORDS[shown]}</span>}
    </div>
  );
}

function StudentRating() {
  const [resto, setResto] = useEx(0);
  const [livr, setLivr] = useEx(0);
  return (
    <div className="screen-scroll">
      <MHead title="Évaluer ta commande" />
      <div style={{ padding: '0 18px 6px' }}>
        <p style={{ color: 'var(--ink-2)', fontSize: 13.5, marginTop: -4 }}>Ton avis aide les autres étudiants du campus.</p>
      </div>
      <div style={{ padding: '8px 16px 0' }}>
        <div className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="thumb thumb-lg"><FoodTile tone="thieb" cap="" /></span>
          <div style={{ flex: 1 }}>
            <b style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>Chez Aminata</b>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2, fontFamily: 'ui-monospace,Menlo,monospace' }}>YN-3038 · Livrée</div>
          </div>
        </div>
      </div>
      <div style={{ padding: '14px 16px 0' }}>
        <div className="card" style={{ padding: 16 }}>
          <b style={{ fontSize: 15, fontWeight: 700 }}>Le restaurant</b>
          <p style={{ fontSize: 12.5, color: 'var(--ink-3)', margin: '2px 0 12px' }}>Comment était ton repas ?</p>
          <StarRating value={resto} onRate={setResto} />
        </div>
      </div>
      <div style={{ padding: '12px 16px 0' }}>
        <div className="card" style={{ padding: 16 }}>
          <b style={{ fontSize: 15, fontWeight: 700 }}>La livraison</b>
          <p style={{ fontSize: 12.5, color: 'var(--ink-3)', margin: '2px 0 12px' }}>Modou · arrivé à l'heure ?</p>
          <StarRating value={livr} onRate={setLivr} />
        </div>
      </div>
      <div style={{ padding: '12px 16px 0' }}>
        <div className="card" style={{ padding: 16 }}>
          <b style={{ fontSize: 15, fontWeight: 700, display: 'block', marginBottom: 10 }}>Commentaire <span style={{ fontWeight: 500, color: 'var(--ink-3)' }}>(optionnel)</span></b>
          <textarea className="rate-ta" rows="3" placeholder="Partage ton expérience…" />
        </div>
      </div>
      <div style={{ padding: '16px 16px 0', display: 'flex', gap: 10 }}>
        <Button variant="ghost" style={{ flex: 1 }}>Ignorer</Button>
        <Button variant="primary" icon="send" style={{ flex: 2 }}>Envoyer l'avis</Button>
      </div>
      <div style={{ height: 22 }} />
    </div>
  );
}

/* ---------- Payment bottom-sheet ---------- */
const PAY_METHODS = [
  { id: 'wave', name: 'Wave', sub: 'Paiement mobile instantané', color: '#1DC1F0', icon: 'flame' },
  { id: 'om', name: 'Orange Money', sub: 'Compte Orange Money', color: '#F0820E', icon: 'wallet' },
  { id: 'card', name: 'Carte bancaire', sub: 'Visa · Mastercard', color: 'var(--indigo)', icon: 'card' },
  { id: 'cash', name: 'Espèces', sub: 'À la livraison', color: 'var(--forest)', icon: 'truck' },
];
const PAY_TOTAL = 4500;

function PaymentScreen() {
  const [sel, setSel] = useEx('wave');
  const [paid, setPaid] = useEx(false);

  return (
    <div className="phone-screen" style={{ position: 'relative' }}>
      {/* faded cart recap behind */}
      <div style={{ filter: 'saturate(.9)', pointerEvents: 'none', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div className="m-head"><button className="m-back"><Icon name="chevronLeft" size={20} /></button><h2>Paiement</h2></div>
        <div style={{ padding: '4px 16px' }}>
          <div className="card grain" style={{ padding: 16 }}>
            <div className="sum-row">Sous-total<span className="v">{fcfa(4000)}</span></div>
            <div className="sum-row">Livraison<span className="v">{fcfa(500)}</span></div>
            <div className="sum-row total">Total<span>{fcfa(PAY_TOTAL)}</span></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, color: 'var(--ink-3)', fontSize: 12.5, fontWeight: 600 }}>
            <Icon name="mapPin" size={15} style={{ color: 'var(--terra)' }} />Village H · Chambre 12
          </div>
        </div>
      </div>

      {!paid ? (
        <>
          <div className="sheet-scrim" />
          <div className="sheet">
            <div className="sheet-grip" />
            <h3>Choisis ton paiement</h3>
            <p style={{ fontSize: 12.5, color: 'var(--ink-3)', margin: '3px 0 14px' }}>Paiement sécurisé · {fcfa(PAY_TOTAL)} à régler</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {PAY_METHODS.map((m) => (
                <button key={m.id} className={`pay-method ${sel === m.id ? 'on' : ''}`} onClick={() => setSel(m.id)}>
                  <span className="pay-logo" style={{ background: m.color }}><Icon name={m.icon} size={22} /></span>
                  <span className="pay-name"><b>{m.name}</b><small>{m.sub}</small></span>
                  <span className="radio"><i /></span>
                </button>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <Button variant="primary" size="lg" block icon="lock" onClick={() => setPaid(true)}>
                Payer {fcfa(PAY_TOTAL)}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="sheet-scrim" style={{ background: 'rgba(28,16,8,.6)' }} />
          <div className="sheet" style={{ textAlign: 'center', paddingBottom: 26 }}>
            <div className="sheet-grip" />
            <div className="success-ring" style={{ width: 88, height: 88, margin: '8px auto 16px' }}>
              <div className="core" style={{ width: 60, height: 60 }}><Icon name="check" size={30} stroke={2.6} /></div>
            </div>
            <h3>Paiement confirmé</h3>
            <p style={{ fontSize: 13.5, color: 'var(--ink-2)', margin: '8px 0 16px', lineHeight: 1.5 }}>
              {fcfa(PAY_TOTAL)} réglés via <b style={{ color: 'var(--ink)' }}>{PAY_METHODS.find((m) => m.id === sel).name}</b>.<br />Ta commande est en préparation.
            </p>
            <Button variant="primary" size="lg" block icon="bike" onClick={() => setPaid(false)}>Suivre ma commande</Button>
          </div>
        </>
      )}
    </div>
  );
}

/* PaymentScreen renders its own .phone-screen, so wrap differently in the stage */
function PaymentPhone() {
  return (
    <div>
      <div className="phone"><div className="phone-notch" /><PaymentScreen /></div>
      <div className="phone-label">Paiement · <span>Wave / Orange Money</span></div>
    </div>
  );
}

Object.assign(window, { StarRating, StudentRating, PaymentScreen, PaymentPhone });
