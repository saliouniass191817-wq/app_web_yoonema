import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';

const TEST_ACCOUNTS = [
  { role: 'Étudiant', email: 'student@test.com', icon: 'user', color: 'var(--terra)' },
  { role: 'Vendeur', email: 'vendor@test.com', icon: 'store', color: 'var(--forest)' },
  { role: 'Livreur', email: 'delivery@test.com', icon: 'bike', color: 'var(--indigo)' },
  { role: 'Admin', email: 'admin@test.com', icon: 'shield', color: 'var(--gold-deep)' },
];

const FEATURES = [
  { icon: 'store', text: 'Les restos du campus, au même endroit' },
  { icon: 'bike', text: 'Livraison rapide par des étudiants' },
  { icon: 'wallet', text: 'Paiement mobile sécurisé' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const submit = async (e, pw) => {
    if (loading) return;
    setErrors({});
    try {
      await login(e, pw);
      navigate('/');
    } catch (err) {
      const message = err.message || 'Erreur de connexion';
      setErrors({ general: message });
    }
  };

  const handleSubmit = (ev) => { ev.preventDefault(); submit(email, password); };
  const quickFill = (testEmail) => { setEmail(testEmail); setPassword('password123'); submit(testEmail, 'password123'); };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div className="login-card">
        {/* Brand panel */}
        <div className="login-brand">
          <div className="brand-logo">
            <span className="mark"><Icon name="utensils" size={22} /></span>
            Yoonema
          </div>
          <div className="brand-head">
            <h2>Le campus a faim. On s’en occupe.</h2>
            <p>Commande tes repas auprès des restaurants de l’université et fais-toi livrer en quelques minutes.</p>
            <div className="feature-list">
              {FEATURES.map((f) => (
                <div className="feature" key={f.text}>
                  <span className="fi"><Icon name={f.icon} size={18} /></span>
                  {f.text}
                </div>
              ))}
            </div>
          </div>
          <div className="brand-foot">Fait pour les étudiants universitaires.</div>
        </div>

        {/* Form */}
        <div className="login-form">
          <h3>Bon retour 👋</h3>
          <p className="lead">Connecte-toi pour commander.</p>

          {errors.general && (
            <div style={{ marginTop: 16, padding: '10px 12px', borderRadius: 12, background: 'var(--clay-tint)', color: 'var(--clay)', fontSize: 13, display: 'flex', gap: 8, alignItems: 'center' }}>
              <Icon name="x" size={16} />{errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email</label>
              <div className="inp">
                <Icon name="mail" size={18} style={{ color: 'var(--ink-3)' }} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="toi@univ.sn" autoComplete="email" required />
              </div>
            </div>
            <div className="field">
              <label>Mot de passe</label>
              <div className="inp">
                <Icon name="lock" size={18} style={{ color: 'var(--ink-3)' }} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" required />
              </div>
            </div>
            <div style={{ marginTop: 18 }}>
              <Button variant="primary" size="lg" className="w-full" type="submit" loading={loading}>
                <Icon name="flame" size={18} />Se connecter
              </Button>
            </div>
          </form>

          <div className="divider"><span className="ln" /><span>Comptes démo</span><span className="ln" /></div>
          <div className="quick-grid">
            {TEST_ACCOUNTS.map((q) => (
              <button className="quick" key={q.email} onClick={() => quickFill(q.email)} disabled={loading} type="button">
                <span className="qi" style={{ background: q.color }}><Icon name={q.icon} size={17} /></span>
                <span className="qmeta"><b>{q.role}</b><small>Connexion rapide</small></span>
              </button>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-2)', marginTop: 16 }}>
            Pas de compte ? <button onClick={() => navigate('/register')} style={{ color: 'var(--terra)', fontWeight: 700, background: 'none', border: 'none' }}>Créer un compte</button>
          </p>
        </div>
      </div>
    </div>
  );
}
