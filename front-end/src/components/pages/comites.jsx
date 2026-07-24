import React from 'react';
import { 
  Landmark,
  ShieldCheck, 
  Clock, 
  FileText, 
  Download, 
  FileSignature, 
  History,
  Archive,
  Vote
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import PlatformLayout from '@/components/layout/platform-layout';
import { COPY } from './login-i18n';

// --- SUBCOMPONENTE: SISTEMA DE VOTACIONES ---
function VotingSystem({ userRole, isVerified = true }) {
  // Datos simulados de votaciones
  const activeSessions = [
    {
      id: 1,
      title: "Resolución Organizacional: Adopción de IA en Logística",
      type: "Voto de Resolución",
      scope: "Asamblea General",
      quorumRequired: 75,
      quorumCurrent: 82,
      endTime: "00:45:00",
      isSecret: true,
    },
    {
      id: 2,
      title: "Enmienda a la Recomendación de Comercio Fronterizo",
      type: "Voto Consultivo",
      scope: "Comité de Comercio",
      quorumRequired: 60,
      quorumCurrent: 45, // Sin quórum
      endTime: "02:30:00",
      isSecret: false,
    }
  ];

  return (
    <div className="space-y-6">
      {/* Tarjeta de Elegibilidad */}
      <Card className="bg-muted/30 border-blue-200 dark:border-blue-900 w-full">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <ShieldCheck className={`h-8 w-8 ${isVerified ? 'text-emerald-500' : 'text-amber-500'}`} />
            <div>
              <p className="font-semibold text-sm leading-none mb-1">Estado de Delegado</p>
              <p className="text-xs text-muted-foreground">
                {isVerified ? 'Verificado - Elegible para votar' : 'Verificación pendiente'}
              </p>
            </div>
          </div>
          <div className="pl-4 border-l border-border hidden sm:block">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-3 py-1.5 rounded-md">
              Rol: {userRole || 'Delegado'}
            </span>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="activas" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6 p-1 bg-muted/50 rounded-lg">
          <TabsTrigger value="activas" className="py-2.5 flex items-center gap-2 rounded-md">
            <Vote className="h-4 w-4" />
            <span className="hidden sm:inline">Votaciones Activas</span>
          </TabsTrigger>
          <TabsTrigger value="resultados" className="py-2.5 flex items-center gap-2 rounded-md">
            <Archive className="h-4 w-4" />
            <span className="hidden sm:inline">Registro y Resultados</span>
          </TabsTrigger>
        </TabsList>

        {/* PESTAÑA 1: ACTIVAS */}
        <TabsContent value="activas" className="mt-0 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {activeSessions.map((session) => {
              const hasQuorum = session.quorumCurrent >= session.quorumRequired;
              
              return (
                <Card key={session.id} className="relative overflow-hidden hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-muted px-2 py-1 rounded-md">
                        {session.scope}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${session.isSecret ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {session.isSecret ? 'Voto Secreto' : 'Voto Abierto'}
                      </span>
                    </div>
                    <CardTitle className="text-lg leading-tight">{session.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs mt-1">
                      <FileText className="h-3 w-3" /> {session.type}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Quórum Verificado</span>
                        <span className={hasQuorum ? "text-emerald-500 font-medium" : "text-amber-500 font-medium"}>
                          {session.quorumCurrent}% / {session.quorumRequired}% req.
                        </span>
                      </div>
                      <Progress value={session.quorumCurrent} className="h-1.5" />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center gap-1.5 text-destructive text-sm font-medium">
                        <Clock className="h-4 w-4" />
                        {session.endTime}
                      </div>
                      <Button disabled={!isVerified || !hasQuorum} size="sm">
                        Emitir Voto
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* PESTAÑA 2: RESULTADOS */}
        <TabsContent value="resultados" className="mt-0">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Resolución Institucional #42</CardTitle>
                  <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded font-bold uppercase">
                    Aprobada
                  </span>
                </div>
                <CardDescription>Resultados Finales Diferidos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>A Favor (65%)</span>
                    <span>130 Votos</span>
                  </div>
                  <Progress value={65} className="h-3 [&>div]:bg-emerald-500" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>En Contra (25%)</span>
                    <span>50 Votos</span>
                  </div>
                  <Progress value={25} className="h-3 [&>div]:bg-red-500" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold text-muted-foreground">
                    <span>Abstenciones (10%)</span>
                    <span>20 Votos</span>
                  </div>
                  <Progress value={10} className="h-3 [&>div]:bg-slate-400" />
                </div>

                <div className="pt-4 border-t border-border">
                   <Button variant="outline" className="w-full sm:w-auto gap-2">
                     <Download className="h-4 w-4" />
                     Exportar Reporte Oficial (.PDF)
                   </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <History className="h-4 w-4" />
                  Rastro de Auditoría
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative border-l-2 border-muted ml-3 space-y-6">
                  <div className="relative pl-4">
                    <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-background bg-primary"></span>
                    <p className="text-xs font-semibold">Resultados Certificados</p>
                    <p className="text-[10px] text-muted-foreground">24/07/2026 - 15:30 CST</p>
                  </div>
                  <div className="relative pl-4">
                    <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-background bg-muted"></span>
                    <p className="text-xs font-semibold">Ventana de votación cerrada</p>
                    <p className="text-[10px] text-muted-foreground">24/07/2026 - 15:00 CST</p>
                  </div>
                  <div className="relative pl-4">
                    <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-background bg-muted"></span>
                    <p className="text-xs font-semibold">Quórum alcanzado (82%)</p>
                    <p className="text-[10px] text-muted-foreground">24/07/2026 - 14:15 CST</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
                  <FileSignature className="h-4 w-4 text-primary" />
                  <span>Criptográficamente firmado por NATP Ledger</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL: COMITÉS ---
export default function Comites({
  language = 'es',
  onLanguageChange,
  isDarkMode,
  onToggleTheme,
  onNavigate
}) {
  const t = COPY[language] ?? COPY.es;
  
  // Obtenemos el rol para saber qué tipo de delegado es
  const userRole = localStorage.getItem('user_role');

  return (
    <PlatformLayout
      activeModuleId="comites"
      language={language}
      onLanguageChange={onLanguageChange}
      isDarkMode={isDarkMode}
      onToggleTheme={onToggleTheme}
      badgeIcon={Landmark}
      badgeLabel={t.moduleLabels.comites}
      onNavigate={onNavigate}
    >
      <main className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
        
        {/* Cabecera del módulo */}
        <header className="space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Comités y Votaciones
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Centro de decisiones del North American Trade Parliament. Gestiona tus votos consultivos, resoluciones organizacionales y revisa el historial certificado de la Asamblea.
          </p>
        </header>

        {/* Instanciamos el sistema de votaciones aquí */}
        <VotingSystem userRole={userRole} isVerified={true} />
        
      </main>
    </PlatformLayout>
  );
}