import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileImage, Check, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UploadWithPreview({
  onUpload,
  accept = 'image/*',
  multiple = true,
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 10,
}) {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (file.size > maxSize) {
      toast.error(`${file.name} excede o tamanho máximo de ${maxSize / 1024 / 1024}MB`);
      return false;
    }
    return true;
  };

  const handleFiles = useCallback(
    (newFiles) => {
      const validFiles = Array.from(newFiles).filter(validateFile);

      if (files.length + validFiles.length > maxFiles) {
        toast.error(`Máximo de ${maxFiles} arquivos permitidos`);
        return;
      }

      const filesWithPreview = validFiles.map((file) => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        preview: URL.createObjectURL(file),
        status: 'pending', // pending, uploading, success, error
        progress: 0,
      }));

      setFiles((prev) => [...prev, ...filesWithPreview]);
    },
    [files, maxFiles, maxSize]
  );

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = e.target.files;
    handleFiles(selectedFiles);
  };

  const handleRemove = (id) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleUploadAll = async () => {
    if (files.length === 0) {
      toast.error('Nenhum arquivo para enviar');
      return;
    }

    setUploading(true);

    try {
      for (const fileObj of files) {
        if (fileObj.status === 'success') continue;

        // Atualizar status para uploading
        setFiles((prev) =>
          prev.map((f) => (f.id === fileObj.id ? { ...f, status: 'uploading' } : f))
        );

        // Simular progresso (você pode implementar real progress com XMLHttpRequest)
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          setFiles((prev) =>
            prev.map((f) => (f.id === fileObj.id ? { ...f, progress } : f))
          );
        }

        // Chamar função de upload real
        try {
          await onUpload(fileObj.file);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id ? { ...f, status: 'success', progress: 100 } : f
            )
          );
        } catch (error) {
          setFiles((prev) =>
            prev.map((f) => (f.id === fileObj.id ? { ...f, status: 'error' } : f))
          );
          toast.error(`Erro ao enviar ${fileObj.file.name}`);
        }
      }

      toast.success('Todos os arquivos foram enviados!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-12 transition-all cursor-pointer ${
          isDragging
            ? 'border-orange-500 bg-orange-50 scale-[1.02]'
            : 'border-gray-300 hover:border-orange-400 hover:bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center text-center">
          <Upload
            className={`w-16 h-16 mb-4 transition-colors ${
              isDragging ? 'text-orange-500' : 'text-gray-400'
            }`}
          />
          <p className="text-lg font-semibold text-gray-700 mb-2">
            {isDragging ? 'Solte os arquivos aqui' : 'Arraste arquivos ou clique para selecionar'}
          </p>
          <p className="text-sm text-gray-500">
            Máximo {maxFiles} arquivos • Até {maxSize / 1024 / 1024}MB cada
          </p>
        </div>
      </div>

      {/* Preview Grid */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">
              Arquivos Selecionados ({files.length})
            </h3>
            <button
              onClick={handleUploadAll}
              disabled={uploading || files.every((f) => f.status === 'success')}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Enviar Todos
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {files.map((fileObj) => (
                <motion.div
                  key={fileObj.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative group"
                >
                  {/* Preview Card */}
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                    {fileObj.file.type.startsWith('image/') ? (
                      <img
                        src={fileObj.preview}
                        alt={fileObj.file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileImage className="w-12 h-12 text-gray-400" />
                      </div>
                    )}

                    {/* Status Overlay */}
                    {fileObj.status !== 'pending' && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        {fileObj.status === 'uploading' && (
                          <div className="text-center text-white">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                            <div className="text-sm font-semibold">{fileObj.progress}%</div>
                          </div>
                        )}
                        {fileObj.status === 'success' && (
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-6 h-6 text-white" />
                          </div>
                        )}
                        {fileObj.status === 'error' && (
                          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(fileObj.id);
                      }}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>

                    {/* Progress Bar */}
                    {fileObj.status === 'uploading' && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${fileObj.progress}%` }}
                          className="h-full bg-orange-500"
                        />
                      </div>
                    )}
                  </div>

                  {/* File Name */}
                  <p className="mt-2 text-xs text-gray-600 truncate" title={fileObj.file.name}>
                    {fileObj.file.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(fileObj.file.size / 1024).toFixed(1)} KB
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
