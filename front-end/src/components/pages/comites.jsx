import React, { useState } from 'react';
import { 
  Landmark, 
  Calendar,
  ThumbsUp,
  ThumbsDown,
  MinusCircle
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import PlatformLayout from '@/components/layout/platform-layout';
import { COPY } from './login-i18n';

// --- SUBCOMPONENTE: SISTEMA DE VOTACIONES Y DATOS DEL COMITÉ ---
function VotingSystem({ userCommittee }) {
  // Estado para simular la selección o registro del voto por cada tarjeta
  const [userVotes, setUserVotes] = useState({});

  // Datos de votaciones
  const activeSessions = [
    {
      id: 1,
      title: "Resolución Organizacional: Adopción de IA en Logística",
      description: "Propuesta para implementar un marco estándar regional en el uso de inteligencia artificial para la automatización de aduanas y optimización de cadenas de suministro.",
      type: "Voto de Resolución",
      startDate: "2026-07-28 09:00",
      endDate: "2026-07-31 18:00",
    },
    {
      id: 2,
      title: "Enmienda a la Recomendación de Comercio Fronterizo",
      description: "Revisión de la cláusula de homologación de aranceles para insumos tecnológicos en zonas franja de intercambio bilateral.",
      type: "Voto Consultivo",
      startDate: "2026-07-29 10:00",
      endDate: "2026-08-01 15:00",
    }
  ];

  const handleCastVote = (sessionId, voteType) => {
    setUserVotes((prev) => ({ ...prev, [sessionId]: voteType }));
  };

  return (
    <div className="space-y-6">
      {/* INFORMACIÓN DEL COMITÉ (TEXTO) + METRICAS (TARJETAS MÁS PEQUEÑAS Y AL LADO) */}
      <div className="space-y-4">
        {/* Encabezado y Descripción limpia */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                {userCommittee.name}
              </h1>
              <p className="text-xs font-medium text-muted-foreground">
                {userCommittee.role} · {userCommittee.institution}
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl pt-1">
            {userCommittee.description}
          </p>
        </div>

        {/* Métricas: Reducidas de tamaño y una al lado de la otra (grid-cols-2) sin iconos */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <Card className="border border-border/80 bg-card shadow-sm hover:border-[#22D3EE]/50 transition-colors">
            <CardContent className="p-2.5">
              <span className="text-[11px] text-muted-foreground font-medium block leading-none">
                Miembros Integrantes
              </span>
              <span className="text-sm font-bold text-foreground leading-tight mt-1 block">
                {userCommittee.totalMembers} Delegados
              </span>
            </CardContent>
          </Card>

          <Card className="border border-border/80 bg-card shadow-sm hover:border-[#7C3AED]/50 transition-colors">
            <CardContent className="p-2.5">
              <span className="text-[11px] text-muted-foreground font-medium block leading-none">
                Sesiones Activas
              </span>
              <span className="text-sm font-bold text-foreground leading-tight mt-1 block">
                {activeSessions.length} Votaciones
              </span>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SECCIÓN DE VOTACIONES ACTIVAS */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">
            Votaciones Activas en tu Comité
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB]">
            {activeSessions.length} En Curso
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {activeSessions.map((session) => {
            const currentVote = userVotes[session.id];

            return (
              <Card 
                key={session.id} 
                className="relative overflow-hidden transition-all hover:border-[#2563EB]/50 shadow-sm flex flex-col justify-between"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base leading-tight font-bold text-foreground">
                    {session.title}
                  </CardTitle>
                  
                  {/* Tipo de Votación (sin icono) */}
                  <CardDescription className="text-xs mt-1 font-medium text-foreground/80">
                    Tipo: {session.type}
                  </CardDescription>

                  {/* Descripción */}
                  <p className="text-xs text-muted-foreground leading-relaxed pt-2">
                    {session.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4 pt-2">
                  {/* Fecha Inicio y Fecha Fin */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-muted/40 text-[11px] border border-border/50">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
                      <div>
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground/70">Inicio</span>
                        <span className="font-semibold text-foreground">{session.startDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 text-destructive shrink-0" />
                      <div>
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground/70">Fin</span>
                        <span className="font-semibold text-foreground">{session.endDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Botones de Emisión de Voto (A Favor, Abstención, En Contra) */}
                  <div className="pt-3 border-t border-border/60 space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        size="sm"
                        onClick={() => handleCastVote(session.id, 'favor')}
                        className={`font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 h-9 transition-colors ${
                          currentVote === 'favor' 
                            ? 'bg-[#10B981] text-white hover:bg-[#10B981]/90' 
                            : 'bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 border border-[#10B981]/30'
                        }`}
                      >
                        <ThumbsUp className="h-3.5 w-3.5 shrink-0" />
                        <span>A Favor</span>
                      </Button>

                      <Button 
                        size="sm"
                        onClick={() => handleCastVote(session.id, 'abstencion')}
                        className={`font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 h-9 transition-colors ${
                          currentVote === 'abstencion' 
                            ? 'bg-[#D4AF37] text-white hover:bg-[#D4AF37]/90' 
                            : 'bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30'
                        }`}
                      >
                        <MinusCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>Abstención</span>
                      </Button>

                      <Button 
                        size="sm"
                        onClick={() => handleCastVote(session.id, 'contra')}
                        className={`font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 h-9 transition-colors ${
                          currentVote === 'contra' 
                            ? 'bg-destructive text-white hover:bg-destructive/90' 
                            : 'bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/30'
                        }`}
                      >
                        <ThumbsDown className="h-3.5 w-3.5 shrink-0" />
                        <span>En Contra</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
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

  // Información del comité asignado al usuario
  const userCommittee = {
    name: "Comité de Comercio e Integración Logística",
    role: "Delegado Titular",
    institution: "North American Trade Parliament",
    description: "Órgano encargado de dictaminar resoluciones transfronterizas, optimización de cadenas de suministro regionales y políticas de facilitación comercial.",
    totalMembers: 28,
  };

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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
        <VotingSystem userCommittee={userCommittee} />
      </main>
    </PlatformLayout>
  );
}