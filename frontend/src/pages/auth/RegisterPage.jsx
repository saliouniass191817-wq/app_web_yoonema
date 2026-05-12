import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  if (role === 'student') {
    return <RegisterStudentPage />;
  }
  if (role === 'vendor') {
    return <RegisterVendorPage />;
  }
  if (role === 'delivery') {
    return <RegisterDeliveryPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-500">Yoonema</h1>
          <p className="text-gray-600 mt-2">Choisissez votre rôle</p>
        </div>

        {/* Role Selection */}
        <div className="space-y-3">
          <Card
            onClick={() => setRole('student')}
            className="cursor-pointer hover:shadow-lg transition-all"
          >
            <CardBody className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Étudiant</h3>
                  <p className="text-gray-600 text-sm">Commander des repas</p>
                </div>
                <span className="text-3xl">🎓</span>
              </div>
            </CardBody>
          </Card>

          <Card
            onClick={() => setRole('vendor')}
            className="cursor-pointer hover:shadow-lg transition-all"
          >
            <CardBody className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Vendeur/Restaurant</h3>
                  <p className="text-gray-600 text-sm">Gérer mon restaurant</p>
                </div>
                <span className="text-3xl">🍴</span>
              </div>
            </CardBody>
          </Card>

          <Card
            onClick={() => setRole('delivery')}
            className="cursor-pointer hover:shadow-lg transition-all"
          >
            <CardBody className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Livreur</h3>
                  <p className="text-gray-600 text-sm">Livrer des commandes</p>
                </div>
                <span className="text-3xl">🚴</span>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">Vous avez déjà un compte ?</p>
          <Button
            variant="ghost"
            onClick={() => navigate('/login')}
            className="mt-2"
          >
            Se connecter
          </Button>
        </div>
      </div>
    </div>
  );
}

function RegisterStudentPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    address: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/register/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(data.errors || { general: data.message });
        return;
      }

      navigate('/login', {
        state: { message: 'Inscription réussie, connectez-vous avec vos identifiants' }
      });
    } catch (err) {
      setErrors({ general: 'Erreur d\'inscription' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md">
        <Card>
          <CardBody>
            <h2 className="text-2xl font-bold mb-6">Inscription Étudiant</h2>

            {errors.general && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Adresse</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mot de passe</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirmer le mot de passe</label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <Button loading={loading} className="w-full">
                S'inscrire
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function RegisterVendorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardBody>
            <h2 className="text-2xl font-bold mb-6">Inscription Vendeur</h2>
            <p className="text-gray-600">Formulaire d'inscription vendeur en cours de développement</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function RegisterDeliveryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardBody>
            <h2 className="text-2xl font-bold mb-6">Inscription Livreur</h2>
            <p className="text-gray-600">Formulaire d'inscription livreur en cours de développement</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
