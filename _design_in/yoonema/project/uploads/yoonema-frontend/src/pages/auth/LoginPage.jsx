import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Icon } from '../../components/ui/Icon';

const TEST_ACCOUNTS = [
  { role: 'Étudiant', email: 'student@test.com' },
  { role: 'Vendeur', email: 'vendor@test.com' },
  { role: 'Livreur', email: 'delivery@test.com' },
  { role: 'Admin', email: 'admin@test.com' },
];

const FEATURES = [
  { icon: 'store', text: 'Les restos du campus, au même endroit' },
  { icon: 'bike', text: 'Livraison rapide par des étudiants' },
  { icon: 'wallet', text: 'Paiement mobile sécurisé' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const { error: notify } = useNotifications();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const submit = async (emailValue, passwordValue) => {
    if (loading) return;
    setErrors({});
    try {
      await login(emailValue, passwordValue);
      navigate('/');
    } catch (err) {
      const message = err.message || 'Erreur de connexion';
      notify(message);
      setErrors({ general: message });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submit(email, password);
  };

  const quickFill = (testEmail) => {
    setEmail(testEmail);
    setPassword('password123');
    submit(testEmail, 'password123');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Brand panel (desktop) */}
      <div className="relative hidden w-[44%] flex-col justify-between overflow-hidden bg-orange-600 p-12 text-white lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{ background: 'radial-gradient(120% 120% at 0% 0%, #FF8A4C 0%, #FF6B35 38%, #C83C0B 100%)' }}
        />
        <div className="relative flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 ring-1 ring-white/30">
            <Icon name="utensils" size={22} strokeWidth={2} />
          </span>
          <span className="text-xl font-extrabold tracking-tight">Yoonema</span>
        </div>

        <div className="relative">
          <h1 className="max-w-sm text-4xl font-extrabold leading-tight tracking-tight">
            Le campus a faim. On s’en occupe.
          </h1>
          <p className="mt-3 max-w-sm text-white/80">
            Commande tes repas auprès des restaurants de l’université et fais-toi livrer en quelques minutes.
          </p>

          <ul className="mt-8 space-y-3">
            {FEATURES.map((f) => (
              <li key={f.text} className="flex items-center gap-3 text-white/90">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/15 ring-1 ring-white/25">
                  <Icon name={f.icon} size={18} strokeWidth={2} />
                </span>
                {f.text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-white/70">Fait pour les étudiants universitaires.</p>
      </div>

      {/* Form */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="mb-4 flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-500 text-white shadow-brand-sm">
                <Icon name="utensils" size={22} strokeWidth={2} />
              </span>
              <span className="text-xl font-extrabold tracking-tight text-gray-900">Yoonema</span>
            </div>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Bon retour 👋</h2>
          <p className="mt-1 text-gray-500">Connecte-toi pour commander.</p>

          {errors.general && (
            <div className="mt-5 flex items-start gap-2 rounded-xl border border-danger-100 bg-danger-50 p-3 text-sm text-danger-700">
              <Icon name="x" size={18} className="mt-0.5 shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="toi@univ.sn"
              icon={<Icon name="user" size={18} />}
              autoComplete="email"
              required
            />
            <Input
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
            <Button type="submit" loading={loading} size="lg" className="w-full">
              Se connecter
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Pas encore de compte ?{' '}
            <button
              onClick={() => navigate('/register')}
              className="font-semibold text-orange-600 hover:text-orange-700"
            >
              Créer un compte
            </button>
          </p>

          {/* Quick demo accounts */}
          <div className="mt-8">
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-medium uppercase tracking-wide text-gray-400">Comptes démo</span>
              <span className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {TEST_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => quickFill(acc.email)}
                  disabled={loading}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-left transition-colors hover:border-orange-300 hover:bg-orange-50 disabled:opacity-50"
                >
                  <span className="text-sm font-semibold text-gray-800">{acc.role}</span>
                  <Icon name="chevronRight" size={16} className="text-gray-400" />
                </button>
              ))}
            </div>
            <p className="mt-2 text-center text-xs text-gray-400">Mot de passe : password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
