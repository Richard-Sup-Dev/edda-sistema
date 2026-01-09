import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Filter,
  Calendar,
  Tag,
  User,
  FileText,
  Package,
  Wrench,
  Users,
  ChevronDown,
  Clock,
} from 'lucide-react';
import { debounce } from '@/utils/debounce';

export default function AdvancedSearch({ isOpen, onClose, onSearch, modules = [] }) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    module: 'all', // all, clientes, pecas, servicos, relatorios
    dateRange: 'all', // all, today, week, month, custom
    customDateStart: '',
    customDateEnd: '',
    status: 'all', // all, ativo, inativo
    sortBy: 'recent', // recent, name, date
    tags: [],
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });

  // Módulos disponíveis
  const availableModules = [
    { value: 'all', label: 'Todos', icon: Search, color: 'text-gray-600' },
    { value: 'clientes', label: 'Clientes', icon: Users, color: 'text-green-600' },
    { value: 'pecas', label: 'Peças', icon: Package, color: 'text-purple-600' },
    { value: 'servicos', label: 'Serviços', icon: Wrench, color: 'text-orange-600' },
    { value: 'relatorios', label: 'Relatórios', icon: FileText, color: 'text-blue-600' },
  ];

  // Debounced search
  const debouncedSearch = useCallback(
    debounce(async (searchQuery, searchFilters) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        // Chamar API de busca
        const response = await onSearch(searchQuery, searchFilters);
        setResults(response || []);

        // Salvar pesquisa recente
        saveRecentSearch(searchQuery);
      } catch (error) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    [onSearch]
  );

  useEffect(() => {
    if (query.length >= 2) {
      debouncedSearch(query, filters);
    } else {
      setResults([]);
    }
  }, [query, filters, debouncedSearch]);

  const saveRecentSearch = (searchQuery) => {
    const updated = [
      searchQuery,
      ...recentSearches.filter((s) => s !== searchQuery),
    ].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      module: 'all',
      dateRange: 'all',
      customDateStart: '',
      customDateEnd: '',
      status: 'all',
      sortBy: 'recent',
      tags: [],
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-100 flex items-start justify-center pt-20"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Search Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar em todo o sistema..."
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  autoFocus
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2 ${
                  showFilters
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-5 h-5" />
                Filtros
              </button>
              <button
                onClick={onClose}
                className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Module Filters */}
            <div className="flex gap-2 mt-4">
              {availableModules.map((module) => {
                const Icon = module.icon;
                const isActive = filters.module === module.value;
                return (
                  <button
                    key={module.value}
                    onClick={() => handleFilterChange('module', module.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      isActive
                        ? 'bg-orange-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${!isActive && module.color}`} />
                    {module.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-b border-gray-200 overflow-hidden"
              >
                <div className="p-6 grid grid-cols-3 gap-4">
                  {/* Data Range */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Período
                    </label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    >
                      <option value="all">Todo período</option>
                      <option value="today">Hoje</option>
                      <option value="week">Última semana</option>
                      <option value="month">Último mês</option>
                      <option value="custom">Personalizado</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    >
                      <option value="all">Todos</option>
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                    </select>
                  </div>

                  {/* Ordenação */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ordenar por
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    >
                      <option value="recent">Mais recentes</option>
                      <option value="name">Nome (A-Z)</option>
                      <option value="date">Data</option>
                    </select>
                  </div>
                </div>

                <div className="px-6 pb-4">
                  <button
                    onClick={resetFilters}
                    className="text-sm text-orange-600 hover:text-orange-700 font-semibold"
                  >
                    Limpar todos os filtros
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results / Recent Searches */}
          <div className="max-h-125 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent" />
              </div>
            ) : query.length < 2 ? (
              <div className="p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Pesquisas Recentes
                </h3>
                {recentSearches.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Nenhuma pesquisa recente
                  </p>
                ) : (
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(search)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
                      >
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{search}</span>
                      </button>
                    ))}
                    <button
                      onClick={clearRecentSearches}
                      className="text-sm text-red-600 hover:text-red-700 font-semibold mt-4"
                    >
                      Limpar histórico
                    </button>
                  </div>
                )}
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Nenhum resultado encontrado</p>
                <p className="text-sm text-gray-400 mt-1">
                  Tente ajustar sua busca ou filtros
                </p>
              </div>
            ) : (
              <div className="p-6 space-y-2">
                <p className="text-sm text-gray-500 mb-4">
                  {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado
                  {results.length !== 1 ? 's' : ''}
                </p>
                {results.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-gray-100"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">
                          {result.title || result.nome || 'Sem título'}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {result.description || result.descricao || 'Sem descrição'}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{result.module || result.tipo || 'Geral'}</span>
                          <span>•</span>
                          <span>{result.date || 'Data não disponível'}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Keyboard Shortcuts */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center gap-6 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white rounded border border-gray-300">↑↓</kbd>
                <span>Navegar</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white rounded border border-gray-300">Enter</kbd>
                <span>Selecionar</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white rounded border border-gray-300">ESC</kbd>
                <span>Fechar</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
