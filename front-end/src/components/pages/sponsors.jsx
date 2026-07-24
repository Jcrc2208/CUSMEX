import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import PlatformLayout from '@/components/layout/platform-layout';
import { COPY } from './login-i18n';

export default function Sponsors({
  language = 'es',
  onLanguageChange,
  isDarkMode,
  onToggleTheme,
  onNavigate
}) {
  const t = COPY[language] ?? COPY.es;

  return (
    <PlatformLayout
      activeModuleId="sponsors"
      language={language}
      onLanguageChange={onLanguageChange}
      isDarkMode={isDarkMode}
      onToggleTheme={onToggleTheme}
      badgeIcon={ShieldCheck}
      badgeLabel={t.moduleLabels?.sponsors || 'Patrocinadores'}
      onNavigate={onNavigate}
    >
      <main className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
        
        {/* Cabecera del módulo */}
        <header className="space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Patrocinadores
          </h1>
        </header>

        {/* Tarjeta con tu mensaje e integración UI */}
        <Card className="border border-border bg-card text-card-foreground shadow-sm">
          <CardContent className="p-6">
            <p className="text-muted-foreground text-base">
              Bienvenido al módulo de patrocinadores del evento.
            </p>
          </CardContent>
        </Card>

      </main>
    </PlatformLayout>
  );
}
