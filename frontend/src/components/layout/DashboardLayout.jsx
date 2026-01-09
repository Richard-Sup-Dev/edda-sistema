// src/components/layout/DashboardLayoutNew.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import notificacoesService from '@/services/notificacoesService';
import atividadesService from '@/services/atividadesService';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Users,
  Package,
  Wrench,
  FileText,
  DollarSign,
  LogOut,
  Menu,
  X,
  Settings,
  BarChart3,
  Moon,
  Sun,
  Bell,
  Search,
  ChevronRight,
  User,
  Lock,
  HelpCircle,
  Plus,
  Star,
  Command,
  TrendingUp,
  Clock,
  Check,
  Layout,
  PenTool,
  Columns,
  Download,
  Circle,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  Video,
  VideoOff,
  Palette,
  Keyboard,
  Timer,
  Zap,
  FileCode,
  Upload,
  GitBranch,
  Activity,
  MapPin,
  Target,
  Wind,
  Play,
  Pause,
  Square,
  RotateCcw,
  Save,
  Copy,
  Eye,
  Filter,
  Code,
  Shield,
  UserCog,
  Database,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardLayoutNew() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Estados locais
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'pt');
  const [presentationMode, setPresentationMode] = useState(false);
  const [activityFeedOpen, setActivityFeedOpen] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [serverLatency, setServerLatency] = useState(null);
  
  // Novos estados para melhorias avançadas
  const [showTour, setShowTour] = useState(() => !localStorage.getItem('tourCompleted'));
  const [tourStep, setTourStep] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'default');
  const [density, setDensity] = useState(() => localStorage.getItem('density') || 'comfortable');
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [stickyNotes, setStickyNotes] = useState(() => {
    const saved = localStorage.getItem('stickyNotes');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [userPoints, setUserPoints] = useState(() => parseInt(localStorage.getItem('userPoints')) || 0);
  const [userLevel, setUserLevel] = useState(() => parseInt(localStorage.getItem('userLevel')) || 1);
  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem('achievements');
    return saved ? JSON.parse(saved) : [];
  });
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [kioskMode, setKioskMode] = useState(false);
  const [showExportCenter, setShowExportCenter] = useState(false);
  const [globalFilters, setGlobalFilters] = useState({});
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [presentationSlideIndex, setPresentationSlideIndex] = useState(0);
  
  // Estados de notificações (API real)
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  
  // Estados de atividades (API real)
  const [recentActivities, setRecentActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  
  // Novos estados para melhorias de próxima geração
  const [showWidgetLibrary, setShowWidgetLibrary] = useState(false);
  const [dashboardWidgets, setDashboardWidgets] = useState(() => {
    const saved = localStorage.getItem('dashboardWidgets');
    return saved ? JSON.parse(saved) : [];
  });
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [floatingWindows, setFloatingWindows] = useState([]);
  const [showKanban, setShowKanban] = useState(false);
  const [kanbanColumns, setKanbanColumns] = useState({
    todo: [
      { title: 'Implementar Dashboard', desc: 'Criar novo layout do dashboard', priority: 'Alta', date: '20/01/2025' },
      { title: 'Revisar Documentação', desc: 'Atualizar docs do projeto', priority: 'Média', date: '21/01/2025' },
    ],
    inProgress: [
      { title: 'Testar API', desc: 'Validar endpoints REST', priority: 'Alta', date: '19/01/2025' },
    ],
    done: [
      { title: 'Setup Inicial', desc: 'Configurar ambiente', priority: 'Alta', date: '18/01/2025' },
    ]
  });
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([
    { id: 1, name: 'João Silva', color: '#3b82f6', avatar: 'J' },
    { id: 2, name: 'Maria Santos', color: '#10b981', avatar: 'M' },
  ]);
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('soundEnabled') === 'true');
  const [showConfetti, setShowConfetti] = useState(false);
  const [macroRecording, setMacroRecording] = useState(false);
  const [recordedMacros, setRecordedMacros] = useState([]);
  const [currentMacroActions, setCurrentMacroActions] = useState([]);
  
  // Screenshot & Recording
  const [showScreenshotTool, setShowScreenshotTool] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [screenshots, setScreenshots] = useState([]);
  
  // Custom Theme Builder
  const [showThemeBuilder, setShowThemeBuilder] = useState(false);
  const [customTheme, setCustomTheme] = useState({
    primary: '#f97316',
    secondary: '#3b82f6',
    accent: '#10b981',
    background: '#ffffff',
    text: '#1f2937'
  });
  
  // Keyboard Shortcuts Customizer
  const [showShortcutCustomizer, setShowShortcutCustomizer] = useState(false);
  const [customShortcuts, setCustomShortcuts] = useState({});
  
  // Time Tracking & Pomodoro
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [pomodoroSessions, setPomodoroSessions] = useState(0);
  const [timeTracking, setTimeTracking] = useState([]);
  
  // Workflow Automation
  const [showWorkflowBuilder, setShowWorkflowBuilder] = useState(false);
  const [workflows, setWorkflows] = useState([]);
  
  // Report Generator
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const [reportTemplates, setReportTemplates] = useState([]);
  
  // Advanced Search
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchFilters, setSearchFilters] = useState({});
  
  // API Playground
  const [showApiPlayground, setShowApiPlayground] = useState(false);
  const [apiRequests, setApiRequests] = useState([]);
  
  // Upload Zone
  const [showUploadZone, setShowUploadZone] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  
  // Version Control
  const [showVersionControl, setShowVersionControl] = useState(false);
  const [versions, setVersions] = useState([]);
  
  // Performance Monitor
  const [showPerfMonitor, setShowPerfMonitor] = useState(false);
  const [perfMetrics, setPerfMetrics] = useState({ fps: 60, memory: 0, latency: 0 });
  
  // Video Call
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  
  // Interactive Maps
  const [showDataMaps, setShowDataMaps] = useState(false);
  const [mapData, setMapData] = useState([]);
  
  // Goal Tracking
  const [showGoalTracker, setShowGoalTracker] = useState(false);
  const [goals, setGoals] = useState([
    { id: 1, title: 'Aumentar produtividade 50%', progress: 65, target: 100, deadline: '31/03/2026' },
    { id: 2, title: 'Completar 100 relatórios', progress: 78, target: 100, deadline: '28/02/2026' },
  ]);
  
  // Focus Mode 2.0
  const [focusMode2, setFocusMode2] = useState(false);
  const [ambientSound, setAmbientSound] = useState('rain');
  const [breathingExercise, setBreathingExercise] = useState(false);
  
  const whiteboardRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const searchInputRef = useRef(null);
  const commandInputRef = useRef(null);
  const activityFeedRef = useRef(null);
  const aiChatRef = useRef(null);
  const voiceRecognitionRef = useRef(null);

  // Atualizar relógio a cada minuto
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Salvar preferências no localStorage
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Fechar menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (activityFeedRef.current && !activityFeedRef.current.contains(event.target)) {
        setActivityFeedOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Atalhos de teclado globais
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Command Palette: Ctrl+K / Cmd+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      
      // Search: Ctrl+/ ou Cmd+/
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setSearchOpen(true);
      }
      
      // Keyboard Shortcuts Help: ?
      if (e.shiftKey && e.key === '?') {
        e.preventDefault();
        setShowKeyboardShortcuts(true);
      }
      
      // Focus Mode: F
      if (e.key === 'f' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        setFocusMode(!focusMode);
      }
      
      // Navigation shortcuts
      if (e.key === 'g' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') {
        // Próxima tecla determina o destino
        const nextKeyHandler = (nextE) => {
          if (nextE.key === 'd') navigate('/dashboard');
          if (nextE.key === 'c') navigate('/dashboard/clientes');
          if (nextE.key === 'r') navigate('/dashboard/relatorios');
          if (nextE.key === 'p') navigate('/dashboard/pecas');
          document.removeEventListener('keydown', nextKeyHandler);
        };
        document.addEventListener('keydown', nextKeyHandler);
      }
      
      // ESC fecha tudo
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setCommandPaletteOpen(false);
        setUserMenuOpen(false);
        setNotificationsOpen(false);
        setActivityFeedOpen(false);
        setShowKeyboardShortcuts(false);
        setFocusMode(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate, focusMode]);

  // Histórico de navegação
  useEffect(() => {
    setNavigationHistory(prev => [...prev, location.pathname].slice(-10));
  }, [location.pathname]);

  // Monitorar latência do servidor
  useEffect(() => {
    const checkLatency = async () => {
      const start = Date.now();
      try {
        await fetch('/api/ping').catch(() => {});
        const latency = Date.now() - start;
        setServerLatency(latency);
      } catch {
        setServerLatency(null);
      }
    };
    checkLatency();
    const interval = setInterval(checkLatency, 30000);
    return () => clearInterval(interval);
  }, []);

  // Salvar idioma
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Salvar tema e densidade
  useEffect(() => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('density', density);
  }, [theme, density]);

  // Voice Recognition
  useEffect(() => {
    if (!voiceEnabled) return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Voice commands not supported in this browser');
      setVoiceEnabled(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'pt-BR';
    
    recognition.onstart = () => {
      setIsListening(true);
      playSound('start');
    };
    
    recognition.onresult = (event) => {
      const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
      setVoiceCommand(command);
      
      // Execute commands
      if (command.includes('dashboard')) navigate('/dashboard');
      if (command.includes('relatório')) navigate('/dashboard/relatorios');
      if (command.includes('cliente')) navigate('/dashboard/clientes');
      if (command.includes('modo escuro')) setDarkMode(true);
      if (command.includes('modo claro')) setDarkMode(false);
      if (command.includes('abrir widgets')) setShowWidgetLibrary(true);
      if (command.includes('abrir quadro')) setShowWhiteboard(true);
      if (command.includes('fechar tudo')) {
        setShowWidgetLibrary(false);
        setShowWhiteboard(false);
        setShowKanban(false);
      }
      
      toast.success(`Comando: ${command}`, { icon: '🎤' });
      playSound('success');
    };
    
    recognition.onerror = () => {
      setIsListening(false);
    };
    
    recognition.start();
    
    return () => recognition.stop();
  }, [voiceEnabled]);

  // Pomodoro Timer
  useEffect(() => {
    if (!isTimerRunning || pomodoroTime <= 0) return;
    
    const interval = setInterval(() => {
      setPomodoroTime(prev => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          setPomodoroSessions(s => s + 1);
          setShowConfetti(true);
          playSound('success');
          toast.success('🍅 Pomodoro completado!', { duration: 5000 });
          addPoints(25, 'completar pomodoro');
          return 25 * 60;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isTimerRunning, pomodoroTime]);

  // Performance Monitor
  useEffect(() => {
    if (!showPerfMonitor) return;
    
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        const memory = performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : 0;
        
        setPerfMetrics({ fps, memory, latency: serverLatency || 0 });
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      if (showPerfMonitor) requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }, [showPerfMonitor, serverLatency]);

  // Salvar sticky notes
  useEffect(() => {
    localStorage.setItem('stickyNotes', JSON.stringify(stickyNotes));
  }, [stickyNotes]);

  // Salvar pontos e nível
  useEffect(() => {
    localStorage.setItem('userPoints', userPoints.toString());
    localStorage.setItem('userLevel', userLevel.toString());
  }, [userPoints, userLevel]);

  // Salvar conquistas
  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify(achievements));
  }, [achievements]);

  // Sistema de gamificação - adicionar pontos por ações
  const addPoints = (points, action) => {
    setUserPoints(prev => {
      const newPoints = prev + points;
      const newLevel = Math.floor(newPoints / 100) + 1;
      if (newLevel > userLevel) {
        setUserLevel(newLevel);
        toast.success(`🎉 Parabéns! Você subiu para o nível ${newLevel}!`);
      }
      toast.success(`+${points} pontos por ${action}!`);
      return newPoints;
    });
  };

  // Sistema de conquistas
  const unlockAchievement = (id, title) => {
    if (!achievements.includes(id)) {
      setAchievements(prev => [...prev, id]);
      toast.success(`🏆 Nova conquista desbloqueada: ${title}!`);
    }
  };

  // Modo Kiosk
  useEffect(() => {
    if (kioskMode) {
      document.documentElement.requestFullscreen?.();
      const interval = setInterval(() => {
        // Auto-refresh data
      }, 30000);
      return () => clearInterval(interval);
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      }
    }
  }, [kioskMode]);

  // Salvar widgets do dashboard
  useEffect(() => {
    localStorage.setItem('dashboardWidgets', JSON.stringify(dashboardWidgets));
  }, [dashboardWidgets]);

  // Salvar som
  useEffect(() => {
    localStorage.setItem('soundEnabled', soundEnabled.toString());
  }, [soundEnabled]);

  // Confetti effect
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  // Som de clique
  const playSound = (type = 'click') => {
    if (!soundEnabled) return;
    const audio = new Audio(`/sounds/${type}.mp3`);
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  // Gravar macro
  const recordAction = (action) => {
    if (macroRecording) {
      setCurrentMacroActions(prev => [...prev, { action, timestamp: Date.now() }]);
    }
  };

  // Adicionar widget
  const addWidget = (widget) => {
    setDashboardWidgets(prev => [...prev, { ...widget, id: Date.now() }]);
    playSound('success');
    addPoints(10, 'adicionar widget');
  };

  // Abrir janela flutuante
  const openFloatingWindow = (content, title) => {
    setFloatingWindows(prev => [...prev, { 
      id: Date.now(), 
      content, 
      title, 
      position: { x: 100 + prev.length * 50, y: 100 + prev.length * 50 },
      size: { width: 600, height: 400 }
    }]);
  };

  // Screenshot Tool
  const takeScreenshot = async () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Capture screen (simplified - needs html2canvas or similar in production)
      const dataUrl = canvas.toDataURL('image/png');
      setScreenshots(prev => [...prev, { id: Date.now(), data: dataUrl, timestamp: new Date() }]);
      playSound('success');
      toast.success('📸 Screenshot capturada!');
      addPoints(5, 'capturar screenshot');
    } catch (err) {
      toast.error('Erro ao capturar screenshot');
    }
  };

  // Start Screen Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setScreenshots(prev => [...prev, { id: Date.now(), data: url, type: 'video', timestamp: new Date() }]);
        toast.success('🎥 Gravação salva!');
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      playSound('start');
      toast.success('🔴 Gravação iniciada');
    } catch (err) {
      toast.error('Erro ao iniciar gravação');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      playSound('stop');
    }
  };

  // Apply Custom Theme
  const applyCustomTheme = () => {
    document.documentElement.style.setProperty('--color-primary', customTheme.primary);
    document.documentElement.style.setProperty('--color-secondary', customTheme.secondary);
    document.documentElement.style.setProperty('--color-accent', customTheme.accent);
    toast.success('🎨 Tema personalizado aplicado!');
    addPoints(10, 'criar tema personalizado');
  };

  // Format Pomodoro Time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Focar input de busca quando abrir
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Carregar notificações da API
  const carregarNotificacoes = useCallback(async () => {
    try {
      setLoadingNotifications(true);
      const [notifs, count] = await Promise.all([
        notificacoesService.listar({ limit: 10 }),
        notificacoesService.contarNaoLidas()
      ]);
      setNotifications(notifs.notificacoes || []);
      setUnreadCount(count);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoadingNotifications(false);
    }
  }, []);

  // Carregar notificações ao montar e quando abrir dropdown
  useEffect(() => {
    if (user) {
      carregarNotificacoes();
      // Atualizar a cada 30 segundos
      const interval = setInterval(carregarNotificacoes, 30000);
     Carregar atividades recentes
  const carregarAtividades = useCallback(async () => {
    try {
      setLoadingActivities(true);
      const atividades = await atividadesService.recentes();
      setRecentActivities(atividades);
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
    } finally {
      setLoadingActivities(false);
    }
  }, []);

  // Carregar atividades ao montar
  useEffect(() => {
    if (user) {
      carregarAtividades();
      // Atualizar a cada 60 segundos
      const interval = setInterval(carregarAtividades, 60000);
      return () => clearInterval(interval);
    }
  }, [user, carregarAtividades]);

  //  return () => clearInterval(interval);
    }
  }, [user, carregarNotificacoes]);

  // Marcar notificação como lida
  const marcarComoLida = async (id) => {
    try {
      await notificacoesService.marcarComoLida(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, lida: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  // Marcar todas como lidas
  const marcarTodasComoLidas = async () => {
    tFormatar tempo relativo
  const formatarTempoRelativo = (data) => {
    const agora = new Date();
    const dataAtividade = new Date(data);
    const diffMs = agora - dataAtividade;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMs / 3600000);
    const diffDias = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'agora';
    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHoras < 24) return `${diffHoras} hora${diffHoras > 1 ? 's' : ''} atrás`;
    return `${diffDias} dia${diffDias > 1 ? 's' : ''} atrás`;
  } }
  };

  // Deletar notificação
  const deletarNotificacao = async (id) => {
    try {
      await notificacoesService.deletar(id);
      const notif = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (notif && !notif.lida) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
    }
  };

  // Mock de atividades recentes
  const recentActivities = [
    { id: 1, type: 'create', user: 'João Silva', action: 'criou relatório', item: '#1234', time: '2 min atrás' },
    { id: 2, type: 'update', user: 'Maria Santos', action: 'atualizou cliente', item: 'Empresa XYZ', time: '15 min atrás' },
    { id: 3, type: 'delete', user: 'Pedro Costa', action: 'removeu peça', item: 'Motor ABC', time: '1 hora atrás' },
    { id: 4, type: 'create', user: 'Ana Oliveira', action: 'adicionou serviço', item: 'Manutenção', time: '2 horas atrás' },
  ];

  // Mock de stats em tempo real
  const stats = [
    { label: 'Relatórios Hoje', value: 23, change: '+12%', icon: FileText, color: 'orange' },
    { label: 'Clientes Ativos', value: 156, change: '+8%', icon: Users, color: 'blue' },
    { label: 'Receita do Mês', value: 'R$ 45.2k', change: '+15%', icon: DollarSign, color: 'green' },
  ];

  // Temas disponíveis
  const themes = [
    { id: 'default', name: 'Padrão', colors: { primary: '#f97316', secondary: '#1f2937' } },
    { id: 'blue', name: 'Azul', colors: { primary: '#3b82f6', secondary: '#1e40af' } },
    { id: 'green', name: 'Verde', colors: { primary: '#10b981', secondary: '#065f46' } },
    { id: 'purple', name: 'Roxo', colors: { primary: '#8b5cf6', secondary: '#5b21b6' } },
    { id: 'pink', name: 'Rosa', colors: { primary: '#ec4899', secondary: '#be185d' } },
  ];

  // Steps do tour
  const tourSteps = [
    { target: '.sidebar', title: 'Navegação', content: 'Use a barra lateral para navegar entre as páginas do sistema.' },
    { target: '.search-button', title: 'Busca Rápida', content: 'Pressione Ctrl+K para buscar rapidamente.' },
    { target: '.notifications-button', title: 'Notificações', content: 'Fique por dentro de todas as atualizações.' },
    { target: '.user-menu', title: 'Menu do Usuário', content: 'Acesse seu perfil e configurações aqui.' },
  ];

  // Conquistas disponíveis
  const availableAchievements = [
    { id: 'first-login', title: 'Primeiro Acesso', description: 'Fez login pela primeira vez', icon: '🎯' },
    { id: 'explorer', title: 'Explorador', description: 'Visitou todas as páginas', icon: '🗺️' },
    { id: 'power-user', title: 'Usuário Power', description: 'Usou 10 atalhos de teclado', icon: '⚡' },
    { id: 'social', title: 'Social', description: 'Adicionou 5 favoritos', icon: '⭐' },
    { id: 'productive', title: 'Produtivo', description: 'Criou 10 relatórios', icon: '📊' },
  ];

  // Audit log mock
  const auditLog = [
    { id: 1, user: user?.nome, action: 'Login realizado', timestamp: new Date(), ip: '192.168.1.1' },
    { id: 2, user: user?.nome, action: 'Relatório criado', timestamp: new Date(Date.now() - 3600000), ip: '192.168.1.1' },
    { id: 3, user: user?.nome, action: 'Cliente atualizado', timestamp: new Date(Date.now() - 7200000), ip: '192.168.1.1' },
  ];

  // Traduções básicas
  const translations = {
    pt: {
      dashboard: 'Dashboard',
      clients: 'Clientes',
      parts: 'Peças',
      services: 'Serviços',
      reports: 'Relatórios',
      financial: 'Financeiro',
      analysis: 'Análises',
      settings: 'Configurações',
      logout: 'Sair',
      search: 'Buscar',
      notifications: 'Notificações',
      profile: 'Meu Perfil',
      help: 'Ajuda',
      focusMode: 'Modo Foco',
      activities: 'Atividades',
    },
    en: {
      dashboard: 'Dashboard',
      clients: 'Clients',
      parts: 'Parts',
      services: 'Services',
      reports: 'Reports',
      financial: 'Financial',
      analysis: 'Analysis',
      settings: 'Settings',
      logout: 'Logout',
      search: 'Search',
      notifications: 'Notifications',
      profile: 'My Profile',
      help: 'Help',
      focusMode: 'Focus Mode',
      activities: 'Activities',
    },
    es: {
      dashboard: 'Panel',
      clients: 'Clientes',
      parts: 'Piezas',
      services: 'Servicios',
      reports: 'Informes',
      financial: 'Financiero',
      analysis: 'Análisis',
      settings: 'Configuraciones',
      logout: 'Salir',
      search: 'Buscar',
      notifications: 'Notificaciones',
      profile: 'Mi Perfil',
      help: 'Ayuda',
      focusMode: 'Modo Enfoque',
      activities: 'Actividades',
    },
  };

  const t = translations[language];

  // Funções (devem vir antes de serem usadas)
  const handleLogout = () => {
    if (confirm('Tem certeza que deseja fazer logout?')) {
      logout();
      toast.success('Desconectado com sucesso');
    }
  };

  const toggleFavorite = (path) => {
    setFavorites(prev => 
      prev.includes(path) 
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
    toast.success(favorites.includes(path) ? 'Removido dos favoritos' : 'Adicionado aos favoritos');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.success(`Buscando por: ${searchQuery}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const isActive = (path) => location.pathname === path;

  const quickActions = [
    { label: 'Relatórios', icon: FileText, action: () => navigate('/dashboard/relatorios'), color: 'orange' },
    { label: 'Clientes', icon: Users, action: () => navigate('/dashboard/clientes'), color: 'blue' },
    { label: 'Peças', icon: Package, action: () => navigate('/dashboard/pecas'), color: 'green' },
  ];

  // Comandos para o Command Palette
  const commands = [
    { id: 'go-reports', label: 'Ir para Relatórios', icon: FileText, action: () => navigate('/dashboard/relatorios'), shortcut: 'G R' },
    { id: 'go-clients', label: 'Ir para Clientes', icon: Users, action: () => navigate('/dashboard/clientes'), shortcut: 'G C' },
    { id: 'go-parts', label: 'Ir para Peças', icon: Package, action: () => navigate('/dashboard/pecas'), shortcut: 'G P' },
    { id: 'go-services', label: 'Ir para Serviços', icon: Wrench, action: () => navigate('/dashboard/servicos'), shortcut: 'G S' },
    { id: 'go-financial', label: 'Ir para Financeiro', icon: DollarSign, action: () => navigate('/dashboard/financeiro'), shortcut: 'G F' },
    { id: 'go-analytics', label: 'Ir para Análises', icon: BarChart3, action: () => navigate('/dashboard/analises'), shortcut: 'G A' },
    { id: 'toggle-dark', label: 'Alternar Tema Escuro', icon: Moon, action: () => setDarkMode(!darkMode), shortcut: 'T D' },
    { id: 'toggle-focus', label: 'Modo Foco', icon: TrendingUp, action: () => setFocusMode(!focusMode), shortcut: 'F' },
    { id: 'open-settings', label: 'Abrir Configurações', icon: Settings, action: () => navigate('/profile-settings'), shortcut: 'Ctrl+,' },
    { id: 'logout', label: 'Fazer Logout', icon: LogOut, action: handleLogout, shortcut: 'L O' },
  ];

  // Itens base para todos os usuários
  const baseNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: Home, badge: null },
    { label: 'Clientes', path: '/dashboard/clientes', icon: Users, badge: null },
    { label: 'Peças', path: '/dashboard/pecas', icon: Package, badge: null },
    { label: 'Serviços', path: '/dashboard/servicos', icon: Wrench, badge: null },
    { label: 'Relatórios', path: '/dashboard/relatorios', icon: FileText, badge: null },
    { label: 'Nova NF', path: '/dashboard/nf/nova', icon: FileCode, badge: null },
    { label: 'Financeiro', path: '/dashboard/financeiro', icon: DollarSign, badge: null },
    { label: 'Análises', path: '/dashboard/analises', icon: BarChart3, badge: 'NEW' },
  ];

  // Itens exclusivos para administradores
  const adminNavItems = [
    { label: 'divider', isDivider: true },
    { label: 'ADMINISTRAÇÃO', isHeader: true },
    { label: 'Gerenciar Usuários', path: '/dashboard/usuarios', icon: UserCog, badge: 'ADMIN', color: 'orange' },
    { label: 'Configurações', path: '/dashboard/configuracoes', icon: Settings, badge: 'ADMIN', color: 'purple' },
    { label: 'Logs do Sistema', path: '/dashboard/logs', icon: Database, badge: 'ADMIN', color: 'blue' },
    { label: 'Segurança', path: '/dashboard/seguranca', icon: Shield, badge: 'ADMIN', color: 'red' },
  ];

  // Combina items baseado no papel do usuário
  const navItems = isAdmin ? [...baseNavItems, ...adminNavItems] : baseNavItems;

  // Variantes de animação para a sidebar
  const sidebarVariants = {
    open: { width: '16rem' },
    closed: { width: '5rem' },
  };

  const itemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -20 },
  };

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
      {/* Sidebar com animação */}
      <motion.aside
        variants={sidebarVariants}
        initial="open"
        animate={sidebarOpen ? 'open' : 'closed'}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col fixed h-full z-50 shadow-2xl border-r border-gray-800/50"
      >
        {/* Header da Sidebar */}
        <div className="p-5 border-b border-gray-700/30 flex items-center justify-between bg-gradient-to-r from-gray-800/30 to-transparent backdrop-blur-sm min-h-[80px]">
          <AnimatePresence mode="wait">
            {sidebarOpen ? (
              <motion.div
                key="logo-open"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-600/50">
                  <span className="text-white font-black text-xl">E</span>
                </div>
                <div>
                  <h1 className="font-black bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent text-2xl tracking-tight leading-none">
                    EDDA
                  </h1>
                  <p className="text-[10px] text-gray-400 font-medium tracking-wider mt-0.5">SISTEMA PRO</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="logo-closed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-600/50"
              >
                <span className="text-white font-black text-xl">E</span>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2.5 hover:bg-gray-700/50 rounded-xl transition-all hover:shadow-lg backdrop-blur-sm border border-transparent hover:border-gray-600/30 flex items-center justify-center"
          >
            {sidebarOpen ? <X size={20} className="text-gray-400" /> : <Menu size={20} className="text-gray-400" />}
          </motion.button>
        </div>

        {/* Navegação */}
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600">
          {/* Favoritos */}
          {favorites.length > 0 && sidebarOpen && (
            <div className="px-3 mb-4">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 px-4">Favoritos</p>
              <div className="space-y-1.5">
                {navItems.filter(item => favorites.includes(item.path)).map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={`fav-${item.path}`}
                      to={item.path}
                      className="relative group"
                    >
                      <motion.div
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
                      >
                        <Icon size={18} className="flex-shrink-0" />
                        <span className="font-semibold text-xs flex-1">{item.label}</span>
                        <Star size={14} className="fill-yellow-400" />
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Menu Principal */}
          {sidebarOpen && <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 px-7">Menu</p>}
          <div className="space-y-1.5 px-3">
            {navItems.map((item, index) => {
              // Renderizar divider
              if (item.isDivider) {
                return sidebarOpen ? (
                  <div key={`divider-${index}`} className="my-4 border-t border-gray-700/50" />
                ) : (
                  <div key={`divider-${index}`} className="my-2" />
                );
              }

              // Renderizar header de seção
              if (item.isHeader) {
                return sidebarOpen ? (
                  <div key={`header-${index}`} className="px-4 py-2 mt-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <Shield size={14} className="text-orange-500" />
                      {item.label}
                    </h3>
                  </div>
                ) : (
                  <div key={`header-${index}`} className="my-1" />
                );
              }

              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative group"
                  title={!sidebarOpen ? item.label : ''}
                >
                  <motion.div
                    whileHover={{ scale: 1.02, x: sidebarOpen ? 4 : 0 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative flex items-center ${sidebarOpen ? 'gap-3 px-4' : 'justify-center px-3'} py-3.5 rounded-xl transition-all duration-300 ${
                      active
                        ? 'bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 text-white shadow-xl shadow-orange-600/50 border border-orange-400/20'
                        : 'text-gray-300 hover:bg-gradient-to-r hover:from-gray-800/80 hover:to-gray-700/80 hover:text-white hover:shadow-lg hover:border hover:border-gray-600/20'
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-white rounded-r-full shadow-lg"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    <Icon size={22} className={`flex-shrink-0 ${active ? 'drop-shadow-lg' : ''} ${!sidebarOpen ? 'mx-auto' : ''}`} />
                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.div
                          variants={itemVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                          className="flex items-center justify-between flex-1 gap-2"
                        >
                          <span className="font-semibold text-sm">{item.label}</span>
                          <div className="flex items-center gap-1">
                            {item.badge && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={`px-2 py-0.5 text-white text-[10px] font-bold rounded-full shadow-lg ${
                                  item.badge === 'ADMIN' 
                                    ? item.color === 'orange' ? 'bg-orange-500' 
                                    : item.color === 'purple' ? 'bg-purple-500'
                                    : item.color === 'blue' ? 'bg-blue-500'
                                    : item.color === 'red' ? 'bg-red-500'
                                    : 'bg-green-500'
                                    : 'bg-green-500'
                                }`}
                              >
                                {item.badge}
                              </motion.span>
                            )}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                toggleFavorite(item.path);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Star 
                                size={14} 
                                className={favorites.includes(item.path) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'} 
                              />
                            </button>
                            {active && <ChevronRight size={16} className="opacity-70" />}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Tooltip quando fechado */}
                  {!sidebarOpen && (
                    <div className="absolute left-full ml-3 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-700 text-white text-sm font-medium rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-2xl border border-gray-600/30 group-hover:translate-x-1">
                      {item.label}
                      {item.badge === 'ADMIN' && (
                        <span className="ml-2 text-orange-400 text-xs">⚡ Admin</span>
                      )}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-gray-800"></div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer da Sidebar */}
        <div className="p-4 border-t border-gray-700/30 space-y-2 bg-gradient-to-b from-transparent via-gray-900/30 to-gray-900/50">
          <Link
            to="/profile-settings"
            className="group flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gradient-to-r hover:from-gray-800/60 hover:to-gray-700/60 hover:text-white transition-all hover:scale-[1.02] hover:shadow-lg border border-transparent hover:border-gray-600/20"
            title={!sidebarOpen ? 'Configurações' : ''}
          >
            <Settings size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            {sidebarOpen && <span className="font-semibold text-sm">Configurações</span>}
          </Link>
        </div>

        {/* User Info com animação */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="p-4 border-t border-gray-700/30 bg-gradient-to-br from-gray-800/40 via-gray-800/60 to-gray-900/80 backdrop-blur-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 rounded-full blur-3xl"></div>
              <div className="relative flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-600/30 border-2 border-gray-700/50">
                    {(user?.nome || 'A').charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-gray-900"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Logado como</p>
                  <p className="font-bold text-white truncate text-sm mt-0.5">{user?.nome || 'Administrador EDDA'}</p>
                  <p className="text-[11px] text-gray-400 truncate flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Online
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* Conteúdo Principal */}
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-500`}>
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/80 px-4 md:px-6 py-2.5 flex items-center justify-between shadow-lg sticky top-0 z-40">
          <div className="flex items-center gap-3 md:gap-4 flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-xl font-black bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent">
                EDDA
              </h1>
              <p className="text-[10px] text-gray-500 font-medium">Sistema de Relatórios</p>
            </motion.div>
            
            {/* Breadcrumb/Título da Página */}
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-gray-50 to-transparent rounded-lg border-l-2 border-orange-500"
            >
              <ChevronRight size={14} className="text-orange-500" />
              <span className="text-xs font-bold text-gray-700 capitalize">
                {location.pathname.split('/').filter(Boolean).pop()?.replace('-', ' ') || 'Dashboard'}
              </span>
            </motion.div>
          </div>

          <div className="flex items-center gap-1 md:gap-1.5 flex-wrap max-w-full">
            {/* Stats Cards Mini - Apenas telas grandes */}
            {!focusMode && !presentationMode && (
              <div className="hidden 2xl:flex items-center gap-1.5 mr-2">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className={`px-4 py-2.5 rounded-xl border shadow-sm cursor-pointer ${
                        stat.color === 'orange' ? 'bg-orange-50 border-orange-200' :
                        stat.color === 'blue' ? 'bg-blue-50 border-blue-200' :
                        'bg-green-50 border-green-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={20} className={
                          stat.color === 'orange' ? 'text-orange-600' :
                          stat.color === 'blue' ? 'text-blue-600' :
                          'text-green-600'
                        } />
                        <div>
                          <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-lg font-black text-gray-900">{stat.value}</p>
                            <span className="text-[10px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded">
                              {stat.change}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Quick Actions */}
            {!focusMode && !presentationMode && (
              <div className="hidden xl:flex items-center gap-2">
                {quickActions.map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={action.action}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${
                        action.color === 'orange' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-200' :
                        action.color === 'blue' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200' :
                        'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
                      }`}
                      title={action.label}
                    >
                      <Plus size={16} />
                    </motion.button>
                  );
                })}

              </div>
            )}

            {/* Busca Rápida */}
            {!focusMode && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCommandPaletteOpen(true)}
                className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 shadow-sm"
                title="Command Palette"
              >
                <Search size={18} />
                <span className="text-sm font-medium">{t.search}...</span>
                <kbd className="hidden xl:flex items-center gap-0.5 px-2 py-0.5 bg-white rounded text-xs border border-gray-300 text-gray-500">
                  <Command size={12} />K
                </kbd>
              </motion.button>
            )}

            {/* Activity Feed */}
            {!focusMode && (
              <div className="relative" ref={activityFeedRef}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActivityFeedOpen(!activityFeedOpen)}
                  className="p-2.5 rounded-xl hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200 shadow-sm"
                  title={t.activities}
                >
                  <Clock size={20} className="text-gray-600" />
                </motion.button>
                
                {/* Activity Feed Dropdown */}
                <AnimatePresence>
                  {activityFeedOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="fixed right-4 top-20 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[999]"
                    >
                      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                        <h3 className="font-bold text-gray-900">{t.activities}</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {loadingActivities ? (
                          <div className="p-8 text-center text-gray-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-2 text-sm">Carregando...</p>
                          </div>
                        ) : recentActivities.length === 0 ? (
                          <div className="p-8 text-center text-gray-500">
                            <Clock size={32} className="mx-auto text-gray-300 mb-2" />
                            <p className="text-sm">Nenhuma atividade recente</p>
                          </div>
                        ) : (
                          recentActivities.map((activity) => (
                            <div key={activity.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                              <div className="flex items-start gap-3">
                                <div className={`w-2 h-2 rounded-full mt-2 ${
                                  activity.tipo === 'create' ? 'bg-green-500' :
                                  activity.tipo === 'update' ? 'bg-blue-500' : 
                                  activity.tipo === 'delete' ? 'bg-red-500' :
                                  activity.tipo === 'login' ? 'bg-purple-500' :
                                  activity.tipo === 'export' ? 'bg-orange-500' : 'bg-gray-500'
                                }`}></div>
                                <div className="flex-1">
                                  <p className="text-sm text-gray-900">
                                    <span className="font-semibold">{activity.usuario}</span> {activity.acao}
                                    {activity.descricao && (
                                      <span className="text-gray-600"> - {activity.descricao}</span>
                                    )}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {formatarTempoRelativo(activity.createdAt)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Notificações */}
            <div className="relative" ref={notificationsRef}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200 shadow-sm"
                title="Notificações"
              >
                <Bell size={20} className="text-gray-600" />
                {unreadCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center"
                  >
                    <span className="text-white text-[10px] font-bold">{unreadCount}</span>
                  </motion.span>
                )}
              </motion.button>

              {/* Dropdown de Notificações */}
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="fixed right-4 top-20 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[999]"
                  >
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">Notificações</h3>
                        {unreadCount > 0 && (
                          <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">{unreadCount}</span>
                        )}
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {loadingNotifications ? (
                        <div className="p-8 text-center text-gray-500">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                          <p className="mt-2 text-sm">Carregando...</p>
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <Bell size={32} className="mx-auto text-gray-300 mb-2" />
                          <p className="text-sm">Nenhuma notificação</p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors group ${!notif.lida ? 'bg-blue-50/50' : ''}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!notif.lida ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <p className="font-semibold text-sm text-gray-900">{notif.titulo}</p>
                                    <p className="text-xs text-gray-600 mt-0.5">{notif.mensagem}</p>
                                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                      <Clock size={12} />
                                      {new Date(notif.createdAt).toLocaleDateString('pt-BR', { 
                                        day: '2-digit', 
                                        month: 'short', 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                      })}
                                    </p>
                                  </div>
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {!notif.lida && (
                                      <button
                                        onClick={() => marcarComoLida(notif.id)}
                                        className="p-1 hover:bg-blue-100 rounded text-blue-600"
                                        title="Marcar como lida"
                                      >
                                        <Check size={14} />
                                      </button>
                                    )}
                                    <button
                                      onClick={() => deletarNotificacao(notif.id)}
                                      className="p-1 hover:bg-red-100 rounded text-red-600"
                                      title="Deletar"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-3 bg-gray-50 border-t border-gray-100 flex gap-2">
                      {unreadCount > 0 && (
                        <button 
                          onClick={marcarTodasComoLidas}
                          className="flex-1 text-sm font-semibold text-blue-600 hover:text-blue-700 py-2 hover:bg-blue-50 rounded"
                        >
                          Marcar todas como lidas
                        </button>
                      )}
                      <button className="flex-1 text-sm font-semibold text-orange-600 hover:text-orange-700 py-2 hover:bg-orange-50 rounded">
                        Ver todas
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Toggle Dark Mode */}
            {!focusMode && (
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 rounded-xl hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-50 transition-all border border-transparent hover:border-gray-200 shadow-sm"
                title={darkMode ? 'Modo Claro' : 'Modo Escuro'}
              >
                {darkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-gray-600" />}
              </motion.button>
            )}

            {/* Relógio */}
            {!focusMode && (
              <div className="hidden xl:flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                <Clock size={16} />
                <span className="text-sm font-medium tabular-nums">
                  {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}

            {/* Divisor */}
            {!focusMode && <div className="w-px h-8 bg-gray-200 dark:border-gray-700"></div>}


            {/* Info do Usuário com Menu Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-2 md:px-3 py-2 bg-gradient-to-br from-orange-50 to-white rounded-xl border border-orange-200 hover:border-orange-300 transition-all shadow-sm hover:shadow-md"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white">
                  {(user?.nome || 'A').charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="font-bold text-gray-900 text-xs leading-tight">{user?.nome || 'Administrador EDDA'}</p>
                  <p className="text-[10px] text-orange-600 font-medium mt-0.5 flex items-center gap-1">
                    <span>✏️</span>
                    {user?.role === 'admin' ? 'Admin' : 'User'}
                  </p>
                </div>
                <ChevronRight size={14} className={`text-gray-400 transition-transform duration-200 hidden lg:block ${userMenuOpen ? 'rotate-90' : ''}`} />
              </motion.button>

              {/* Dropdown Menu do Usuário */}
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="fixed right-4 top-20 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-orange-100 dark:border-gray-700 overflow-hidden z-[999]"
                  >
                    {/* Header do Dropdown */}
                    <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-white/30">
                          {(user?.nome || 'A').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white text-base leading-tight truncate">{user?.nome || 'Administrador EDDA'}</p>
                          <p className="text-xs text-orange-100 truncate mt-1">{user?.email || 'admin@edda.com'}</p>
                          <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full">
                            <span className="text-xs text-white font-semibold">
                              {user?.role === 'admin' ? '👑 Administrador' : '👤 Usuário'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 dark:hover:bg-gray-700 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-orange-200 dark:group-hover:bg-gray-600 transition-colors">
                          <User size={20} className="text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Meu Perfil</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Ver informações pessoais</p>
                        </div>
                      </Link>
                      
                      <Link
                        to="/profile-settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 dark:hover:bg-gray-700 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-gray-600 transition-colors">
                          <Settings size={20} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Configurações</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Preferências do sistema</p>
                        </div>
                      </Link>
                      
                      <Link
                        to="/change-password"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 dark:hover:bg-gray-700 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-gray-600 transition-colors">
                          <Lock size={20} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Trocar Senha</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Alterar credenciais</p>
                        </div>
                      </Link>
                      
                      <Link
                        to="/help"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 dark:hover:bg-gray-700 transition-all group border-b border-gray-100 dark:border-gray-700"
                      >
                        <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-gray-600 transition-colors">
                          <HelpCircle size={20} className="text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Ajuda</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Central de suporte</p>
                        </div>
                      </Link>
                      
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group mt-1"
                      >
                        <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                          <LogOut size={20} className="text-red-600 dark:text-red-400" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-semibold text-red-600 dark:text-red-400">Sair</p>
                          <p className="text-xs text-red-500 dark:text-red-400/70">Encerrar sessão</p>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Conteúdo da Página com fade-in */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-gradient-to-br from-gray-50 via-white to-gray-100"
        >
          <Outlet />
        </motion.main>
      </div>

      {/* Modal de Busca Global */}
      <AnimatePresence>
        {searchOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-[101] overflow-hidden"
            >
              <form onSubmit={handleSearch} className="p-6">
                <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                  <Search size={24} className="text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar clientes, relatórios, peças..."
                    className="flex-1 text-lg outline-none"
                  />
                  <kbd className="px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-600 border border-gray-200">ESC</kbd>
                </div>

                {/* Sugestões */}
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">Sugestões Rápidas</p>
                  {navItems.slice(0, 5).map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center group-hover:from-orange-200 group-hover:to-orange-100 transition-colors">
                          <Icon size={20} className="text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-gray-900">{item.label}</p>
                          <p className="text-xs text-gray-500">Acessar {item.label.toLowerCase()}</p>
                        </div>
                        <ChevronRight size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    );
                  })}
                </div>

                {/* Atalhos */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                  <span>Use ↑ ↓ para navegar</span>
                  <span>↵ para selecionar</span>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Command Palette */}
      <AnimatePresence>
        {commandPaletteOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCommandPaletteOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-[101] overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                  <Command size={24} className="text-orange-600" />
                  <input
                    ref={commandInputRef}
                    type="text"
                    placeholder="Digite um comando ou busque..."
                    className="flex-1 text-lg outline-none"
                  />
                  <kbd className="px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-600 border border-gray-200">ESC</kbd>
                </div>

                <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">Comandos Disponíveis</p>
                  {commands.map((command) => {
                    const Icon = command.icon;
                    return (
                      <button
                        key={command.id}
                        onClick={() => {
                          command.action();
                          setCommandPaletteOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center group-hover:from-orange-200 group-hover:to-orange-100 transition-colors">
                          <Icon size={20} className="text-orange-600" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-semibold text-sm text-gray-900">{command.label}</p>
                          {command.shortcut && (
                            <p className="text-xs text-gray-500">Atalho: {command.shortcut}</p>
                          )}
                        </div>
                        <ChevronRight size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                  <span>Use ↑ ↓ para navegar</span>
                  <span className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-200">Ctrl</kbd>
                    <span>+</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-200">K</kbd>
                    <span>para abrir</span>
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal de Atalhos de Teclado */}
      <AnimatePresence>
        {showKeyboardShortcuts && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowKeyboardShortcuts(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-white rounded-2xl shadow-2xl z-[101] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-gray-900">⌨️ Atalhos de Teclado</h2>
                  <button
                    onClick={() => setShowKeyboardShortcuts(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 max-h-[600px] overflow-y-auto">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Command size={18} className="text-orange-600" />
                      Comandos Gerais
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Command Palette</span>
                        <kbd className="px-3 py-1 bg-white rounded border border-gray-300 text-sm font-mono">Ctrl+K</kbd>
                      </div>
                      <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Busca Rápida</span>
                        <kbd className="px-3 py-1 bg-white rounded border border-gray-300 text-sm font-mono">Ctrl+/</kbd>
                      </div>
                      <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Modo Foco</span>
                        <kbd className="px-3 py-1 bg-white rounded border border-gray-300 text-sm font-mono">F</kbd>
                      </div>
                      <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Ajuda</span>
                        <kbd className="px-3 py-1 bg-white rounded border border-gray-300 text-sm font-mono">?</kbd>
                      </div>
                      <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Fechar Modais</span>
                        <kbd className="px-3 py-1 bg-white rounded border border-gray-300 text-sm font-mono">ESC</kbd>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <TrendingUp size={18} className="text-blue-600" />
                      Navegação
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Ir para Dashboard</span>
                        <kbd className="px-3 py-1 bg-white rounded border border-gray-300 text-sm font-mono">G → D</kbd>
                      </div>
                      <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Ir para Clientes</span>
                        <kbd className="px-3 py-1 bg-white rounded border border-gray-300 text-sm font-mono">G → C</kbd>
                      </div>
                      <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Ir para Relatórios</span>
                        <kbd className="px-3 py-1 bg-white rounded border border-gray-300 text-sm font-mono">G → R</kbd>
                      </div>
                      <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Ir para Peças</span>
                        <kbd className="px-3 py-1 bg-white rounded border border-gray-300 text-sm font-mono">G → P</kbd>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
                  <p className="text-sm text-gray-700">
                    💡 <strong>Dica:</strong> Use o Command Palette (Ctrl+K) para acessar rapidamente qualquer funcionalidade do sistema!
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* IA Chat Assistant */}
      <AnimatePresence>
        {aiChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            ref={aiChatRef}
            className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-[100]"
          >
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <h3 className="font-bold">EDDA Assistant</h3>
                  <p className="text-xs opacity-90">IA sempre pronta para ajudar</p>
                </div>
              </div>
              <button onClick={() => setAiChatOpen(false)} className="p-1 hover:bg-white/20 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm flex-shrink-0">
                    🤖
                  </div>
                  <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[80%]">
                    <p className="text-sm text-gray-700">Olá! Sou a EDDA Assistant. Como posso ajudar você hoje?</p>
                    <div className="mt-2 space-y-1">
                      <button className="w-full text-left px-3 py-2 text-xs bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                        📊 Criar novo relatório
                      </button>
                      <button className="w-full text-left px-3 py-2 text-xs bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                        👥 Buscar cliente
                      </button>
                      <button className="w-full text-left px-3 py-2 text-xs bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                        📈 Ver estatísticas
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold"
                >
                  Enviar
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theme Customizer */}
      <AnimatePresence>
        {showThemeCustomizer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowThemeCustomizer(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-[101]"
            >
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-gray-900">🎨 Personalizar Tema</h2>
                  <button onClick={() => setShowThemeCustomizer(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 max-h-[600px] overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Esquema de Cores</label>
                    <div className="grid grid-cols-3 gap-3">
                      {themes.map(t => (
                        <motion.button
                          key={t.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setTheme(t.id)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            theme === t.id ? 'border-purple-500 shadow-lg' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full" style={{ background: t.colors.primary }}></div>
                            <div className="w-6 h-6 rounded-full" style={{ background: t.colors.secondary }}></div>
                          </div>
                          <p className="font-semibold text-sm">{t.name}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Densidade da Interface</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['compact', 'comfortable', 'spacious'].map(d => (
                        <motion.button
                          key={d}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setDensity(d)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            density === d ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                          }`}
                        >
                          <p className="font-semibold text-sm capitalize">{d}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Modo de Contraste</label>
                    <button className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-purple-500 transition-all text-left">
                      <p className="font-semibold">Alto Contraste (Acessibilidade)</p>
                      <p className="text-xs text-gray-600 mt-1">Para melhor legibilidade</p>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Export Center */}
      <AnimatePresence>
        {showExportCenter && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExportCenter(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-white rounded-2xl shadow-2xl z-[101]"
            >
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-gray-900">💾 Central de Exportações</h2>
                  <button onClick={() => setShowExportCenter(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {['PDF', 'Excel', 'CSV', 'JSON'].map(format => (
                    <motion.button
                      key={format}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">📄</span>
                        <div>
                          <p className="font-bold text-lg">{format}</p>
                          <p className="text-xs text-gray-600">Exportar como {format}</p>
                        </div>
                      </div>
                      <button className="mt-3 w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                        Exportar
                      </button>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-2">⚙️ Exportações Agendadas</h3>
                  <p className="text-sm text-gray-600">Configure exportações automáticas diárias, semanais ou mensais.</p>
                  <button className="mt-3 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
                    Configurar Agendamento
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Audit Log */}
      <AnimatePresence>
        {showAuditLog && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuditLog(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-white rounded-xl shadow-2xl z-[101]"
            >
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black">📜 Auditoria do Sistema</h2>
                  <button onClick={() => setShowAuditLog(false)} className="p-2 hover:bg-white/10 rounded-lg">
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 max-h-[600px] overflow-y-auto">
                <div className="space-y-2">
                  {auditLog.map(log => (
                    <div key={log.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{log.action}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Por <span className="font-semibold">{log.user}</span> • IP: {log.ip}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500">{log.timestamp.toLocaleString('pt-BR')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Tour Guiado */}
      <AnimatePresence>
        {showTour && tourStep < tourSteps.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[200] flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md mx-4"
            >
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-yellow-50">
                <h3 className="text-xl font-black text-gray-900">{tourSteps[tourStep].title}</h3>
                <p className="text-sm text-gray-600 mt-1">Passo {tourStep + 1} de {tourSteps.length}</p>
              </div>
              
              <div className="p-6">
                <p className="text-gray-700">{tourSteps[tourStep].content}</p>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-between">
                <button
                  onClick={() => {
                    setShowTour(false);
                    localStorage.setItem('tourCompleted', 'true');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold"
                >
                  Pular Tour
                </button>
                <div className="flex gap-2">
                  {tourStep > 0 && (
                    <button
                      onClick={() => setTourStep(prev => prev - 1)}
                      className="px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                    >
                      Anterior
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (tourStep === tourSteps.length - 1) {
                        setShowTour(false);
                        localStorage.setItem('tourCompleted', 'true');
                        addPoints(50, 'completar o tour');
                      } else {
                        setTourStep(prev => prev + 1);
                      }
                    }}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600"
                  >
                    {tourStep === tourSteps.length - 1 ? 'Concluir' : 'Próximo'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Notes */}
      {stickyNotes.map((note, index) => (
        <motion.div
          key={index}
          drag
          dragMomentum={false}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed w-64 h-64 bg-yellow-100 border-2 border-yellow-300 rounded-lg shadow-lg p-4 cursor-move z-50"
          style={{ top: `${100 + index * 50}px`, right: `${100 + index * 50}px` }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xl">📌</span>
            <button
              onClick={() => setStickyNotes(prev => prev.filter((_, i) => i !== index))}
              className="text-gray-600 hover:text-red-600"
            >
              <X size={16} />
            </button>
          </div>
          <textarea
            value={note}
            onChange={(e) => {
              const newNotes = [...stickyNotes];
              newNotes[index] = e.target.value;
              setStickyNotes(newNotes);
            }}
            className="w-full h-full bg-transparent resize-none outline-none text-sm"
            placeholder="Digite sua nota..."
          />
        </motion.div>
      ))}

      {/* Botão para adicionar Sticky Note */}
      {!focusMode && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setStickyNotes(prev => [...prev, ''])}
          className="fixed bottom-4 left-4 w-14 h-14 bg-yellow-400 rounded-full shadow-lg flex items-center justify-center text-2xl z-50 hover:bg-yellow-500 transition-colors"
          title="Adicionar Nota"
        >
          📌
        </motion.button>
      )}

      {/* Widget Library Modal */}
      <AnimatePresence>
        {showWidgetLibrary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowWidgetLibrary(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-purple-500 to-pink-500">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="text-3xl">🧩</span>
                    Biblioteca de Widgets
                  </h2>
                  <p className="text-purple-100 text-sm">Personalize seu dashboard com widgets interativos</p>
                </div>
                <button onClick={() => setShowWidgetLibrary(false)} className="text-white hover:bg-white/20 p-2 rounded-lg">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { icon: '📊', name: 'Gráfico de Barras', desc: 'Visualize dados em colunas', color: 'from-blue-500 to-cyan-500' },
                    { icon: '📈', name: 'Gráfico de Linha', desc: 'Acompanhe tendências', color: 'from-green-500 to-emerald-500' },
                    { icon: '🥧', name: 'Gráfico Pizza', desc: 'Proporções visuais', color: 'from-yellow-500 to-orange-500' },
                    { icon: '📅', name: 'Calendário', desc: 'Gerencie eventos', color: 'from-purple-500 to-pink-500' },
                    { icon: '✅', name: 'Lista de Tarefas', desc: 'Organize atividades', color: 'from-indigo-500 to-blue-500' },
                    { icon: '🌡️', name: 'Medidor', desc: 'KPIs em tempo real', color: 'from-red-500 to-orange-500' },
                    { icon: '🗓️', name: 'Agenda', desc: 'Compromissos do dia', color: 'from-teal-500 to-cyan-500' },
                    { icon: '📰', name: 'Feed de Notícias', desc: 'Últimas atualizações', color: 'from-gray-600 to-gray-800' },
                    { icon: '⏱️', name: 'Timer', desc: 'Pomodoro e cronômetro', color: 'from-rose-500 to-pink-500' },
                  ].map((widget, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { addWidget(widget); }}
                      className={`bg-gradient-to-br ${widget.color} p-6 rounded-xl cursor-pointer shadow-lg hover:shadow-2xl transition-all`}
                    >
                      <div className="text-5xl mb-3">{widget.icon}</div>
                      <h3 className="text-white font-bold text-lg mb-1">{widget.name}</h3>
                      <p className="text-white/80 text-sm">{widget.desc}</p>
                    </motion.div>
                  ))}
                </div>

                {dashboardWidgets.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-bold mb-4 dark:text-white">Widgets Adicionados ({dashboardWidgets.length})</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {dashboardWidgets.map((widget, idx) => (
                        <div key={idx} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{widget.icon}</span>
                            <span className="text-sm font-medium dark:text-white">{widget.name}</span>
                          </div>
                          <button
                            onClick={() => setDashboardWidgets(prev => prev.filter(w => w.id !== widget.id))}
                            className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 p-1 rounded"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Whiteboard Modal */}
      <AnimatePresence>
        {showWhiteboard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowWhiteboard(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-yellow-500 to-orange-500">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="text-3xl">🎨</span>
                    Quadro Colaborativo
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex -space-x-2">
                      {onlineUsers.map((user, idx) => (
                        <div
                          key={idx}
                          className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: user.color }}
                          title={user.name}
                        >
                          {user.avatar}
                        </div>
                      ))}
                    </div>
                    <span className="text-white/90 text-sm">{onlineUsers.length} online</span>
                  </div>
                </div>
                <button onClick={() => setShowWhiteboard(false)} className="text-white hover:bg-white/20 p-2 rounded-lg">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-inner cursor-crosshair"
                  onMouseDown={(e) => {
                    // Drawing logic here
                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext('2d');
                    ctx.beginPath();
                    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                  }}
                  onMouseMove={(e) => {
                    if (e.buttons === 1) {
                      const canvas = canvasRef.current;
                      const ctx = canvas.getContext('2d');
                      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                      ctx.stroke();
                    }
                  }}
                />
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg">
                  {['✏️', '🖍️', '🖌️', '🗑️', '↩️', '↪️'].map((tool, idx) => (
                    <button
                      key={idx}
                      className="w-12 h-12 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-2xl flex items-center justify-center"
                    >
                      {tool}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kanban Board Modal */}
      <AnimatePresence>
        {showKanban && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowKanban(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-indigo-500 to-purple-500">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="text-3xl">📋</span>
                    Quadro Kanban
                  </h2>
                  <p className="text-indigo-100 text-sm">Gerencie tarefas visualmente</p>
                </div>
                <button onClick={() => setShowKanban(false)} className="text-white hover:bg-white/20 p-2 rounded-lg">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 p-6 overflow-x-auto bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
                <div className="flex gap-4 h-full min-w-max">
                  {Object.entries(kanbanColumns).map(([column, tasks]) => (
                    <div key={column} className="flex-1 min-w-[300px]">
                      <div className={`bg-gradient-to-r ${
                        column === 'todo' ? 'from-gray-500 to-gray-600' :
                        column === 'inProgress' ? 'from-blue-500 to-indigo-500' :
                        'from-green-500 to-emerald-500'
                      } p-4 rounded-t-xl`}>
                        <h3 className="font-bold text-white text-lg flex items-center justify-between">
                          <span>{column === 'todo' ? '📝 A Fazer' : column === 'inProgress' ? '⚙️ Em Progresso' : '✅ Concluído'}</span>
                          <span className="bg-white/20 px-2 py-1 rounded-full text-sm">{tasks.length}</span>
                        </h3>
                      </div>
                      <div className="bg-white dark:bg-gray-700 rounded-b-xl p-4 space-y-3 min-h-[500px]">
                        {tasks.map((task, idx) => (
                          <motion.div
                            key={idx}
                            drag
                            dragMomentum={false}
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-600 dark:to-gray-700 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 cursor-move"
                          >
                            <h4 className="font-semibold dark:text-white">{task.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{task.desc}</p>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 px-2 py-1 rounded-full">
                                {task.priority}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{task.date}</span>
                            </div>
                          </motion.div>
                        ))}
                        <button
                          onClick={() => {
                            setKanbanColumns({
                              ...kanbanColumns,
                              [column]: [...tasks, { title: 'Nova Tarefa', desc: 'Descrição', priority: 'Média', date: new Date().toLocaleDateString() }]
                            });
                            playSound('success');
                          }}
                          className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-gray-500 dark:text-gray-400"
                        >
                          + Adicionar Tarefa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analytics Modal */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAnalytics(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-cyan-500 to-blue-500">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="text-3xl">📊</span>
                    Analytics Avançado
                  </h2>
                  <p className="text-cyan-100 text-sm">Insights detalhados do sistema</p>
                </div>
                <button onClick={() => setShowAnalytics(false)} className="text-white hover:bg-white/20 p-2 rounded-lg">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { icon: '👥', label: 'Usuários Ativos', value: '1,234', change: '+12%', color: 'from-blue-500 to-cyan-500' },
                    { icon: '📈', label: 'Taxa de Conversão', value: '68%', change: '+5%', color: 'from-green-500 to-emerald-500' },
                    { icon: '⏱️', label: 'Tempo Médio', value: '4m 32s', change: '-8%', color: 'from-purple-500 to-pink-500' },
                    { icon: '🎯', label: 'Meta do Mês', value: '87%', change: '+15%', color: 'from-orange-500 to-red-500' },
                  ].map((metric, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className={`bg-gradient-to-br ${metric.color} p-6 rounded-xl shadow-lg text-white`}
                    >
                      <div className="text-4xl mb-2">{metric.icon}</div>
                      <div className="text-3xl font-bold">{metric.value}</div>
                      <div className="text-sm opacity-90">{metric.label}</div>
                      <div className="mt-2 text-xs font-semibold bg-white/20 px-2 py-1 rounded-full inline-block">
                        {metric.change}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl">
                    <h3 className="font-bold text-lg mb-4 dark:text-white flex items-center gap-2">
                      <span>📊</span> Desempenho Semanal
                    </h3>
                    <div className="h-64 flex items-end justify-between gap-2">
                      {[65, 78, 45, 90, 67, 88, 95].map((value, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ height: 0 }}
                          animate={{ height: `${value}%` }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex-1 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg relative group"
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {value}%
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                        <span key={day}>{day}</span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl">
                    <h3 className="font-bold text-lg mb-4 dark:text-white flex items-center gap-2">
                      <span>🎯</span> Top Ações
                    </h3>
                    <div className="space-y-3">
                      {[
                        { action: 'Login de Usuários', count: 1847, color: 'bg-blue-500' },
                        { action: 'Relatórios Gerados', count: 1234, color: 'bg-green-500' },
                        { action: 'Documentos Criados', count: 892, color: 'bg-purple-500' },
                        { action: 'Exportações', count: 567, color: 'bg-orange-500' },
                        { action: 'Compartilhamentos', count: 423, color: 'bg-pink-500' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium dark:text-white">{item.action}</span>
                              <span className="text-sm font-bold dark:text-white">{item.count}</span>
                            </div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(item.count / 1847) * 100}%` }}
                                transition={{ delay: idx * 0.1 }}
                                className={`h-full ${item.color}`}
                              ></motion.div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Performance Monitor - Fixed Position */}
      {showPerfMonitor && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-16 right-2 bg-black/90 backdrop-blur-md text-white p-3 rounded-lg shadow-2xl z-[90] border border-green-500/30 text-xs"
        >
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-green-400" />
            <span className="font-bold">Performance</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between gap-3">
              <span className="text-gray-400">FPS:</span>
              <span className={`font-mono font-bold ${perfMetrics.fps >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                {perfMetrics.fps}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-400">Memory:</span>
              <span className="font-mono font-bold text-blue-400">{perfMetrics.memory} MB</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-400">Latency:</span>
              <span className={`font-mono font-bold ${perfMetrics.latency < 100 ? 'text-green-400' : 'text-yellow-400'}`}>
                {perfMetrics.latency}ms
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Voice Command Indicator */}
      {voiceEnabled && isListening && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full shadow-2xl z-[90] flex items-center gap-2 text-sm"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <Mic size={18} />
          </motion.div>
          <div>
            <div className="font-bold">Ouvindo...</div>
            {voiceCommand && <div className="text-xs opacity-90">{voiceCommand}</div>}
          </div>
        </motion.div>
      )}

      {/* Focus Mode 2.0 Overlay */}
      {focusMode2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-blue-900/95 backdrop-blur-xl z-[85] flex items-center justify-center"
        >
          <div className="text-center text-white">
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="text-8xl mb-6"
            >
              🧘
            </motion.div>
            <h2 className="text-4xl font-bold mb-4">Modo Zen Ativado</h2>
            <p className="text-xl text-purple-200 mb-8">Respire fundo e mantenha o foco</p>
            
            {breathingExercise && (
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 8 }}
                className="w-32 h-32 mx-auto mb-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
              >
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 8 }}
                  className="text-2xl"
                >
                  {Math.floor(Date.now() / 4000) % 2 === 0 ? 'Inspire' : 'Expire'}
                </motion.div>
              </motion.div>
            )}
            
            <div className="flex gap-4 justify-center mb-6">
              <button
                onClick={() => setAmbientSound('rain')}
                className={`px-6 py-3 rounded-xl ${ambientSound === 'rain' ? 'bg-white/30' : 'bg-white/10'} backdrop-blur-sm`}
              >
                🌧️ Chuva
              </button>
              <button
                onClick={() => setAmbientSound('forest')}
                className={`px-6 py-3 rounded-xl ${ambientSound === 'forest' ? 'bg-white/30' : 'bg-white/10'} backdrop-blur-sm`}
              >
                🌲 Floresta
              </button>
              <button
                onClick={() => setAmbientSound('ocean')}
                className={`px-6 py-3 rounded-xl ${ambientSound === 'ocean' ? 'bg-white/30' : 'bg-white/10'} backdrop-blur-sm`}
              >
                🌊 Oceano
              </button>
            </div>
            
            <button
              onClick={() => setBreathingExercise(!breathingExercise)}
              className="px-8 py-4 bg-white/20 backdrop-blur-sm rounded-xl font-semibold mb-8 hover:bg-white/30 transition-all"
            >
              {breathingExercise ? '⏸️ Pausar' : '🫁 Exercício de Respiração'}
            </button>
            
            <button
              onClick={() => setFocusMode2(false)}
              className="px-6 py-3 bg-red-500/80 backdrop-blur-sm rounded-xl font-semibold hover:bg-red-500 transition-all"
            >
              Sair do Modo Zen
            </button>
          </div>
        </motion.div>
      )}

      {/* Screenshot & Recording Tool Modal */}
      <AnimatePresence>
        {showScreenshotTool && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowScreenshotTool(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-purple-500 to-pink-500">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Camera size={28} />
                    Screenshot & Gravação
                  </h2>
                  <p className="text-purple-100 text-sm">Capture telas e grave vídeos</p>
                </div>
                <button onClick={() => setShowScreenshotTool(false)} className="text-white hover:bg-white/20 p-2 rounded-lg">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={takeScreenshot}
                    className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <Camera size={32} className="mx-auto mb-3" />
                    <div className="font-bold text-lg">📸 Screenshot</div>
                    <div className="text-sm opacity-90">Capturar tela atual</div>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`p-6 ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-br from-pink-500 to-pink-600'} text-white rounded-xl shadow-lg hover:shadow-xl transition-all`}
                  >
                    {isRecording ? <Square size={32} className="mx-auto mb-3" /> : <Video size={32} className="mx-auto mb-3" />}
                    <div className="font-bold text-lg">{isRecording ? '⏹️ Parar' : '🎥 Gravar'}</div>
                    <div className="text-sm opacity-90">{isRecording ? 'Finalizar gravação' : 'Gravar tela'}</div>
                  </motion.button>
                </div>

                {screenshots.length > 0 && (
                  <div>
                    <h3 className="font-bold text-lg mb-4 dark:text-white">Capturas Recentes ({screenshots.length})</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {screenshots.slice(0, 6).map((shot) => (
                        <div key={shot.id} className="relative group">
                          <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md flex items-center justify-center">
                            <Camera size={48} className="text-gray-400" />
                          </div>
                          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100">
                              <Download size={16} />
                            </button>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">{shot.timestamp.toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theme Builder Modal */}
      <AnimatePresence>
        {showThemeBuilder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowThemeBuilder(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-pink-500 to-purple-500">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Palette size={28} />
                    Custom Theme Builder
                  </h2>
                  <p className="text-pink-100 text-sm">Crie seu tema personalizado</p>
                </div>
                <button onClick={() => setShowThemeBuilder(false)} className="text-white hover:bg-white/20 p-2 rounded-lg">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 dark:text-white">Cor Primária</label>
                    <input
                      type="color"
                      value={customTheme.primary}
                      onChange={(e) => setCustomTheme({...customTheme, primary: e.target.value})}
                      className="w-full h-12 rounded-lg cursor-pointer"
                    />
                    <div className="mt-2 text-xs text-gray-500 font-mono">{customTheme.primary}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 dark:text-white">Cor Secundária</label>
                    <input
                      type="color"
                      value={customTheme.secondary}
                      onChange={(e) => setCustomTheme({...customTheme, secondary: e.target.value})}
                      className="w-full h-12 rounded-lg cursor-pointer"
                    />
                    <div className="mt-2 text-xs text-gray-500 font-mono">{customTheme.secondary}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 dark:text-white">Cor de Destaque</label>
                    <input
                      type="color"
                      value={customTheme.accent}
                      onChange={(e) => setCustomTheme({...customTheme, accent: e.target.value})}
                      className="w-full h-12 rounded-lg cursor-pointer"
                    />
                    <div className="mt-2 text-xs text-gray-500 font-mono">{customTheme.accent}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 dark:text-white">Fundo</label>
                    <input
                      type="color"
                      value={customTheme.background}
                      onChange={(e) => setCustomTheme({...customTheme, background: e.target.value})}
                      className="w-full h-12 rounded-lg cursor-pointer"
                    />
                    <div className="mt-2 text-xs text-gray-500 font-mono">{customTheme.background}</div>
                  </div>
                </div>

                <div className="p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 mb-6" style={{backgroundColor: customTheme.background}}>
                  <h3 className="font-bold text-lg mb-3" style={{color: customTheme.text}}>Preview do Tema</h3>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-lg font-semibold text-white" style={{backgroundColor: customTheme.primary}}>
                      Botão Primário
                    </button>
                    <button className="px-4 py-2 rounded-lg font-semibold text-white" style={{backgroundColor: customTheme.secondary}}>
                      Botão Secundário
                    </button>
                    <button className="px-4 py-2 rounded-lg font-semibold text-white" style={{backgroundColor: customTheme.accent}}>
                      Destaque
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={applyCustomTheme}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl"
                  >
                    <Save size={20} className="inline mr-2" />
                    Aplicar Tema
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCustomTheme({ primary: '#f97316', secondary: '#3b82f6', accent: '#10b981', background: '#ffffff', text: '#1f2937' })}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    <RotateCcw size={20} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pomodoro Timer Modal */}
      <AnimatePresence>
        {showPomodoro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowPomodoro(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-red-500 to-orange-500">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Timer size={28} />
                    Pomodoro Timer
                  </h2>
                  <p className="text-red-100 text-sm">Técnica de produtividade 25/5</p>
                </div>
                <button onClick={() => setShowPomodoro(false)} className="text-white hover:bg-white/20 p-2 rounded-lg">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-8 text-center">
                <div className="relative w-64 h-64 mx-auto mb-8">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-200 dark:text-gray-700" />
                    <circle
                      cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="none"
                      strokeDasharray={`${2 * Math.PI * 120}`}
                      strokeDashoffset={`${2 * Math.PI * 120 * (1 - pomodoroTime / (25 * 60))}`}
                      className="text-red-500 transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div>
                      <div className="text-6xl font-bold dark:text-white mb-2">{formatTime(pomodoroTime)}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {isTimerRunning ? '🍅 Focando...' : 'Pronto para começar'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center mb-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`px-8 py-4 rounded-xl font-bold text-white shadow-lg flex items-center gap-2 ${
                      isTimerRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {isTimerRunning ? <Pause size={24} /> : <Play size={24} />}
                    <span>{isTimerRunning ? 'Pausar' : 'Iniciar'}</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setPomodoroTime(25 * 60); setIsTimerRunning(false); }}
                    className="px-6 py-4 rounded-xl font-bold bg-gray-500 hover:bg-gray-600 text-white shadow-lg"
                  >
                    <RotateCcw size={24} />
                  </motion.button>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="text-3xl font-bold text-red-500">{pomodoroSessions}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Pomodoros</div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="text-3xl font-bold text-blue-500">{Math.floor(pomodoroSessions * 25 / 60)}h</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Tempo Focado</div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="text-3xl font-bold text-green-500">{userPoints}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Pontos</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goal Tracker Modal */}
      <AnimatePresence>
        {showGoalTracker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowGoalTracker(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-amber-500 to-orange-500">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Target size={28} />
                    Goal Tracker
                  </h2>
                  <p className="text-amber-100 text-sm">Acompanhe suas metas e objetivos</p>
                </div>
                <button onClick={() => setShowGoalTracker(false)} className="text-white hover:bg-white/20 p-2 rounded-lg">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <motion.div
                      key={goal.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-md"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg dark:text-white">{goal.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Meta: {goal.target} | Prazo: {goal.deadline}</p>
                        </div>
                        <div className="text-3xl font-bold text-amber-500">{goal.progress}%</div>
                      </div>
                      
                      <div className="relative">
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${goal.progress}%` }}
                            transition={{ duration: 1 }}
                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                          />
                        </div>
                        <div className="absolute -top-8 right-0 text-2xl">
                          {goal.progress >= 100 ? '🏆' : goal.progress >= 75 ? '🔥' : goal.progress >= 50 ? '💪' : '🎯'}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          setGoals(goals.map(g => g.id === goal.id ? { ...g, progress: Math.min(100, g.progress + 10) } : g));
                          if (goal.progress + 10 >= 100) {
                            setShowConfetti(true);
                            playSound('success');
                            addPoints(50, 'completar meta');
                          }
                        }}
                        className="mt-4 w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold"
                      >
                        +10% Progresso
                      </button>
                    </motion.div>
                  ))}
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setGoals([...goals, { id: Date.now(), title: 'Nova Meta', progress: 0, target: 100, deadline: new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString() }]);
                    }}
                    className="w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Plus size={24} className="mx-auto mb-2 text-gray-400" />
                    <div className="font-semibold text-gray-500 dark:text-gray-400">Adicionar Nova Meta</div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* API Playground Modal */}
      <AnimatePresence>
        {showApiPlayground && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowApiPlayground(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-green-500 to-emerald-500">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Code size={28} />
                    API Playground
                  </h2>
                  <p className="text-green-100 text-sm">Teste endpoints REST em tempo real</p>
                </div>
                <button onClick={() => setShowApiPlayground(false)} className="text-white hover:bg-white/20 p-2 rounded-lg">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="grid grid-cols-12 gap-4 mb-4">
                  <select className="col-span-2 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white font-semibold">
                    <option>GET</option>
                    <option>POST</option>
                    <option>PUT</option>
                    <option>DELETE</option>
                    <option>PATCH</option>
                  </select>
                  <input
                    type="text"
                    placeholder="https://api.example.com/endpoint"
                    className="col-span-8 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="col-span-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-bold shadow-lg"
                  >
                    Enviar
                  </motion.button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-bold mb-3 dark:text-white flex items-center gap-2">
                      📤 Request Body
                    </h3>
                    <textarea
                      placeholder='{\n  "key": "value"\n}'
                      className="w-full h-64 p-4 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-green-400 font-mono text-sm"
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-bold mb-3 dark:text-white flex items-center gap-2">
                      📥 Response
                      <span className="ml-auto text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">200 OK</span>
                    </h3>
                    <div className="w-full h-64 p-4 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 overflow-auto">
                      <pre className="text-sm text-gray-700 dark:text-green-400 font-mono">
{`{
  "success": true,
  "data": {
    "message": "API conectada",
    "timestamp": "${new Date().toISOString()}"
  }
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-bold mb-3 dark:text-white">Headers</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="Content-Type" className="px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                    <input placeholder="application/json" className="px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Zone Modal */}
      <AnimatePresence>
        {showUploadZone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowUploadZone(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-violet-500 to-purple-500">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Upload size={28} />
                    Upload Zone
                  </h2>
                  <p className="text-violet-100 text-sm">Arraste arquivos ou clique para selecionar</p>
                </div>
                <button onClick={() => setShowUploadZone(false)} className="text-white hover:bg-white/20 p-2 rounded-lg">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const files = Array.from(e.dataTransfer.files);
                    setUploadedFiles(prev => [...prev, ...files.map(f => ({ id: Date.now() + Math.random(), name: f.name, size: f.size, type: f.type }))]);
                    playSound('success');
                    toast.success(`${files.length} arquivo(s) adicionado(s)!`);
                  }}
                  className={`border-4 border-dashed rounded-2xl p-12 text-center transition-all ${
                    isDragging 
                      ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-violet-400'
                  }`}
                >
                  <Upload size={64} className={`mx-auto mb-4 ${isDragging ? 'text-violet-500' : 'text-gray-400'}`} />
                  <h3 className="text-xl font-bold mb-2 dark:text-white">
                    {isDragging ? 'Solte os arquivos aqui!' : 'Arraste arquivos aqui'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    ou clique para selecionar
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setUploadedFiles(prev => [...prev, ...files.map(f => ({ id: Date.now() + Math.random(), name: f.name, size: f.size, type: f.type }))]);
                    }}
                    className="hidden"
                    id="fileInput"
                  />
                  <label
                    htmlFor="fileInput"
                    className="inline-block px-6 py-3 bg-violet-500 text-white rounded-lg font-semibold cursor-pointer hover:bg-violet-600"
                  >
                    Selecionar Arquivos
                  </label>
                </motion.div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-bold mb-3 dark:text-white">Arquivos ({uploadedFiles.length})</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {uploadedFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center">
                              <FileText size={20} className="text-violet-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-sm dark:text-white">{file.name}</div>
                              <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</div>
                            </div>
                          </div>
                          <button
                            onClick={() => setUploadedFiles(prev => prev.filter(f => f.id !== file.id))}
                            className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 p-2 rounded-lg"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workflow Builder Modal */}
      <AnimatePresence>
        {showWorkflowBuilder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowWorkflowBuilder(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-yellow-500 to-orange-500">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Zap size={28} />
                    Workflow Automation Builder
                  </h2>
                  <p className="text-yellow-100 text-sm">Crie automações sem código</p>
                </div>
                <button onClick={() => setShowWorkflowBuilder(false)} className="text-white hover:bg-white/20 p-2 rounded-lg">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 p-6 overflow-auto">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="col-span-1 space-y-3">
                    <h3 className="font-bold dark:text-white mb-3">📦 Blocos Disponíveis</h3>
                    {[
                      { icon: '🔔', title: 'Trigger', desc: 'Quando algo acontece' },
                      { icon: '🔍', title: 'Condição', desc: 'Se... então...' },
                      { icon: '⚡', title: 'Ação', desc: 'Executar algo' },
                      { icon: '⏱️', title: 'Delay', desc: 'Aguardar tempo' },
                      { icon: '📧', title: 'Email', desc: 'Enviar email' },
                      { icon: '📊', title: 'Relatório', desc: 'Gerar relatório' },
                    ].map((block, idx) => (
                      <motion.div
                        key={idx}
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        whileHover={{ scale: 1.05 }}
                        className="p-4 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg cursor-move shadow-md border-2 border-yellow-300 dark:border-yellow-700"
                      >
                        <div className="text-2xl mb-2">{block.icon}</div>
                        <div className="font-bold text-sm dark:text-white">{block.title}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{block.desc}</div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="col-span-2 bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 min-h-[500px]">
                    <h3 className="font-bold dark:text-white mb-4">🎯 Canvas de Workflow</h3>
                    <div className="text-center text-gray-400 mt-20">
                      <Zap size={64} className="mx-auto mb-4 opacity-50" />
                      <p>Arraste blocos aqui para criar seu workflow</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-bold shadow-lg"
                  >
                    <Save size={20} className="inline mr-2" />
                    Salvar Workflow
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold shadow-lg"
                  >
                    <Play size={20} className="inline mr-2" />
                    Testar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Search Modal */}
      <AnimatePresence>
        {showAdvancedSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAdvancedSearch(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-blue-500 to-indigo-500">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Filter size={28} />
                    Busca Avançada
                  </h2>
                  <p className="text-blue-100 text-sm">Filtros e pesquisa avançada</p>
                </div>
                <button onClick={() => setShowAdvancedSearch(false)} className="text-white hover:bg-white/20 p-2 rounded-lg">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6">
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Pesquisar em todo o sistema..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-lg focus:border-blue-500"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 dark:text-white">Tipo de Documento</label>
                    <select className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                      <option>Todos</option>
                      <option>Relatórios</option>
                      <option>Clientes</option>
                      <option>Ordens de Serviço</option>
                      <option>Peças</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 dark:text-white">Período</label>
                    <select className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                      <option>Todos os períodos</option>
                      <option>Hoje</option>
                      <option>Última semana</option>
                      <option>Último mês</option>
                      <option>Último ano</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 dark:text-white">Status</label>
                    <select className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                      <option>Qualquer status</option>
                      <option>Ativo</option>
                      <option>Pendente</option>
                      <option>Concluído</option>
                      <option>Cancelado</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 dark:text-white">Ordenar por</label>
                    <select className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                      <option>Mais recente</option>
                      <option>Mais antigo</option>
                      <option>Nome (A-Z)</option>
                      <option>Nome (Z-A)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold shadow-lg"
                  >
                    <Search size={20} className="inline mr-2" />
                    Buscar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl font-semibold"
                  >
                    Limpar Filtros
                  </motion.button>
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <h3 className="font-bold text-sm text-blue-900 dark:text-blue-300 mb-2">💡 Dica Pro</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    Use aspas para busca exata: "ordem de serviço"<br />
                    Use * para coringa: rel*ório<br />
                    Use - para excluir: busca -cancelado
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, x: Math.random() * window.innerWidth, opacity: 1 }}
              animate={{ 
                y: window.innerHeight + 20, 
                x: Math.random() * window.innerWidth,
                rotate: Math.random() * 720,
                opacity: 0
              }}
              transition={{ duration: Math.random() * 2 + 2, delay: Math.random() * 0.5 }}
              className="absolute w-3 h-3 rounded-full"
              style={{ backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'][Math.floor(Math.random() * 6)] }}
            />
          ))}
        </div>
      )}

      {/* Floating Windows */}
      {floatingWindows.map((window) => (
        <motion.div
          key={window.id}
          drag
          dragMomentum={false}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          style={{
            left: window.position.x,
            top: window.position.y,
            width: window.size.width,
            height: window.size.height,
            zIndex: 60
          }}
        >
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 flex justify-between items-center cursor-move">
            <span className="text-white font-semibold">{window.title}</span>
            <button
              onClick={() => setFloatingWindows(prev => prev.filter(w => w.id !== window.id))}
              className="text-white hover:bg-white/20 p-1 rounded"
            >
              <X size={18} />
            </button>
          </div>
          <div className="p-4 overflow-auto h-[calc(100%-52px)]">
            {window.content}
          </div>
        </motion.div>
      ))}
    </div>
  );
}