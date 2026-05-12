import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardBody } from '../../components/ui/Card';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const { error: notify } = useNotifications();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      const message = err.message || 'Erreur de connexion';
      notify(message);
      setErrors({ general: message });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-500">Yoonema</h1>
          <p className="text-gray-600 mt-2">Livraison de repas universitaires</p>
        </div>

        {/* Form */}
        <Card>
          <CardBody>
            {errors.general && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                placeholder="votremail@example.com"
                required
              />

              <Input
                label="Mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                placeholder="••••••••"
                required
              />

              <Button
                type="submit"
                loading={loading}
                className="w-full"
              >
                Connexion
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">Pas de compte ?</p>
              <Button
                variant="ghost"
                onClick={() => navigate('/register')}
                className="mt-2"
              >
                S'inscrire
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Test Credentials */}
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
          <p className="font-semibold text-sm mb-2">Identifiants de test :</p>
          <p className="text-xs text-gray-600">
            <strong>Étudiant:</strong> student@test.com / password123
          </p>
          <p className="text-xs text-gray-600">
            <strong>Vendeur:</strong> vendor@test.com / password123
          </p>
          <p className="text-xs text-gray-600">
            <strong>Livreur:</strong> delivery@test.com / password123
          </p>
          <p className="text-xs text-gray-600">
            <strong>Admin:</strong> admin@test.com / password123
          </p>
        </div>
      </div>
    </div>
  );
}
