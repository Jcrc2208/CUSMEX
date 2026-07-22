import React from 'react';
import { Construction } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PlatformLayout from '@/components/layout/platform-layout';
import { COPY } from './login-i18n';
import { navigateToModule } from '@/config/platform-modules';

export default function ModulePlaceholder({
  moduleId,
  language,
  onLanguageChange,
  isDarkMode,
  onToggleTheme,
}) {
  const t = COPY[language] ?? COPY.es;
  const moduleConfig = t.modules.find((item) => item.id === moduleId);
  const ModuleIcon = moduleConfig?.icon ?? Construction;
  const moduleLabel = moduleConfig?.label ?? moduleId;
  const scopeItems = t.moduleScopes?.[moduleId] ?? [];

  return (
    <PlatformLayout
      activeModuleId={moduleId}
      language={language}
      onLanguageChange={onLanguageChange}
      isDarkMode={isDarkMode}
      onToggleTheme={onToggleTheme}
      badgeIcon={ModuleIcon}
      badgeLabel={moduleLabel}
    >
      <main className="module-placeholder-section">
        <Card className="module-placeholder-card animate-fade-up">
          <CardHeader className="items-center text-center">
            <span className="module-placeholder-icon">
              <Construction className="h-8 w-8" />
            </span>
            <CardTitle>{t.comingSoonTitle}</CardTitle>
            <CardDescription>{t.comingSoonDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3">
            {scopeItems.length > 0 && (
              <div className="module-placeholder-scope">
                <p className="module-placeholder-scope-label">{t.comingSoonScopeLabel}</p>
                <ul className="module-placeholder-scope-list">
                  {scopeItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="module-placeholder-module">
              <ModuleIcon className="h-4 w-4" />
              {moduleLabel}
            </p>
            <Button
              type="button"
              className="rounded-full"
              onClick={() => navigateToModule('inicio')}
            >
              {t.backToInicio}
            </Button>
          </CardContent>
        </Card>
      </main>
    </PlatformLayout>
  );
}
