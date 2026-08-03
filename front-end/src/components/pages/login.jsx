import React, { useMemo, useState } from 'react';
import './login.css';
import { ShieldCheck, UserPlus, LogIn } from 'lucide-react';
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
  // Pestaña activa: 'login' (Iniciar sesión) o 'register' (Registrarse)
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const t = COPY[language] ?? COPY.es;
  const features = useMemo(() => getFeatures(language), [language]);

  // Validación en tiempo real del dominio @cusmex.com
  const isCusmexDomainValid = useMemo(() => {
    const cleanEmail = email.trim().toLowerCase();
    return cleanEmail.endsWith('@cusmex.com') && cleanEmail.length > 11;
  }, [email]);

  // Manejo de Inicio de Sesión -> Redirige a inicio.jsx
  async function handleLoginSubmit(e) {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();

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
        // Redirección al módulo de inicio
        navigateToModule('inicio');
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

  // Manejo de Registro -> Redirige a confi_user.jsx
  function handleRegisterClick() {
    navigateToModule('confi_user');
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
      showModulesMenu={false}
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
          <Card className="login-card w-full max-w-[460px] border border-border shadow-lg">
            
            {/* OPCIONES DE PESTAÑAS: INICIAR SESIÓN / REGISTRARSE */}
            <div className="flex border-b border-border bg-muted/30 p-1 rounded-t-xl">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'login'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <LogIn className="h-3.5 w-3.5" /> Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'register'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <UserPlus className="h-3.5 w-3.5" /> Registrarse
              </button>
            </div>

            {/* OPCIÓN 1: INICIAR SESIÓN */}
            {activeTab === 'login' && (
              <>
                <CardHeader className="pt-4 pb-2">
                  <CardTitle className="text-lg">Acceso a la Plataforma</CardTitle>
                  <CardDescription className="text-xs">
                    Ingresa tus credenciales para acceder a tu panel principal.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                    {/* Banner de error */}
                    {errorMessage && (
                      <div className="p-3 text-xs text-red-500 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-md">
                        {errorMessage}
                      </div>
                    )}

                    {/* Campo Correo */}
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="cusmex-email" className="text-xs font-medium">
                        Correo Corporativo
                      </Label>
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
                      {email.length > 0 && !isCusmexDomainValid && (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                          El correo debe incluir la extensión @cusmex.com
                        </span>
                      )}
                    </div>

                    {/* Campo Contraseña */}
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="cusmex-password" className="text-xs font-medium">
                        Contraseña
                      </Label>
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

                    {/* Botón Iniciar Sesión -> Redirige a inicio */}
                    <Button
                      type="submit"
                      className="rounded-full w-full mt-2"
                      disabled={isLoading || !isCusmexDomainValid || !password}
                    >
                      {isLoading ? 'Ingresando...' : 'Iniciar Sesión'}
                    </Button>
                  </form>
                </CardContent>
              </>
            )}

            {/* OPCIÓN 2: REGISTRARSE */}
            {activeTab === 'register' && (
              <>
                <CardHeader className="pt-4 pb-2">
                  <CardTitle className="text-lg">Crear una Cuenta</CardTitle>
                  <CardDescription className="text-xs">
                    Completa la configuración inicial de tu perfil empresarial o institucional para integrarte a CUSMEX.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 py-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Serás redirigido al asistente de registro donde ingresarás tus datos personales, correo corporativo, perfil comercial y preferencias.
                  </p>
                  <Button
                    type="button"
                    onClick={handleRegisterClick}
                    className="rounded-full w-full gap-2 mt-2"
                  >
                    Ir al Formulario de Registro <UserPlus className="h-4 w-4" />
                  </Button>
                </CardContent>
              </>
            )}

          </Card>
        </div>
      </main>
    </PlatformLayout>
  );
}