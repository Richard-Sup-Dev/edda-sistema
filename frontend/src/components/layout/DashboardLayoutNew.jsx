// src/components/layout/DashboardLayoutNew.jsx
// Este arquivo foi restaurado para o padrão moderno, usando a mesma estrutura do DashboardLayout.jsx
// Para manter a separação de responsabilidades e hooks, toda a lógica e JSX são idênticos ao DashboardLayout.jsx

import { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AIAssistant from '@/components/AIAssistant';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardState } from '@/hooks/useDashboardState';
import { useDashboardNotifications } from '@/hooks/useDashboardNotifications';
import { useDashboardActivities } from '@/hooks/useDashboardActivities';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import UserMenu from '@/components/dashboard/UserMenu';
import CommandPalette from '@/components/dashboard/CommandPalette';
import KeyboardShortcutsModal from '@/components/dashboard/KeyboardShortcutsModal';
import QuickActions from '@/components/dashboard/QuickActions';
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

// Copie todo o conteúdo da função DashboardLayout de DashboardLayout.jsx aqui
// Para evitar duplicidade, recomenda-se importar e exportar a função diretamente



// Corrige erro de referência para 'theme'
import DashboardLayoutNew from './DashboardLayout';

export default function DashboardLayoutNewWrapper(props) {
  // Defina o estado theme (e density, se necessário)
  const [theme, setTheme] = useState('default');
  const [density, setDensity] = useState('comfortable');

  // Passe theme e density como props, se necessário
  return <DashboardLayoutNew theme={theme} setTheme={setTheme} density={density} setDensity={setDensity} {...props} />;
}
