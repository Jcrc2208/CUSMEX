import { useState } from 'react';
import {
  Settings,
  Users,
  Building,
  Shield,
  Search,
  Plus,
  MoreVertical,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import PlatformLayout from '@/components/layout/platform-layout';
import { COPY } from './login-i18n';

// --- SUBCOMPONENTE: GESTIÓN DE USUARIOS ---
function UsersManager({ copy }) {
  const [searchQuery, setSearchQuery] = useState('');
  const texts = copy.admin.usersManager; // Acceso rápido al diccionario

  return (
    <div className="space-y-4 animate-in fade-in-0 duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex items-center w-full md:w-80">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            className="pl-9 pr-3"
            placeholder={texts.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="w-full md:w-auto gap-2">
          <Plus className="h-4 w-4" />
          {texts.addUser}
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{texts.cardTitle}</CardTitle>
          <CardDescription>
            {texts.cardDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <div className="grid grid-cols-4 bg-muted/50 p-3 text-sm font-semibold text-muted-foreground">
              <div className="col-span-2">{texts.tableUser}</div>
              <div>{texts.tableRole}</div>
              <div className="text-right">{texts.tableActions}</div>
            </div>
            <Separator />
            <div className="flex flex-col">
              <div className="grid grid-cols-4 items-center p-3 text-sm hover:bg-muted/30 transition-colors">
                <div className="col-span-2 flex flex-col">
                  <span className="font-medium text-foreground">Elena Martínez</span>
                  <span className="text-xs text-muted-foreground">elena.m@empresa.com</span>
                </div>
                <div>
                  <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                    {texts.roles.empresa}
                  </span>
                </div>
                <div className="text-right">
                  <Button variant="ghost" size="icon-sm">
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-4 items-center p-3 text-sm hover:bg-muted/30 transition-colors">
                <div className="col-span-2 flex flex-col">
                  <span className="font-medium text-foreground">Carlos Ruiz</span>
                  <span className="text-xs text-muted-foreground">carlos.ruiz@natp.org</span>
                </div>
                <div>
                  <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {texts.roles.admin}
                  </span>
                </div>
                <div className="text-right">
                  <Button variant="ghost" size="icon-sm">
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- SUBCOMPONENTE: CONFIGURACIÓN GENERAL ---
function ConfigManager({ copy }) {
  const texts = copy.admin.configManager;

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      <Card>
        <CardHeader>
          <CardTitle>{texts.cardTitle}</CardTitle>
          <CardDescription>
            {texts.cardDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{texts.editionName}</label>
            <Input defaultValue="NATP Oakland Edition" />
          </div>
          <Separator />
          <div className="h-32 border-2 border-dashed border-muted flex flex-col items-center justify-center rounded-md text-muted-foreground">
            <Building className="h-6 w-6 mb-2 opacity-50" />
            <p className="text-sm">{texts.sponsorsPlaceholder}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- SUBCOMPONENTE: AUDITORÍA ---
function AuditLogs({ copy }) {
  const texts = copy.admin.auditLogs;

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      <Card>
        <CardHeader>
          <CardTitle>{texts.cardTitle}</CardTitle>
          <CardDescription>
            {texts.cardDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 border border-border bg-muted/20 flex flex-col items-center justify-center rounded-md text-muted-foreground">
            <Shield className="h-8 w-8 mb-3 opacity-30" />
            <p className="text-sm">{texts.emptyState}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- MAIN EXPORT: ADMIN ---
export default function Admin({
  language = 'es',
  onLanguageChange,
  isDarkMode,
  onToggleTheme,
}) {
  const t = COPY[language] ?? COPY.es;
  const adminText = t.admin;

  return (
    <PlatformLayout
      activeModuleId="administracion"
      language={language}
      onLanguageChange={onLanguageChange}
      isDarkMode={isDarkMode}
      onToggleTheme={onToggleTheme}
      badgeIcon={Settings}
      badgeLabel={t.moduleLabels.administracion}
    >
      <main className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
        
        <header className="space-y-3">
          <div>
            <span className="inline-flex items-center rounded-full bg-slate-500/10 px-3.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-500/20 dark:text-slate-400">
              {t.adminBadge || 'Admin'}
            </span>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                {adminText.title}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {adminText.description}
              </p>
            </div>
          </div>
        </header>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 p-1 bg-muted/50 rounded-lg">
            <TabsTrigger value="users" className="py-2.5 flex items-center gap-2 rounded-md transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">{adminText.tabs.users}</span>
            </TabsTrigger>
            <TabsTrigger value="config" className="py-2.5 flex items-center gap-2 rounded-md transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Building className="h-4 w-4" />
              <span className="hidden sm:inline">{adminText.tabs.config}</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="py-2.5 flex items-center gap-2 rounded-md transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">{adminText.tabs.audit}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-0">
            <UsersManager copy={t} />
          </TabsContent>

          <TabsContent value="config" className="mt-0">
            <ConfigManager copy={t} />
          </TabsContent>

          <TabsContent value="audit" className="mt-0">
            <AuditLogs copy={t} />
          </TabsContent>
        </Tabs>
      </main>
    </PlatformLayout>
  );
}