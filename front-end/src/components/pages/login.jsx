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

  const roleMenuRef = useRef(null);

  const t = COPY[language] ?? COPY.es;
  const features = useMemo(() => getFeatures(language), [language]);
  const roleConfig = t.roles[accessRole] ?? t.roles.gobierno;

  useEffect(() => {
    function handlePointerDown(event) {
      const target = event.target;
      if (roleMenuRef.current && !roleMenuRef.current.contains(target)) {
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
    setIsLoading(true);

    try {
      //const response = await fetch('http://localhost:8000/api/v1/auth/login', {
      const response = await fetch ('api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessRole,
          email,
          password,
          language,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('user_role', data.user.role)
        console.log('✅ Login exitoso:', data);
        navigateToModule('inicio');
      } else {
        console.error('❌ Error de login:', data.detail);
        alert(data.detail || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('No se pudo conectar con el servidor.');
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
                        <button
                          type="button"
                          className={`role-menu-item ${accessRole === 'gobierno' ? 'is-active' : ''}`}
                          onClick={() => {
                            setAccessRole('gobierno');
                            setIsRoleOpen(false);
                          }}
                        >
                          {t.roles.gobierno.title}
                        </button>
                        <button
                          type="button"
                          className={`role-menu-item ${accessRole === 'empresas' ? 'is-active' : ''}`}
                          onClick={() => {
                            setAccessRole('empresas');
                            setIsRoleOpen(false);
                          }}
                        >
                          {t.roles.empresas.title}
                        </button>
                        <button
                          type="button"
                          className={`role-menu-item ${accessRole === 'patrocinador' ? 'is-active' : ''}`}
                          onClick={() => {
                            setAccessRole('patrocinador');
                            setIsRoleOpen(false);
                          }}
                        >
                          {t.roles.patrocinador.title}
                        </button>
                        <button
                          type="button"
                          className={`role-menu-item ${accessRole === 'admin' ? 'is-active' : ''}`}
                          onClick={() => {
                            setAccessRole('admin');
                            setIsRoleOpen(false);
                          }}
                        >
                          {t.roles.admin.title}
                        </button>                        
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="cusmex-email">{t.email}</Label>
                  <Input
                    id="cusmex-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder={roleConfig.placeholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

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

                <Button type="submit" className="rounded-full" disabled={isLoading}>
                  {isLoading ? '...' : t.enter}
                </Button>

                <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <a href="#forgot" className="text-muted-foreground hover:text-primary">
                    {t.forgotPassword}
                  </a>
                  <a href="#signup" className="text-muted-foreground hover:text-primary">
                    {t.requestAccess}
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
