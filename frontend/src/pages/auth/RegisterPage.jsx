import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
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

export default function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  if (role === 'student') {
    return <RegisterForm title="Inscription Étudiant" role="student" onBack={() => setRole(null)} />;
  }
  if (role === 'vendor') {
    return <RegisterForm title="Inscription Vendeur" role="vendor" onBack={() => setRole(null)} />;
  }
  if (role === 'delivery') {
    return <RegisterForm title="Inscription Livreur" role="delivery" onBack={() => setRole(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-500">Yoonema</h1>
          <p className="text-gray-600 mt-2">Choisissez votre rôle</p>
        </div>

        <div className="space-y-3">
          {[
            { key: 'student', title: 'Étudiant', subtitle: 'Commander des repas', icon: '🎓' },
            { key: 'vendor', title: 'Vendeur/Restaurant', subtitle: 'Gérer mon restaurant', icon: '🍴' },
            { key: 'delivery', title: 'Livreur', subtitle: 'Livrer des commandes', icon: '🚴' },
          ].map((item) => (
            <Card key={item.key} onClick={() => setRole(item.key)} className="cursor-pointer hover:shadow-lg transition-all">
              <CardBody className="py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.subtitle}</p>
                  </div>
                  <span className="text-3xl">{item.icon}</span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">Vous avez déjà un compte ?</p>
          <Button variant="ghost" onClick={() => navigate('/login')} className="mt-2">
            Se connecter
          </Button>
        </div>
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
    if (formData.password.length < 8) nextErrors.password = 'Le mot de passe doit contenir au moins 8 caractères.';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md">
        <Card>
          <CardBody>
            <button type="button" onClick={onBack} className="mb-4 text-sm font-medium text-orange-600">
              Retour
            </button>
            <h2 className="text-2xl font-bold mb-6">{title}</h2>

            {errors.general && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Nom complet *" name="name" value={formData.name} onChange={handleChange} error={errors.name} />
              <Field label="Email *" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} />
              <Field label="Téléphone *" type="tel" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} placeholder="77 123 45 67" />
              <Field label="Adresse" name="address" value={formData.address} onChange={handleChange} error={errors.address} />
              <Field label="Mot de passe *" type="password" name="password" value={formData.password} onChange={handleChange} error={errors.password} />
              <div>
                <div className="h-2 rounded-full bg-gray-200">
                  <div className="h-full rounded-full bg-orange-500 transition-all" style={{ width: `${(passwordStrength / 4) * 100}%` }} />
                </div>
                <p className="mt-1 text-xs text-gray-600">Sécurité: {strengthLabels[passwordStrength]}</p>
              </div>
              <Field label="Confirmer le mot de passe *" type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} error={errors.password_confirmation} />

              <Button type="submit" loading={loading} className="w-full">
                S’inscrire
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, error, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        {...props}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${error ? 'border-red-400' : 'border-gray-300'}`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
