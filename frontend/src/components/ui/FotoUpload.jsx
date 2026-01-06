// src/components/FotoUpload.jsx

import React, { useRef, useState } from 'react';
import { Camera, Upload, X } from 'lucide-react'; 

const FotoUpload = ({ label, onFileChange, initialPreview = null }) => {
  const [preview, setPreview] = useState(initialPreview);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    setError('');
    fileInputRef.current?.click();
  };

  const validateAndProcessFile = (file) => {
    if (!file) return;

    // Validação de tipo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Formato inválido. Use apenas JPEG, PNG ou WEBP.');
      onFileChange(null);
      return;
    }

    // Validação de tamanho (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Arquivo muito grande. Máximo 10MB.');
      onFileChange(null);
      return;
    }

    // Tudo ok → cria preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setError('');
      onFileChange(file); // envia o File pro pai
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateAndProcessFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    validateAndProcessFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const removePhoto = (e) => {
    e.stopPropagation();
    setPreview(null);
    setError('');
    onFileChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>

      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
          transition-all duration-300
          ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}
          ${preview ? 'p-0' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          capture="environment" // câmera traseira no mobile
          onChange={handleFileChange}
          className="hidden"
        />

        {preview ? (
          <>
            <img
              src={preview}
              alt={label}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="text-white">
                <Camera className="w-12 h-12 mx-auto mb-2" />
                <p className="text-lg font-medium">Trocar foto</p>
              </div>
            </div>
            <button
              onClick={removePhoto}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 opacity-0 hover:opacity-100 transition-opacity"
              title="Remover foto"
            >
              <X className="w-5 h-5" />
            </button>
          </>
        ) : (
          <div className="py-8">
            <Upload className={`w-16 h-16 mx-auto mb-4 ${isDragging ? 'text-indigo-600' : 'text-gray-400'}`} />
            <p className="text-lg font-medium text-gray-700 mb-1">
              {isDragging ? 'Solte a imagem aqui' : 'Clique ou arraste uma foto'}
            </p>
            <p className="text-sm text-gray-500">
              JPEG, PNG ou WEBP · Máximo 10MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};

export default FotoUpload;