// src/components/DynamicPhotoSection.jsx

import React, { useState } from 'react';
import { Camera, X } from 'lucide-react'; 

function DynamicPhotoSection({ title, section, fixedSlots = [], onPhotosChange }) {
  // Inicializa com slots fixos (ex: "Foto 1 - Bobina frontal")
  const initialPhotos = fixedSlots.length > 0
    ? fixedSlots.map(slot => ({
        file: null,
        preview: null,
        description: slot.description || `Foto ${slot.index + 1}`,
        section
      }))
    : [{ file: null, preview: null, description: '', section }]; 

  const [photos, setPhotos] = useState(initialPhotos);

  // Atualiza o preview e notifica o pai
  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPhotos = [...photos];
      newPhotos[index] = {
        ...newPhotos[index],
        file,
        preview: reader.result,
      };
      setPhotos(newPhotos);
      onPhotosChange(newPhotos); // notifica o CreateReportForm
    };
    reader.readAsDataURL(file);
  };

  // Remove foto
  const removePhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    onPhotosChange(newPhotos);
  };

  // Adiciona novo slot vazio (apenas se não for fixedSlots)
  const addPhotoSlot = () => {
    if (fixedSlots.length > 0) return; // não permite adicionar se for seção fixa

    setPhotos([...photos, {
      file: null,
      preview: null,
      description: '',
      section
    }]);
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photos.map((photo, index) => (
          <div key={index} className="relative group">
            <label className="block cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, index)}
                className="hidden"
              />

              <div className={`border-2 border-dashed rounded-xl overflow-hidden transition-all
                ${photo.preview ? 'border-indigo-500' : 'border-gray-300 hover:border-indigo-400'}
                aspect-square flex flex-col items-center justify-center bg-gray-50`}
              >
                {photo.preview ? (
                  <>
                    <img src={photo.preview} alt={photo.description} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-12 h-12 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Clique para adicionar</p>
                  </div>
                )}
              </div>
            </label>

            {/* Descrição da foto */}
            <p className="text-center mt-2 text-sm text-gray-700 font-medium">
              {photo.description || `Foto ${index + 1}`}
            </p>

            {/* Botão remover (apenas se tiver preview e não for slot fixo obrigatório) */}
            {photo.preview && (
              <button
                onClick={() => removePhoto(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remover foto"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Botão adicionar mais fotos (apenas em seções livres) */}
      {fixedSlots.length === 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={addPhotoSlot}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Camera className="w-5 h-5" />
            Adicionar mais fotos
          </button>
        </div>
      )}
    </div>
  );
}

export default DynamicPhotoSection;