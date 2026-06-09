import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Icon } from '../../components/ui/Icon';
import { authAPI } from '../../api';
import { useAuthStore } from '../../store';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
  address: '',
};

const senegalPhoneRegex = /^(?:\+221|00221)?\s?(7[05678])\s?\d{3}\s?\d{2}\s?\d{2}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ROLES = [
  { key: 'student', title: 'Étudiant', subtitle: 'Commander des repas', icon: 'bag' },
  { key: 'vendor', title: 'Vendeur / Restaurant', subtitle: 'Gérer mon restaurant', icon: 'store' },
  { key: 'delivery', title: 'Livreur', subtitle: 'Livrer des commandes', icon: 'bike' },
];

function Brand() {
  return (
    <div className="mb-7 flex items-center gap-2.5">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-500 text-white shadow-brand-sm">
        <Icon name="utensils" size={22} strokeWidth={2} />
      </span>
      <span className="text-xl font-extrabold tracking-tight text-gray-900">Yoonema</span>
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  if (role) {
    const titles = { student: 'Inscription étudiant', vendor: 'Inscription vendeur', delivery: 'Inscription livreur' };
    return <RegisterForm title={titles[role]} role={role} onBack={() => setRole(null)} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md">
        <Brand />
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Créer un compte</h1>
        <p className="mt-1 text-gray-500">Choisis ton rôle pour commencer.</p>

        <div className="mt-6 space-y-3">
          {ROLES.map((item) => (
            <button
              key={item.key}
              onClick={() => setRole(item.key)}
              className="group flex w-full items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-card-hover"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-orange-50 text-orange-600">
                <Icon name={item.icon} size={24} strokeWidth={2} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-gray-900">{item.title}</span>
                <span className="block text-sm text-gray-500">{item.subtitle}</span>
              </span>
              <Icon name="chevronRight" size={18} className="text-gray-300 transition-colors group-hover:text-orange-500" />
            </button>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Déjà un compte ?{' '}
          <button onClick={() => navigate('/login')} className="font-semibold text-orange-600 hover:text-orange-700">
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
}

function RegisterForm({ title, role, onBack }) {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const passwordStrength = useMemo(() => {
    let score = 0;
    if (formData.password.length >= 8) score += 1;
    if (/[A-Z]/.test(formData.password)) score += 1;
    if (/[0-9]/.test(formData.password)) score += 1;
    if (/[^A-Za-z0-9]/.test(formData.password)) score += 1;
    return score;
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null, general: null }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = 'Le nom est obligatoire.';
    if (!emailRegex.test(formData.email)) nextErrors.email = 'Adresse email invalide.';
    if (!senegalPhoneRegex.test(formData.phone)) nextErrors.phone = 'Numéro sénégalais invalide.';
    if (formData.password.length < 8) nextErrors.password = 'Au moins 8 caractères.';
    if (formData.password !== formData.password_confirmation) nextErrors.password_confirmation = 'Les mots de passe ne correspondent pas.';
    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const register = {
        student: authAPI.registerStudent,
        vendor: authAPI.registerVendor,
        delivery: authAPI.registerDelivery,
      }[role];

      const response = await register(formData);

      if (!response.success) {
        setErrors({ general: response.message || 'Inscription impossible.' });
        return;
      }

      const user = response.data?.user;
      const token = response.data?.token;

      if (user && token) {
        setAuth(user, token, user.role);
        localStorage.setItem('yoonema_token', token);
        try {
          localStorage.setItem('yoonema_auth', JSON.stringify({ state: { user, token, role: user.role } }));
        } catch {
          // ignore
        }

        if (role === 'vendor') {
          navigate('/vendor/setup', { replace: true });
          return;
        }

        navigate('/', { replace: true });
        return;
      }

      navigate('/login', {
        state: { message: 'Inscription réussie, connectez-vous avec vos identifiants.' },
      });
    } catch (err) {
      setErrors(err?.errors || { general: err?.message || 'Erreur d’inscription.' });
    } finally {
      setLoading(false);
    }
  };

  const strengthLabels = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];
  const strengthColor = ['bg-danger-500', 'bg-danger-500', 'bg-warning-500', 'bg-success-500', 'bg-success-500'][passwordStrength];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6 py-10">
      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
        >
          <Icon name="chevronRight" size={16} className="rotate-180" />
          Changer de rôle
        </button>

        <Brand />
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">{title}</h2>

        {errors.general && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-danger-100 bg-danger-50 p-3 text-sm text-danger-700">
            <Icon name="x" size={18} className="mt-0.5 shrink-0" />
            <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <Input label="Nom complet" name="name" value={formData.name} onChange={handleChange} error={errors.name} placeholder="Awa Traoré" />
          <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="toi@univ.sn" />
          <Input label="Téléphone" type="tel" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} placeholder="77 123 45 67" />
          <Input label="Adresse (optionnel)" name="address" value={formData.address} onChange={handleChange} error={errors.address} placeholder="Village H, chambre 12" />
          <Input label="Mot de passe" type="password" name="password" value={formData.password} onChange={handleChange} error={errors.password} placeholder="••••••••" />

          {formData.password && (
            <div>
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${i < passwordStrength ? strengthColor : 'bg-gray-200'}`}
                  />
                ))}
              </div>
              <p className="mt-1.5 text-xs text-gray-500">Sécurité : {strengthLabels[passwordStrength]}</p>
            </div>
          )}

          <Input label="Confirmer le mot de passe" type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} error={errors.password_confirmation} placeholder="••••••••" />

          <Button type="submit" loading={loading} size="lg" className="w-full">
            Créer mon compte
          </Button>
        </form>
      </div>
    </div>
  );
}
