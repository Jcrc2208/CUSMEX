import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  Menu,
  Moon,
  Sun,
  Languages,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { COPY, LANGUAGES } from '../pages/login-i18n';
import { navigateToModule } from '@/config/platform-modules';
import '../pages/login.css';

import FloatingAIButton from './floating-ai-button';

const SPONSOR_BRANDS = [
  { name: 'Meta', logo: '/brands/meta.svg' },
  { name: 'Tesla', logo: '/brands/tesla.svg' },
  { name: 'NVIDIA', logo: '/brands/nvidia.svg' },
  { name: 'Microsoft', logo: '/brands/microsoft.svg' },
  { name: 'Google', logo: '/brands/google.svg' },
  { name: 'Amazon', logo: '/brands/amazon.svg' },
];

export default function PlatformLayout({
  activeModuleId,
  language,
  onLanguageChange,
  isDarkMode,
  onToggleTheme,
  badgeIcon: BadgeIcon,
  badgeLabel,
  children,
  onNavigate,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModulesOpen, setIsModulesOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const modulesMenuRef = useRef(null);
  const languageMenuRef = useRef(null);

  const t = COPY[language] ?? COPY.es;
  const modules = t.modules.map((module) => ({
    ...module,
    active: module.id === activeModuleId,
  }));
  const currentLanguage =
    LANGUAGES.find((item) => item.code === language) ?? LANGUAGES[0];

  // Función integrada para comunicarse con el endpoint de FastAPI
  const handleSendMessageToAI = async (inputText, currentUser, currentItemContent) => {
    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: inputText,
          uploaded_by: currentUser,
          item_content: currentItemContent
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return data.response;
      } else {
        console.error("Error del servidor:", data.detail);
        return "Hubo un error al procesar tu solicitud con la IA.";
      }
    } catch (error) {
      console.error("Error de red conectando con FastAPI:", error);
      return "No se pudo conectar con el servidor de IA.";
    }
  };

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');

    function handleViewportChange(event) {
      if (!event.matches) {
        setIsMobileMenuOpen(false);
      } else {
        setIsModulesOpen(false);
      }
    }

    handleViewportChange(media);
    media.addEventListener('change', handleViewportChange);
    return () => media.removeEventListener('change', handleViewportChange);
  }, []);

  useEffect(() => {
    function handlePointerDown(event) {
      const target = event.target;
      if (modulesMenuRef.current && !modulesMenuRef.current.contains(target)) {
        setIsModulesOpen(false);
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(target)) {
        setIsLanguageOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsModulesOpen(false);
        setIsLanguageOpen(false);
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  function handleModuleSelect(module) {
    setIsModulesOpen(false);
    closeMobileMenu();
    navigateToModule(module.id);
  }

  function handleLanguageSelect(code) {
    onLanguageChange(code);
    setIsLanguageOpen(false);
  }

  return (
    <div className="cusmex-page-wrapper">
      <div className="page-glow page-glow--one" aria-hidden="true" />
      <div className="page-glow page-glow--two" aria-hidden="true" />

      <header className="navbar-container animate-fade-down">
        <nav className="navbar-pill">
          <div className="navbar-logo">
            <strong>NATP Nexus</strong>
            <span className="navbar-logo-sub">Oakland Edition</span>
          </div>

          <div className="navbar-links">
            <span className="nav-active-badge">
              {BadgeIcon && <BadgeIcon className="h-3.5 w-3.5" />}
              {badgeLabel}
            </span>

            <div className="modules-menu" ref={modulesMenuRef}>
              <Button
                type="button"
                variant="ghost"
                className="rounded-full px-3 text-muted-foreground hover:text-foreground"
                aria-expanded={isModulesOpen}
                aria-haspopup="menu"
                onClick={() => {
                  setIsLanguageOpen(false);
                  setIsModulesOpen((open) => !open);
                }}
              >
                {t.modulesButton}
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform ${isModulesOpen ? 'rotate-180' : ''}`}
                />
              </Button>

              {isModulesOpen && (
                <div className="modules-menu-panel animate-scale-in" role="menu">
                  <p className="modules-menu-label">{t.modulesLabel}</p>
                  {modules.map((module) => {
                    const Icon = module.icon;
                    return (
                      <button
                        key={module.id}
                        type="button"
                        role="menuitem"
                        className={`modules-menu-item ${module.active ? 'is-active' : ''}`}
                        onClick={() => handleModuleSelect(module)}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="modules-menu-item-text">
                          <span>{module.label}</span>
                          {module.adminOnly && (
                            <span className="modules-menu-badge">{t.adminBadge}</span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="navbar-right-actions">
            <div className="language-menu" ref={languageMenuRef}>
              <Button
                type="button"
                variant="ghost"
                className="theme-toggle-btn language-toggle-btn rounded-full px-2.5"
                aria-label={t.languageLabel}
                aria-expanded={isLanguageOpen}
                aria-haspopup="menu"
                onClick={() => {
                  setIsModulesOpen(false);
                  setIsLanguageOpen((open) => !open);
                }}
              >
                <Languages className="h-4 w-4" />
                <span className="language-toggle-code">{currentLanguage.short}</span>
              </Button>

              {isLanguageOpen && (
                <div className="language-menu-panel animate-scale-in" role="menu">
                  <p className="modules-menu-label">{t.languageLabel}</p>
                  {LANGUAGES.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      role="menuitem"
                      className={`modules-menu-item ${language === item.code ? 'is-active' : ''}`}
                      onClick={() => handleLanguageSelect(item.code)}
                    >
                      <span className="language-item-code">{item.short}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="theme-toggle-btn rounded-full"
              aria-label={isDarkMode ? t.themeToLight : t.themeToDark}
              onClick={onToggleTheme}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <button
              type="button"
              className="mobile-menu-toggle"
              aria-label={isMobileMenuOpen ? t.closeMenu : t.openMenu}
              aria-expanded={isMobileMenuOpen}
              onClick={() => {
                setIsModulesOpen(false);
                setIsLanguageOpen(false);
                setIsMobileMenuOpen((open) => !open);
              }}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {isMobileMenuOpen && (
          <div className="mobile-menu-drawer animate-scale-in">
            <p className="mobile-menu-title">{t.modulesMobileTitle}</p>
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <Button
                  key={module.id}
                  variant={module.active ? 'secondary' : 'ghost'}
                  className="w-full justify-start gap-2 rounded-lg px-3 py-2 text-left"
                  onClick={() => handleModuleSelect(module)}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="whitespace-normal text-sm leading-snug">
                    {module.label}
                    {module.adminOnly ? ` · ${t.adminBadge}` : ''}
                  </span>
                </Button>
              );
            })}
          </div>
        )}
      </header>

      {/* Contenido dinámico de los módulos */}
      <main className="flex-1 w-full pb-12">
        {children}
      </main>

      {/* Footer de patrocinadores */}
      <footer className="sponsors-footer">
        <div className="logos-carousel-container">
          <div className="logos-slide-track">
            <div className="logos-group">
              {SPONSOR_BRANDS.map((brand) => (
                <span key={`a-${brand.name}`} className="sponsor-logo">
                  <img src={brand.logo} alt={brand.name} />
                </span>
              ))}
            </div>
            <div className="logos-group" aria-hidden="true">
              {SPONSOR_BRANDS.map((brand) => (
                <span key={`b-${brand.name}`} className="sponsor-logo">
                  <img src={brand.logo} alt="" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Botón Flotante del Asistente IA (Se le puede pasar la función si el componente hijo lo requiere) */}
      <FloatingAIButton onNavigate={onNavigate} onSendAI={handleSendMessageToAI} />
    </div>
  );
}