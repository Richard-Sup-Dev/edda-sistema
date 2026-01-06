// src/components/NFClientSearch.jsx
import React, { useState, useEffect } from 'react';
import { logger } from '@/config/api';
import { API_ENDPOINTS } from '@/config/api';

export default function NFClientSearch({ onSelect }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await axios.get(API_ENDPOINTS.CLIENTES, {
        const filtered = res.data.filter(c =>
          c.nome_fantasia?.toLowerCase().includes(query.toLowerCase()) ||
          c.cnpj?.includes(query.replace(/\D/g, ''))
        );
        setSuggestions(filtered);
      } catch (err) {
        logger.error('Error fetching clients:', err);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="search-section">
      <label>Buscar Cliente (Nome, O.S. ou CNPJ):</label>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Ex: 12345, Cliente X, 00.000.000/0001-00"
      />
      {loading && <p style={{ color: '#4a90e2' }}>Buscando...</p>}

      {suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map(client => (
            <div
              key={client.id}
              className="suggestion-item"
              onClick={() => {
                onSelect(client);
                setQuery(client.nome_fantasia);
                setSuggestions([]);
              }}
            >
              <strong>{client.nome_fantasia}</strong> ({client.cnpj}) - O.S.: {client.os_numero || 'N/D'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}