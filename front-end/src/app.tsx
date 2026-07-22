import { useEffect, useState } from 'react';
import Login from './components/pages/login.jsx';
import Inicio from './components/pages/inicio.jsx';
import Agenda from './components/pages/agenda.jsx';
import Admin from './components/pages/admin.jsx';
import ModulePlaceholder from './components/pages/module-placeholder.jsx';
import {
  applyLanguage,
  getInitialLanguage,
} from './components/pages/login-i18n';
import {
  parseRouteFromHash,
  isModuleAvailable,
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

  // Enrutamiento según route.moduleId
  if (route.moduleId === 'inicio') {
    return <Inicio {...sharedProps} />;
  }

  if (route.moduleId === 'agenda') {
    return <Agenda sessionId={route.sessionId} {...sharedProps} />;
  }

  if (route.moduleId === 'administracion') {
    return <Admin {...sharedProps} />;
  }

  if (!isModuleAvailable(route.moduleId)) {
    return <ModulePlaceholder moduleId={route.moduleId} {...sharedProps} />;
  }

  return <Login {...sharedProps} />;
}