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
    level: 'Diamond Sponsor',
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

  const handleTabClick = (tabId) => {
    if (tabId === 'agenda') {
      onNavigate?.('agenda');
    } else if (tabId === 'networking') {
      onNavigate?.('networking');
    } else {
      setActiveTab(tabId);
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 pb-12">
        
        {/* Encabezado Principal */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                {sponsorData.name}
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Award className="w-3.5 h-3.5 mr-1" />
                {sponsorData.level}
              </span>
            </div>
            <p className="text-muted-foreground text-xs">
              CRM y Panel de Control de Beneficios del Evento
            </p>
          </div>
        </div>

        {/* Resumen Compacto */}
        <Card className="border border-border bg-card text-card-foreground shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
            <p className="text-xs text-foreground leading-normal font-normal">
              <strong className="font-semibold">Resumen de membresía:</strong> Cuenta con {sponsorData.stats.includedRegistrations} registros incluidos, {sponsorData.stats.pendingGuests} invitados pendientes, {sponsorData.stats.scheduledMeetings} reuniones programadas, {sponsorData.stats.speakingOpportunities} ponencias y {sponsorData.stats.recommendedConnections} conexiones recomendadas.
            </p>
          </CardContent>
        </Card>

        {/* Pestañas de Navegación */}
        <div className="flex border-b border-border space-x-2 overflow-x-auto">
          {[
            { id: 'resumen', label: 'Resumen y Beneficios', icon: ShieldCheck },
            { id: 'agenda', label: 'Ir a Agenda', icon: Calendar, isExternal: true },
            { id: 'networking', label: 'Solicitudes y Matchmaking', icon: Handshake, isExternal: true },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-2 py-2.5 px-3 border-b-2 font-medium text-xs whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.isExternal && <ArrowRight className="w-3 h-3 opacity-60 ml-0.5" />}
              </button>
            );
          })}
        </div>

        {/* VISTA: RESUMEN Y BENEFICIOS */}
        {activeTab === 'resumen' && (
          <div className="space-y-6">
            {/* Grid de KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-card border-border shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Registros Incluidos</p>
                    <p className="text-xl font-bold text-foreground mt-1">
                      {sponsorData.stats.includedRegistrations} <span className="text-xs font-normal text-muted-foreground">/ 20 usados</span>
                    </p>
                  </div>
                  <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                    <Ticket className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Invitados Pendientes</p>
                    <p className="text-xl font-bold text-amber-500 mt-1">
                      {sponsorData.stats.pendingGuests}
                    </p>
                  </div>
                  <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-500">
                    <Clock className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Reuniones Confirmadas</p>
                    <p className="text-xl font-bold text-foreground mt-1">
                      {sponsorData.stats.scheduledMeetings}
                    </p>
                  </div>
                  <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                    <Handshake className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Conexiones Recomendadas</p>
                    <p className="text-xl font-bold text-emerald-500 mt-1">
                      {sponsorData.stats.recommendedConnections}
                    </p>
                  </div>
                  <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-500">
                    <Users className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Perfil del Patrocinador y Beneficios Comprometidos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1 border-border bg-card shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" /> Perfil Corporativo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Empresa</p>
                    <p className="font-semibold text-foreground">{sponsorData.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Nivel de Patrocinio</p>
                    <p className="font-semibold text-amber-500">{sponsorData.level}</p>
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

              <Card className="lg:col-span-2 border-border bg-card shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Beneficios Comprometidos
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Seguimiento de entregables acordados en el contrato
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="divide-y divide-border">
                    {sponsorData.benefits.map((b, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                        <span className="text-foreground font-medium">{b.name}</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-500">
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

      </main>
    </PlatformLayout>
  );
}