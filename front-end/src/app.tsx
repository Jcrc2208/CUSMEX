import { useEffect, useState } from 'react';
import ConfiUser from './components/pages/confi_user.jsx';
import Login from './components/pages/login.jsx';
import Inicio from './components/pages/inicio.jsx';
import Agenda from './components/pages/agenda.jsx';
import Networking from './components/pages/networking.jsx'; 

import {
  applyLanguage,
  getInitialLanguage,
} from './components/pages/login-i18n';
import {
  parseRouteFromHash,
} from './config/platform-modules';

const THEME_STORAGE_KEY = 'cusmex-theme';

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
    function handleHashChange() {
      setRoute(parseRouteFromHash());
    }

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
    onToggleTheme: () => setIsDarkMode((value) => !value),
    onNavigate: handleNavigate,
  };

  const isAuthenticated = !!localStorage.getItem('auth_token');

  // Configuración de Usuario
  if (route.moduleId === 'confi_user' || route.moduleId === 'Configuración Inicial') {
    return <ConfiUser {...sharedProps} />;
  }

  // Autenticación (auth)
  if (!isAuthenticated) {
    return <Login {...sharedProps} />;
  }

  // Enrutamiento según route.moduleId
  if (route.moduleId === 'inicio') {
    return <Inicio {...sharedProps} />;
  }

  if (route.moduleId === 'agenda') {
    return <Agenda sessionId={route.sessionId} {...sharedProps} />;
  }

  if (route.moduleId === 'networking') {
    return <Networking {...sharedProps} />;
  }

  // 🛡️ FALLBACK: Si entra a un hash desconocido o no contemplado
  return <Inicio {...sharedProps} />;
}