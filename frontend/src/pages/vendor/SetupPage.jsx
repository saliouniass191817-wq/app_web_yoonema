import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardBody } from '../../components/ui/Card';
import { vendorAPI } from '../../api';
import { useNotifications } from '../../hooks/useNotifications';
import { useVendorRestaurant } from '../../context/VendorRestaurantContext';

const initialForm = {
  name: '',
  description: '',
  address: '',
  delivery_time: '30',
  delivery_fee: '500',
  is_open: false,
};

export default function VendorSetupPage() {
  const navigate = useNavigate();
  const { refresh, restaurant, loading: contextLoading } = useVendorRestaurant();
  const { success, error: showError } = useNotifications();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (!contextLoading && restaurant) {
      navigate('/vendor', { replace: true });
    }
  }, [contextLoading, restaurant, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!form.name.trim()) {
      setErrors({ name: 'Le nom du restaurant est obligatoire.' });
      return;
    }
    if (!form.address.trim()) {
      setErrors({ address: 'L’adresse est obligatoire.' });
      return;
    }

    setLoading(true);
    try {
      const response = await vendorAPI.updateRestaurant({
        name: form.name.trim(),
        description: form.description.trim() || null,
        address: form.address.trim(),
        delivery_time: Number(form.delivery_time) || 30,
        delivery_fee: Number(form.delivery_fee) || 0,
        is_open: form.is_open,
      });

      if (!response.success) {
        showError(response.message || 'Enregistrement impossible.');
        return;
      }

      await refresh();
      success('Restaurant créé. En attente de validation par l’administrateur.');
      navigate('/vendor', { replace: true });
    } catch (err) {
      const fieldErrors = err?.errors || {};
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      } else {
        showError(err?.message || 'Enregistrement impossible.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-500">Yoonema</h1>
          <p className="text-gray-600 mt-2">Configurez votre restaurant pour commencer</p>
        </div>

        <Card>
          <CardBody>
            <h2 className="text-xl font-bold mb-2">Créer mon restaurant</h2>
            <p className="text-sm text-gray-600 mb-6">
              Ces informations seront visibles par les étudiants après validation par l’équipe Yoonema.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nom du restaurant *"
                name="name"
                value={form.name}
                onChange={handleChange}
                error={errors.name}
              />
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <Input
                label="Adresse *"
                name="address"
                value={form.address}
                onChange={handleChange}
                error={errors.address}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Délai (min)"
                  name="delivery_time"
                  type="number"
                  min="0"
                  value={form.delivery_time}
                  onChange={handleChange}
                />
                <Input
                  label="Frais livraison (FCFA)"
                  name="delivery_fee"
                  type="number"
                  min="0"
                  value={form.delivery_fee}
                  onChange={handleChange}
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="is_open"
                  checked={form.is_open}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
                Ouvrir le restaurant dès l’approbation
              </label>

              <Button type="submit" loading={loading} className="w-full">
                Enregistrer et continuer
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}