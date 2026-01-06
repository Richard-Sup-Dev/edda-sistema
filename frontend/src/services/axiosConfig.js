// frontend/src/services/axiosConfig.js
import axios from 'axios';

// Configura o token automaticamente em TODAS as requisições
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // ← aqui é onde seu login salva o token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axios;