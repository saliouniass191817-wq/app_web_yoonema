import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { vendorAPI } from '../../api';
import { useNotifications } from '../../hooks/useNotifications';

const emptyForm = { name: '', description: '', price: '', category: '', image_url: '', is_available: true };

export default function VendorMenuPage() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const { success, error } = useNotifications();

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const response = await vendorAPI.getMenu();
      setMenu(response.data || []);
    } catch (err) {
      console.error('Failed to load menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => setForm((s) => ({ ...s, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        image_url: form.image_url,
        is_available: !!form.is_available,
      };
      const res = await vendorAPI.createMenuItem(payload);
      if (res.success) {
        success('Article ajouté au menu');
        setForm(emptyForm);
        setShowForm(false);
        loadMenu();
      }
    } catch (err) {
      console.error(err);
      error(err?.message || 'Erreur lors de l\'ajout');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Menu</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Annuler' : '+ Ajouter un article'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardBody>
              <h2 className="font-semibold mb-4">Nouvel article</h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input className="w-full p-2 border" placeholder="Nom" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
                <textarea className="w-full p-2 border" placeholder="Description" value={form.description} onChange={(e) => handleChange('description', e.target.value)} />
                <input className="w-full p-2 border" placeholder="Prix (FCFA)" value={form.price} onChange={(e) => handleChange('price', e.target.value)} required />
                <input className="w-full p-2 border" placeholder="Catégorie" value={form.category} onChange={(e) => handleChange('category', e.target.value)} />
                <input className="w-full p-2 border" placeholder="Image URL" value={form.image_url} onChange={(e) => handleChange('image_url', e.target.value)} />
                <div className="flex items-center gap-2">
                  <input id="avail" type="checkbox" checked={form.is_available} onChange={(e) => handleChange('is_available', e.target.checked)} />
                  <label htmlFor="avail">Disponible</label>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" loading={submitting}>Ajouter</Button>
                  <Button variant="outline" onClick={() => { setShowForm(false); setForm(emptyForm); }}>Annuler</Button>
                </div>
              </form>
            </CardBody>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menu.length === 0 ? (
            <p className="col-span-2 text-center text-gray-600 py-12">
              Aucun article dans le menu
            </p>
          ) : (
            menu.map((item) => (
              <Card key={item.id}>
                <CardBody>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    <span className="text-orange-500 font-bold">{item.price} FCFA</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Modifier</Button>
                    <Button size="sm" variant="danger">Supprimer</Button>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
