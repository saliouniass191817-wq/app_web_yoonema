import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardBody } from '../../components/ui/Card';
import { Icon } from '../../components/ui/Icon';
import { Badge } from '../../components/ui/Badge';
import { vendorAPI } from '../../api';
import { useNotifications } from '../../hooks/useNotifications';
import { useImageUpload } from '../../hooks/useImageUpload';
import { formatCurrency } from '../../lib/utils';

const emptyForm = { name: '', description: '', price: '', category: '', image_url: '', is_available: true };

export default function VendorMenuPage() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const { success, error } = useNotifications();
  const { preview, uploading, selectImage, uploadImage } = useImageUpload();
  const [imageFile, setImageFile] = useState(null);

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
      let imageUrl = form.image_url;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        image_url: imageUrl,
        is_available: !!form.is_available,
      };
      const res = await vendorAPI.createMenuItem(payload);
      if (res.success) {
        success('Article ajouté au menu');
        setForm(emptyForm);
        setImageFile(null);
        setShowForm(false);
        loadMenu();
      }
    } catch (err) {
      console.error(err);
      error(err?.message || "Erreur lors de l'ajout");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Supprimer « ${item.name} » du menu ?`)) return;
    try {
      const res = await vendorAPI.deleteMenuItem(item.id);
      if (res.success) {
        success('Article supprimé');
        setMenu((m) => m.filter((x) => x.id !== item.id));
      }
    } catch (err) {
      error(err?.message || 'Suppression impossible');
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">Mon menu</h1>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? 'secondary' : 'primary'}>
          {showForm ? <Icon name="x" size={16} /> : <Icon name="plus" size={16} strokeWidth={2.2} />}
          {showForm ? 'Annuler' : 'Ajouter un article'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6 animate-slide-up">
          <CardBody>
            <h2 className="mb-4 text-lg font-bold text-gray-900">Nouvel article</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Nom" value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Riz au poulet" required />
                <Input label="Prix (FCFA)" type="number" value={form.price} onChange={(e) => handleChange('price', e.target.value)} placeholder="800" required />
              </div>
              <Input label="Catégorie" value={form.category} onChange={(e) => handleChange('category', e.target.value)} placeholder="Repas midi" />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows="3"
                  placeholder="Ingrédients, accompagnement…"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[15px] text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/15"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Photo de l’article</label>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 transition-colors hover:border-orange-300 hover:bg-orange-50">
                  <Icon name="plus" size={18} className="text-gray-400" />
                  <span>Choisir une image…</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setImageFile(file || null);
                      selectImage(file);
                    }}
                  />
                </label>
                {preview && <img src={preview} alt="Aperçu" className="mt-3 h-36 w-full rounded-xl object-cover" />}
              </div>

              <label className="flex items-center gap-2.5 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={form.is_available}
                  onChange={(e) => handleChange('is_available', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                Disponible à la vente
              </label>

              <div className="flex gap-2 pt-1">
                <Button type="submit" loading={submitting || uploading}>Ajouter au menu</Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setForm(emptyForm); }}>Annuler</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100" />)}
        </div>
      ) : menu.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-14 text-center text-gray-500">
          Aucun article dans ton menu. Ajoute ton premier plat.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {menu.map((item) => (
            <Card key={item.id} className="flex gap-3 p-3">
              <img
                src={item.image_url || '/images/placeholder-food.svg'}
                alt={item.name}
                className="h-20 w-20 shrink-0 rounded-xl object-cover"
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="truncate font-semibold text-gray-900">{item.name}</h3>
                  <span className="shrink-0 font-bold text-orange-600">{formatCurrency(item.price)}</span>
                </div>
                <p className="mt-0.5 line-clamp-2 text-sm text-gray-500">{item.description}</p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <Badge variant={item.is_available ? 'success' : 'default'} dot>
                    {item.is_available ? 'Disponible' : 'Indisponible'}
                  </Badge>
                  <button
                    onClick={() => handleDelete(item)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 transition-colors hover:bg-danger-50 hover:text-danger-600"
                    aria-label="Supprimer"
                  >
                    <Icon name="x" size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
