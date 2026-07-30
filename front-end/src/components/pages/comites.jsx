import React from 'react';
import { 
  Landmark, 
  Clock, 
  FileText, 
  Users,
  Vote,
  Building2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

import PlatformLayout from '@/components/layout/platform-layout';
import { COPY } from './login-i18n';

// --- SUBCOMPONENTE: SISTEMA DE VOTACIONES ---
function VotingSystem({ userCommittee }) {
  // Datos simulados de votaciones activas del comité
  const activeSessions = [
    {
      id: 1,
      title: "Resolución Organizacional: Adopción de IA en Logística",
      type: "Voto de Resolución",
      scope: userCommittee?.name || "Comité de Comercio",
      quorumRequired: 75,
      quorumCurrent: 82,
      endTime: "00:45:00",
      isSecret: true,
    },
    {
      id: 2,
      title: "Enmienda a la Recomendación de Comercio Fronterizo",
      type: "Voto Consultivo",
      scope: userCommittee?.name || "Comité de Comercio",
      quorumRequired: 60,
      quorumCurrent: 45, // Sin quórum
      endTime: "02:30:00",
      isSecret: false,
    }
  ];

  return (
    <div className="space-y-6">
      {/* TARJETA DEL COMITÉ AL QUE PERTENECE */}
      <Card className="border border-[#2563EB]/20 bg-card shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
                <Building2 className="h-5 w-5" />
              </span>
              <div>
                <CardTitle className="text-xl font-bold text-foreground">
                  {userCommittee.name}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {userCommittee.role} · {userCommittee.institution}
                </CardDescription>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#10B981]/10 px-3 py-1 text-xs font-semibold text-[#10B981] border border-[#10B981]/20">
              <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
              Comité Activo
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {userCommittee.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-border/60 text-xs">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#22D3EE]" />
              <div>
                <span className="text-muted-foreground block">Miembros Integrantes:</span>
                <span className="font-semibold text-foreground">{userCommittee.totalMembers} Delegados</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Vote className="h-4 w-4 text-[#7C3AED]" />
              <div>
                <span className="text-muted-foreground block">Sesiones Activas:</span>
                <span className="font-semibold text-foreground">{activeSessions.length} Votaciones</span>
              </div>
            </div>

            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <Clock className="h-4 w-4 text-[#D4AF37]" />
              <div>
                <span className="text-muted-foreground block">Próxima Reunión:</span>
                <span className="font-semibold text-foreground">{userCommittee.nextMeeting}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECCIÓN DE VOTACIONES ACTIVAS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Vote className="h-5 w-5 text-[#2563EB]" />
            Votaciones Activas en tu Comité
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB]">
            {activeSessions.length} En Curso
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {activeSessions.map((session) => {
            const hasQuorum = session.quorumCurrent >= session.quorumRequired;

            return (
              <Card 
                key={session.id} 
                className="relative overflow-hidden transition-all hover:border-[#2563EB]/50 shadow-sm flex flex-col justify-between"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    {/* Cyan Institucional */}
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/20">
                      {session.scope}
                    </span>

                    {/* Morado Sobrio o Azul Institucional */}
                    <span 
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        session.isSecret 
                          ? 'bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]/20' 
                          : 'bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20'
                      }`}
                    >
                      {session.isSecret ? 'Voto Secreto' : 'Voto Abierto'}
                    </span>
                  </div>

                  <CardTitle className="text-base leading-tight font-bold text-foreground">
                    {session.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 text-xs mt-1">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" /> {session.type}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1">
                        Quórum Verificado:
                      </span>
                      {/* Verde Esmeralda si hay quórum, Dorado Suave si no */}
                      <span 
                        className={`font-semibold flex items-center gap-1 ${
                          hasQuorum ? "text-[#10B981]" : "text-[#D4AF37]"
                        }`}
                      >
                        {hasQuorum ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <AlertCircle className="h-3.5 w-3.5" />
                        )}
                        {session.quorumCurrent}% / {session.quorumRequired}% req.
                      </span>
                    </div>

                    <Progress 
                      value={session.quorumCurrent} 
                      className="h-1.5"
                      // Estilo dinámico para barra de progreso
                      style={{
                        '--progress-background': hasQuorum ? '#10B981' : '#D4AF37'
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/60">
                    <div className="flex items-center gap-1.5 text-destructive text-xs font-semibold">
                      <Clock className="h-4 w-4" />
                      Cierra en {session.endTime}
                    </div>

                    {/* Azul Institucional en el botón */}
                    <Button 
                      disabled={!hasQuorum} 
                      size="sm"
                      className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white font-semibold text-xs rounded-lg"
                    >
                      Emitir Voto
                    </Button>
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
    nextMeeting: "Mañana, 10:00 CST",
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


        {/* Instanciamos el sistema de votaciones simplificado */}
        <VotingSystem userCommittee={userCommittee} />
      </main>
    </PlatformLayout>
  );
}