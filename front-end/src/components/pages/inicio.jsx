import React from 'react';
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  LayoutDashboard,
  Megaphone,
  Newspaper,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PlatformLayout from '@/components/layout/platform-layout';
import { COPY } from './login-i18n';
import { navigateToModule } from '@/config/platform-modules';

export default function Inicio({ language, onLanguageChange, isDarkMode, onToggleTheme }) {
  const t = COPY[language] ?? COPY.es;
  const page = t.inicio;

  return (
    <PlatformLayout
      activeModuleId="inicio"
      language={language}
      onLanguageChange={onLanguageChange}
      isDarkMode={isDarkMode}
      onToggleTheme={onToggleTheme}
      badgeIcon={LayoutDashboard}
      badgeLabel={page.badge}
    >
      <main className="inicio-section relative">
        <div className="inicio-header animate-fade-up">
          <p className="hero-kicker">{page.kicker}</p>
          <h1 className="hero-title">{page.title}</h1>
          <p className="hero-description">{page.description}</p>
        </div>

        <div className="inicio-stats animate-fade-up delay-1">
          {page.stats.map((stat) => (
            <Card key={stat.id} className="inicio-stat-card">
              <CardContent className="inicio-stat-content">
                <span className="inicio-stat-value">{stat.value}</span>
                <span className="inicio-stat-label">{stat.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="inicio-grid animate-fade-up delay-2">
          <Card className="inicio-panel inicio-panel--wide">
            <CardHeader>
              <CardTitle className="inicio-panel-title">
                <BarChart3 className="h-5 w-5" />
                {page.eventSummary.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="inicio-panel-body">
              <p className="inicio-panel-text">{page.eventSummary.text}</p>
              <ul className="inicio-highlight-list">
                {page.eventSummary.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="inicio-panel">
            <CardHeader>
              <CardTitle className="inicio-panel-title">
                <Zap className="h-5 w-5" />
                {page.quickAccess.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="inicio-quick-access">
              {page.quickAccess.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="inicio-quick-item"
                  onClick={() => navigateToModule(item.id)}
                >
                  <span className="inicio-quick-copy">
                    <strong>{item.label}</strong>
                    <span>{item.hint}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 opacity-60" />
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="inicio-panel">
            <CardHeader>
              <CardTitle className="inicio-panel-title">
                <CalendarClock className="h-5 w-5" />
                {page.upcomingMeetings.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="inicio-list">
              {page.upcomingMeetings.items.map((meeting) => (
                <article key={meeting.id} className="inicio-list-item">
                  <span className="inicio-meeting-time">{meeting.time}</span>
                  <div className="inicio-list-copy">
                    <strong>{meeting.title}</strong>
                    <span>{meeting.location}</span>
                  </div>
                </article>
              ))}
            </CardContent>
          </Card>

          <Card className="inicio-panel">
            <CardHeader>
              <CardTitle className="inicio-panel-title">
                <Newspaper className="h-5 w-5" />
                {page.news.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="inicio-list">
              {page.news.items.map((item) => (
                <article key={item.id} className="inicio-news-item">
                  <span className="inicio-news-tag">
                    <Megaphone className="h-3 w-3" />
                    {item.tag}
                  </span>
                  <strong>{item.title}</strong>
                  <p>{item.excerpt}</p>
                </article>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Botón Flotante para Asistente IA */}
        <button
          type="button"
          onClick={() => navigateToModule('asistente-ia')}
          aria-label="Abrir Asistente IA"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900 group"
        >
          <Sparkles className="h-5 w-5 animate-pulse group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline font-medium text-sm">
            Asistente IA
          </span>
        </button>
      </main>
    </PlatformLayout>
  );
}