import React, { useState } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  RefreshCw,
  MessageSquare,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import PlatformLayout from '@/components/layout/platform-layout';
import { COPY } from './login-i18n';

export default function Assistant({
  language = 'es',
  onLanguageChange,
  isDarkMode,
  onToggleTheme,
}) {
  const t = COPY[language] ?? COPY.es;
  const copy = t.assistant;

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text:
        language === 'en'
          ? 'Hello! I am your CUSMEX Assistant. How can I help you today with your schedule or activities?'
          : '¡Hola! Soy tu Asistente CUSMEX. ¿En qué te puedo ayudar hoy con tu agenda o actividades del evento?',
      time: '10:00 AM',
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
     
    const userText = inputValue.trim();
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    try {
      // Petición actualizada para enviar la estructura que espera FastAPI
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userText,
          uploaded_by: "Usuario del CRM",
          item_content: `Reporte o consulta ingresada en el chat: ${userText}`
        }),
      });

      const data = await response.json();
      const aiReply = {
        id: Date.now() + 1,
        sender: 'ai',
        text: data.response,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (error) {
      const errorReply = {
        id: Date.now() + 1,
        sender: 'ai',
        text: language === 'en'
          ? 'Sorry, there was an error processing your request. Please try again later.'
          : 'Lo siento, hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, errorReply]);
    }
  };

  const handleReset = () => {
    setMessages([messages[0]]);
  };

  return (
    <PlatformLayout
      activeModuleId="assistant"
      language={language}
      onLanguageChange={onLanguageChange}
      isDarkMode={isDarkMode}
      onToggleTheme={onToggleTheme}
      badgeIcon={Bot}
      badgeLabel={copy?.badge || 'Asistente IA'}
    >
      <main className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
        {/* Header / Encabezado */}
        <header className="space-y-3">
          <div>
            <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              {copy?.badge || 'Asistente Virtual'}
            </span>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
                {copy?.title || 'Asistente CUSMEX'}
                <Sparkles className="h-6 w-6 text-amber-500" />
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {copy?.subtitle || 'Consulta información sobre la agenda, ponentes y eventos en tiempo real.'}
              </p>
            </div>
          </div>
        </header>

        <Separator />

        {/* Tarjeta Principal del Chat */}
        <Card className="flex flex-col h-[600px] shadow-sm border border-border">
          {/* Header del Chat */}
          <CardHeader className="p-4 border-b border-border flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  IA CUSMEX
                </CardTitle>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  {copy?.statusOnline || 'En línea'}
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={handleReset}
              className="text-muted-foreground hover:text-foreground"
              title={copy?.clearHistory || 'Reiniciar conversación'}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardHeader>

          {/* Área del Mensajes */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 max-w-[85%] sm:max-w-[75%] ${
                    isUser ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                      isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground border border-border'
                    }`}
                  >
                    {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>

                  {/* Burbuja */}
                  <div className="space-y-1">
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? 'bg-primary text-primary-foreground rounded-tr-none'
                          : 'bg-muted/60 border border-border text-foreground rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span
                      className={`block text-[10px] text-muted-foreground ${
                        isUser ? 'text-right' : 'text-left'
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>

          {/* Input e Ingreso de Datos */}
          <div className="p-4 border-t border-border bg-card">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <Input
                type="text"
                placeholder={
                  copy?.inputPlaceholder || 'Escribe tu pregunta sobre la agenda o el evento...'
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 rounded-xl"
              />
              <Button
                type="submit"
                disabled={!inputValue.trim()}
                className="rounded-xl px-4"
              >
                <Send className="h-4 w-4 mr-1 sm:mr-0" />
                <span className="hidden sm:inline ml-1">
                  {copy?.send || 'Enviar'}
                </span>
              </Button>
            </form>
          </div>
        </Card>
      </main>
    </PlatformLayout>
  );
}