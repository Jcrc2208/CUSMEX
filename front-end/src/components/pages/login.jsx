import React, { useEffect, useMemo, useRef, useState } from 'react';
import './login.css';
import { ChevronDown, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PlatformLayout from '@/components/layout/platform-layout';
import { COPY, getFeatures } from './login-i18n';
import { navigateToModule } from '@/config/platform-modules';

export default function Login({
  language,
  onLanguageChange,
  isDarkMode,
  onToggleTheme,
}) {
  const [accessRole, setAccessRole] = useState('gobierno');
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const roleMenuRef = useRef(null);

  const t = COPY[language] ?? COPY.es;
  const currentRoles = t.roles || COPY['es'].roles;
  const features = useMemo(() => getFeatures(language), [language]);
  const roleConfig = t.roles[accessRole] ?? t.roles.gobierno;

  // 1. VALIDACIÓN EN TIEMPO REAL: Verifica que el texto termine exactamente en @cusmex.com
  const isCusmexDomainValid = useMemo(() => {
    const cleanEmail = email.trim().toLowerCase();
    return cleanEmail.endsWith('@cusmex.com') && cleanEmail.length > 11;
  }, [email]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target)) {
        setIsRoleOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsRoleOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();

    // Doble verificación al enviar
    if (!cleanEmail.endsWith('@cusmex.com')) {
      setErrorMessage('El correo debe incluir el dominio @cusmex.com');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessRole,
          email: cleanEmail,
          password,
          language,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_role', data.user.role);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userName', data.user.name);

        console.log('✅ Login exitoso:', data);
        navigateToModule('confi_user');
      } else {
        console.error('❌ Error de login:', data);
        setErrorMessage(data.detail || data.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      setErrorMessage('No se pudo conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PlatformLayout
      activeModuleId="auth"
      language={language}
      onLanguageChange={onLanguageChange}
      isDarkMode={isDarkMode}
      onToggleTheme={onToggleTheme}
      badgeIcon={ShieldCheck}
      badgeLabel={t.authBadge}
    >
      <main className="hero-section">
        <div className="hero-content animate-fade-up">
          <p className="hero-kicker">{t.heroKicker}</p>
          <h1 className="hero-title">{t.heroTitle}</h1>
          <p className="hero-description">{t.heroDescription}</p>

          <div className="hero-features">
            <p className="hero-features-title">{t.featuresTitle}</p>
            <ul className="hero-features-list">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <li
                    key={feature.id}
                    className={`hero-feature animate-fade-up delay-${(index % 3) + 1}`}
                  >
                    <span className="hero-feature-icon">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="hero-feature-text">
                      <strong>{feature.title}:</strong> {feature.description}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="hero-media animate-fade-up delay-2" id="cusmex-login-panel">
          <Card className="login-card w-full max-w-[460px]">
            <CardHeader>
              <CardTitle className="text-lg">{roleConfig.title}</CardTitle>
              <CardDescription>{roleConfig.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                {/* Banner de error */}
                {errorMessage && (
                  <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-md">
                    {errorMessage}
                  </div>
                )}

                {/* Selección de Rol */}
                <div className="flex flex-col gap-2">
                  <Label>{t.accessType}</Label>
                  <div className="role-menu" ref={roleMenuRef}>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-between rounded-lg"
                      aria-expanded={isRoleOpen}
                      aria-haspopup="listbox"
                      onClick={() => setIsRoleOpen((open) => !open)}
                    >
                      {roleConfig.title}
                      <ChevronDown
                        className={`h-4 w-4 opacity-70 transition-transform ${isRoleOpen ? 'rotate-180' : ''}`}
                      />
                    </Button>

                    {isRoleOpen && (
                      <div className="role-menu-panel animate-scale-in" role="listbox">
                        {['gobierno', 'empresas', 'patrocinador', 'admin'].map((roleKey) => (
                          <button
                            key={roleKey}
                            type="button"
                            className={`role-menu-item ${accessRole === roleKey ? 'is-active' : ''}`}
                            onClick={() => {
                              setAccessRole(roleKey);
                              setIsRoleOpen(false);
                            }}
                          >
                            {currentRoles[roleKey]?.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* CAMPO DE CORREO SIMPLE (SIN NINGÚN CUADRO) */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cusmex-email">{t.email}</Label>
                  <Input
                    id="cusmex-email"
                    type="email"
                    placeholder="usuario@cusmex.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    required
                  />
                  {/* Advertencia si no incluye el dominio */}
                  {email.length > 0 && !isCusmexDomainValid && (
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                      El correo debe incluir la extensión @cusmex.com
                    </span>
                  )}
                </div>

                {/* Campo Contraseña */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cusmex-password">{t.password}</Label>
                  <Input
                    id="cusmex-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* EL BOTÓN SOLO SE HABILITA SI EL CORREO TERMINA EN @cusmex.com */}
                <Button 
                  type="submit" 
                  className="rounded-full" 
                  disabled={isLoading || !isCusmexDomainValid || !password}
                >
                  {isLoading ? '...' : t.enter}
                </Button>

                <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      const resetEmailInput = prompt("Ingresa tu correo completo (@cusmex.com):");
                      if (!resetEmailInput) return;

                      const cleanResetEmail = resetEmailInput.trim().toLowerCase();
                      if (!cleanResetEmail.endsWith('@cusmex.com')) {
                        alert("El correo debe terminar en @cusmex.com");
                        return;
                      }

                      fetch("/api/v1/auth/forgot-password", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email: cleanResetEmail }),
                      })
                        .then(async (res) => {
                          const data = await res.json();
                          alert(data.message || "Solicitud enviada con éxito.");
                        })
                        .catch((err) => {
                          console.error("Error en la petición:", err);
                        });
                    }}
                    className="text-muted-foreground hover:text-primary cursor-pointer"
                  >
                    {t.forgotPassword}
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </PlatformLayout>
  );
}