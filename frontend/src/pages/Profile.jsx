import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Shield, Calendar, Camera, ArrowLeft, Edit2, Save, X, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notifySuccess, notifyError } from '@/utils/notifications';
import apiClient from '@/services/apiClient';

export default function Profile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cargo: '',
    departamento: '',
    avatar: null,
    role: '',
    createdAt: ''
  });
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (user) {
      const data = {
        nome: user.nome || 'Usuário',
        email: user.email || '',
        telefone: user.telefone || '',
        cargo: user.cargo || '',
        departamento: user.departamento || '',
        avatar: user.avatar || null,
        role: user.role === 'admin' ? 'Administrador' : 'Usuário',
        createdAt: user.createdAt || new Date().toISOString(),
      };
      setUserData(data);
      setEditData(data);
    }
  }, [user]);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      notifyError('Imagem deve ter no máximo 5MB');
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      notifyError('Apenas imagens são permitidas');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await apiClient.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const avatarUrl = response.data.avatarUrl;
      setUserData({ ...userData, avatar: avatarUrl });
      setUser({ ...user, avatar: avatarUrl });
      notifySuccess('Foto atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      notifyError('Erro ao fazer upload da foto');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...userData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...userData });
  };

  const handleSave = async () => {
    try {
      await apiClient.put('/users/profile', {
        nome: editData.nome,
        telefone: editData.telefone,
        cargo: editData.cargo,
        departamento: editData.departamento
      });

      setUserData(editData);
      setUser({ ...user, ...editData });
      setIsEditing(false);
      notifySuccess('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      notifyError('Erro ao atualizar perfil');
    }
  };

  const handleChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  if (!userData.nome) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Botão Voltar */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors mb-4 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Voltar ao Dashboard</span>
        </button>

        {/* Header com foto */}
        <div className="bg-linear-to-r from-orange-600 to-orange-700 rounded-t-lg p-8 text-white">
          <div className="flex items-center gap-6">
            {/* Avatar com upload */}
            <div className="relative group">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                {userData.avatar ? (
                  <img src={userData.avatar} alt={userData.nome} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-orange-600" />
                )}
              </div>
              <button
                onClick={handlePhotoClick}
                disabled={isUploading}
                className="absolute bottom-0 right-0 w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center shadow-lg transition-all group-hover:scale-110 disabled:opacity-50"
              >
                {isUploading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-5 h-5 text-white" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold">{userData.nome}</h1>
              <p className="text-orange-100 mt-1">{userData.email}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1 bg-orange-500/30 rounded-full text-sm font-medium">
                  {userData.role}
                </span>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-2">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Salvar
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-b-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações Pessoais</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nome Completo</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-orange-600" />
                  <span className="text-gray-900 font-medium">{userData.nome}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
                <span className="text-gray-900 font-medium">{userData.email}</span>
              </div>
              <p className="text-xs text-gray-500">Email não pode ser alterado</p>
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Telefone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editData.telefone}
                  onChange={(e) => handleChange('telefone', e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                  <span className="text-gray-900 font-medium">{userData.telefone || 'Não informado'}</span>
                </div>
              )}
            </div>

            {/* Cargo */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Cargo</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.cargo}
                  onChange={(e) => handleChange('cargo', e.target.value)}
                  placeholder="Ex: Engenheiro"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-900 font-medium">{userData.cargo || 'Não informado'}</span>
                </div>
              )}
            </div>

            {/* Departamento */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Departamento</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.departamento}
                  onChange={(e) => handleChange('departamento', e.target.value)}
                  placeholder="Ex: Engenharia"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  <span className="text-gray-900 font-medium">{userData.departamento || 'Não informado'}</span>
                </div>
              )}
            </div>

            {/* Função */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Função no Sistema</label>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Shield className="w-5 h-5 text-purple-600" />
                <span className="text-gray-900 font-medium">{userData.role}</span>
              </div>
            </div>

            {/* Data de Criação - Ocupa 2 colunas */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Membro desde</label>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="text-gray-900 font-medium">
                  {new Date(userData.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/dashboard/change-password')}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                <Shield className="w-5 h-5" />
                Trocar Senha
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
