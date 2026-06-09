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
  { key: 'student', title: 'Étudiant', subtitle: 'Commander des repas', icon: 'bag', color: 'var(--terra)' },
  { key: 'vendor', title: 'Vendeur / Restaurant', subtitle: 'Gérer mon restaurant', icon: 'store', color: 'var(--forest)' },
  { key: 'delivery', title: 'Livreur', subtitle: 'Livrer des commandes', icon: 'bike', color: 'var(--indigo)' },
];

function Brand() {
  return (
    <div className="brand-logo" style={{ color: 'var(--ink)', marginBottom: 22 }}>
      <span className="mark" style={{ background: 'var(--terra)', boxShadow: 'var(--shadow-terra)', color: '#fff' }}>
        <Icon name="utensils" size={22} />
      </span>
      Yoonema
    </div>
  );
}

const wrapStyle = { minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 };
const cardStyle = { width: '100%', maxWidth: 440, padding: '32px 30px' };

export default function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  if (role) {
    const titles = { student: 'Inscription étudiant', vendor: 'Inscription vendeur', delivery: 'Inscription livreur' };
    return <RegisterForm title={titles[role]} role={role} onBack={() => setRole(null)} />;
  }

  return (
    <div style={wrapStyle}>
      <div className="card grain" style={cardStyle}>
        <Brand />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--ink)' }}>Créer un compte</h1>
        <p style={{ color: 'var(--ink-2)', marginTop: 6, fontSize: 15 }}>Choisis ton rôle pour commencer.</p>

        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ROLES.map((item) => (
            <button key={item.key} className="quick" onClick={() => setRole(item.key)} style={{ padding: 14 }}>
              <span className="qi" style={{ background: item.color, width: 42, height: 42, borderRadius: 12 }}>
                <Icon name={item.icon} size={20} />
              </span>
              <span className="qmeta" style={{ flex: 1 }}>
                <b style={{ fontSize: 15 }}>{item.title}</b>
                <small>{item.subtitle}</small>
              </span>
              <Icon name="chevronRight" size={18} style={{ color: 'var(--ink-3)' }} />
            </button>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-2)', marginTop: 22 }}>
          Déjà un compte ?{' '}
          <button onClick={() => navigate('/login')} style={{ color: 'var(--terra)', fontWeight: 700, background: 'none', border: 'none' }}>
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
  const strengthColor = ['var(--clay)', 'var(--clay)', 'var(--gold)', 'var(--forest)', 'var(--forest)'][passwordStrength];

  return (
    <div style={{ ...wrapStyle, padding: '40px 24px' }}>
      <div className="card grain" style={cardStyle}>
        <button
          type="button"
          onClick={onBack}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--ink-2)', background: 'none', border: 'none', marginBottom: 14 }}
        >
          <Icon name="chevronRight" size={16} style={{ transform: 'rotate(180deg)' }} />
          Changer de rôle
        </button>

        <Brand />
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--ink)' }}>{title}</h2>

        {errors.general && (
          <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 12, background: 'var(--clay-tint)', color: 'var(--clay)', fontSize: 13, display: 'flex', gap: 8, alignItems: 'center' }}>
            <Icon name="x" size={16} />{errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Nom complet" name="name" value={formData.name} onChange={handleChange} error={errors.name} placeholder="Awa Traoré" />
          <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="toi@univ.sn" />
          <Input label="Téléphone" type="tel" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} placeholder="77 123 45 67" />
          <Input label="Adresse (optionnel)" name="address" value={formData.address} onChange={handleChange} error={errors.address} placeholder="Village H, chambre 12" />
          <Input label="Mot de passe" type="password" name="password" value={formData.password} onChange={handleChange} error={errors.password} placeholder="••••••••" />

          {formData.password && (
            <div>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} style={{ height: 6, flex: 1, borderRadius: 999, background: i < passwordStrength ? strengthColor : 'var(--hairline)' }} />
                ))}
              </div>
              <p style={{ marginTop: 6, fontSize: 12, color: 'var(--ink-3)' }}>Sécurité : {strengthLabels[passwordStrength]}</p>
            </div>
          )}

          <Input label="Confirmer le mot de passe" type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} error={errors.password_confirmation} placeholder="••••••••" />

          <Button type="submit" loading={loading} size="lg" className="w-full">Créer mon compte</Button>
        </form>
      </div>
    </div>
  );
}
