import { useCallback, useState } from 'react';
import api from '../api/axios';

function resizeImage(file, maxWidth = 800) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      image.onload = () => {
        const scale = Math.min(1, maxWidth / image.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Image invalide.'));
            return;
          }
          resolve(new File([blob], file.name, { type: file.type || 'image/jpeg' }));
        }, file.type || 'image/jpeg', 0.85);
      };
      image.onerror = () => reject(new Error('Image invalide.'));
      image.src = reader.result;
    };
    reader.onerror = () => reject(new Error('Lecture de l’image impossible.'));
    reader.readAsDataURL(file);
  });
}

export function useImageUpload() {
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const selectImage = useCallback((file) => {
    setError(null);
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  }, []);

  const uploadImage = useCallback(async (file) => {
    if (!file) return null;
    setUploading(true);
    setError(null);
    try {
      const resized = await resizeImage(file);
      const formData = new FormData();
      formData.append('image', resized);
      const response = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data?.url;
    } catch (err) {
      const message = err?.message || 'Téléversement impossible.';
      setError(message);
      throw new Error(message);
    } finally {
      setUploading(false);
    }
  }, []);

  return { preview, uploading, error, selectImage, uploadImage };
}
