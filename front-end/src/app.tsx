import { useEffect, useState, ComponentType } from 'react';
import ConfiUser from './components/pages/confi_user.jsx';
import Login from './components/pages/login.jsx';
import Inicio from './components/pages/inicio.jsx';
import Agenda from './components/pages/agenda.jsx';
import Admin from './components/pages/admin.jsx';
import Networking from './components/pages/networking.jsx'; 
import Comites from './components/pages/comites.jsx';
import Sponsors from './components/pages/sponsors.jsx';

import {
  applyLanguage,
  getInitialLanguage,
} from './components/pages/login-i18n';
import {
  parseRouteFromHash,
} from './config/platform-modules';

const THEME_STORAGE_KEY = 'cusmex-theme';

// Mapa de componentes directos por id de módulo
const MODULE_MAP: Record<string, ComponentType<any>> = {
  inicio: Inicio,
  comites: Comites,
  networking: Networking,
};

function getInitialTheme() {
  if (typeof window === 'undefined') return false;
  const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === 'dark') return true;
  if (saved === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyTheme(isDark: boolean) {
  document.documentElement.classList.toggle('dark', isDark);
  window.localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
}

export default function App() {
  const [route, setRoute] = useState(parseRouteFromHash);
  const [language, setLanguage] = useState(getInitialLanguage);
  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);

  useEffect(() => {
    const handleHashChange = () => setRoute(parseRouteFromHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    applyTheme(isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    applyLanguage(language);
  }, [language]);

  const handleNavigate = (moduleId: string) => {
    window.location.hash = `#${moduleId}`;
  };

  const sharedProps = {
    language,
    onLanguageChange: setLanguage,
    isDarkMode,
    onToggleTheme: () => setIsDarkMode((prev) => !prev),
    onNavigate: handleNavigate,
  };

  // Autenticación y Roles
  const isAuthenticated = !!localStorage.getItem('auth_token');
  const userRole = localStorage.getItem('user_role')?.toLowerCase() || '';
  const isAdmin = userRole === 'admin' || userRole === 'administrador';
  const isSponsor = userRole === 'patrocinador' || isAdmin;

  // 1. Vistas especiales / Configuración pública
  if (route.moduleId === 'confi_user' || route.moduleId === 'Configuración Inicial') {
    return <ConfiUser {...sharedProps} />;
  }

  // 2. Control de acceso
  if (!isAuthenticated) {
    return <Login {...sharedProps} />;
  }

  // 3. Módulos con lógica específica o props adicionales
  if (route.moduleId === 'agenda') {
    return <Agenda sessionId={route.sessionId} {...sharedProps} />;
  }

  if (route.moduleId === 'sponsors') {
    return isSponsor ? <Sponsors {...sharedProps} /> : <Inicio {...sharedProps} />;
  }

  if (route.moduleId === 'administracion') {
    if (!isAdmin) {
      window.location.hash = '#inicio';
      return <Inicio {...sharedProps} />;
    }
    return <Admin {...sharedProps} />;
  }

  // 4. Módulos estándar (Inicio, Comités, Networking)
  const TargetModule = MODULE_MAP[route.moduleId];
  if (TargetModule) {
    return <TargetModule {...sharedProps} />;
  }

  //FALLBACK: Si no coincide con ninguna ruta válida
  return <Inicio {...sharedProps} />;
}