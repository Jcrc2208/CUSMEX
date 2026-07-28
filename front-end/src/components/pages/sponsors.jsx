import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Ticket,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  Handshake,
  Award,
  ArrowRight
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
  const [activeTab, setActiveTab] = useState('resumen');

  // Datos de ejemplo para la interfaz del patrocinador
  const sponsorData = {
    name: 'TechCorp International',
    level: 'Activo',
    stand: 'Stand A-12 (Zona Principal)',
    contact: 'Coordinación Ejecutiva CUSMEX',
    stats: {
      includedRegistrations: 20,
      pendingGuests: 3,
      scheduledMeetings: 4,
      speakingOpportunities: 2,
      recommendedConnections: 12
    },
    benefits: [
      { name: 'Stand Preferencial 6x3m', status: 'Asignado (A-12)' },
      { name: 'Logo en Pantalla Principal del Auditorio', status: 'Activo' },
      { name: 'Espacio de Ponencia en Plenaria', status: '2 Slots Reservados' },
      { name: 'Acceso a VIP Networking Lounge', status: 'Habilitado' },
      { name: 'Menciones en Comunicados Oficiales', status: 'Completado' }
    ]
  };

  const handleTabChange = (val) => {
    if (val === 'agenda') {
      onNavigate?.('agenda');
    } else if (val === 'networking') {
      onNavigate?.('networking');
    } else {
      setActiveTab(val);
    }
  };

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
      <main className="max-w-7xl mx-auto px-3 sm:px-6 space-y-4 sm:space-y-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 pb-12">
        
        {/* Encabezado Principal Adapable */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
                {sponsorData.name}
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-[#D80621] border border-[#D80621]/30 bg-[#D80621]/5 shrink-0">
                <Award className="w-3.5 h-3.5 mr-1" />
                {sponsorData.level}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              CRM y Panel de Control de Beneficios del Evento
            </p>
          </div>
        </div>

        {/* Resumen Compacto Responsive */}
        <Card className="border border-border bg-card text-card-foreground shadow-sm">
          <CardContent className="p-3 sm:p-4 flex items-start sm:items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-xs text-foreground leading-relaxed font-normal">
              <strong className="font-semibold">Resumen de membresía:</strong> Cuenta con {sponsorData.stats.includedRegistrations} registros incluidos, {sponsorData.stats.pendingGuests} invitados pendientes, {sponsorData.stats.scheduledMeetings} reuniones programadas, {sponsorData.stats.speakingOpportunities} ponencias y {sponsorData.stats.recommendedConnections} conexiones recomendadas.
            </p>
          </CardContent>
        </Card>

        {/* Pestañas de Navegación Fluidas (Scroll horizontal en teléfonos si es necesario) */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full space-y-4 sm:space-y-6">
          <TabsList className="flex sm:grid w-full sm:grid-cols-3 h-auto p-1 bg-muted/60 overflow-x-auto no-scrollbar scrollbar-none">
            <TabsTrigger 
              value="resumen" 
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-xs py-2 px-3 whitespace-nowrap shrink-0"
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Resumen y Beneficios</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="agenda" 
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-xs py-2 px-3 whitespace-nowrap shrink-0"
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Ir a Agenda</span>
              <ArrowRight className="w-3 h-3 opacity-60 ml-0.5 hidden sm:inline-block" />
            </TabsTrigger>

            <TabsTrigger 
              value="networking" 
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-xs py-2 px-3 whitespace-nowrap shrink-0"
            >
              <Handshake className="w-4 h-4 shrink-0" />
              <span>Matchmaking</span>
              <ArrowRight className="w-3 h-3 opacity-60 ml-0.5 hidden sm:inline-block" />
            </TabsTrigger>
          </TabsList>

          {/* VISTA: RESUMEN Y BENEFICIOS */}
          <TabsContent value="resumen" className="space-y-4 sm:space-y-6 m-0 focus-visible:outline-none">
            
            {/* Grid de KPIs Responsive (1 col en móvil, 2 en tablet, 4 en desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card className="bg-card border-border shadow-sm">
                <CardContent className="p-3.5 sm:p-4 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-muted-foreground">Registros Incluidos</p>
                    <p className="text-lg sm:text-xl font-bold text-foreground">
                      {sponsorData.stats.includedRegistrations} <span className="text-xs font-normal text-muted-foreground">/ 20 usados</span>
                    </p>
                  </div>
                  <div className="p-2 sm:p-2.5 bg-primary/10 rounded-lg text-primary shrink-0">
                    <Ticket className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border shadow-sm">
                <CardContent className="p-3.5 sm:p-4 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-muted-foreground">Invitados Pendientes</p>
                    <p className="text-lg sm:text-xl font-bold text-[#D80621]">
                      {sponsorData.stats.pendingGuests}
                    </p>
                  </div>
                  <div className="p-2 sm:p-2.5 bg-[#D80621]/10 rounded-lg text-[#D80621] shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border shadow-sm">
                <CardContent className="p-3.5 sm:p-4 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-muted-foreground">Reuniones Confirmadas</p>
                    <p className="text-lg sm:text-xl font-bold text-foreground">
                      {sponsorData.stats.scheduledMeetings}
                    </p>
                  </div>
                  <div className="p-2 sm:p-2.5 bg-primary/10 rounded-lg text-primary shrink-0">
                    <Handshake className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border shadow-sm">
                <CardContent className="p-3.5 sm:p-4 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-muted-foreground">Conexiones Recomendadas</p>
                    <p className="text-lg sm:text-xl font-bold text-emerald-500">
                      {sponsorData.stats.recommendedConnections}
                    </p>
                  </div>
                  <div className="p-2 sm:p-2.5 bg-emerald-500/10 rounded-lg text-emerald-500 shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Perfil del Patrocinador y Beneficios Comprometidos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              
              {/* Perfil Corporativo */}
              <Card className="lg:col-span-1 border-border bg-card shadow-sm">
                <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                  <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary shrink-0" /> Perfil Corporativo
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 space-y-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Empresa</p>
                    <p className="font-semibold text-foreground">{sponsorData.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Nivel de Estatus</p>
                    <p className="font-semibold text-[#D80621]">{sponsorData.level}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Ubicación Asignada</p>
                    <p className="font-semibold text-foreground">{sponsorData.stand}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Soporte Directo</p>
                    <p className="font-semibold text-foreground">{sponsorData.contact}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Beneficios */}
              <Card className="lg:col-span-2 border-border bg-card shadow-sm">
                <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                  <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Beneficios Comprometidos
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Seguimiento de entregables acordados en el contrato
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="divide-y divide-border">
                    {sponsorData.benefits.map((b, idx) => (
                      <div 
                        key={idx} 
                        className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 text-xs"
                      >
                        <span className="text-foreground font-medium leading-tight">{b.name}</span>
                        <span className="self-start sm:self-auto inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-500 shrink-0">
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </div>
          </TabsContent>
        </Tabs>

      </main>
    </PlatformLayout>
  );
}