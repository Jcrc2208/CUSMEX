import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Bot,
  Send,
  User,
  Sparkles,
  RefreshCw,
  X,
  Minus,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { COPY } from '../pages/login-i18n';

export default function FloatingAIButton({ language = 'es', onSendAI }) {
  const t = COPY[language] ?? COPY.es;
  const copy = t.assistant;

  const [isOpen, setIsOpen] = useState(false);
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
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

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
    setIsLoading(true);

    let aiReplyText = '';

    if (onSendAI) {
      // Llamada real al backend de FastAPI configurado en PlatformLayout
      aiReplyText = await onSendAI(userText, 'Usuario CUSMEX', '');
    } else {
      // Fallback simulado en caso de no pasar prop
      await new Promise((resolve) => setTimeout(resolve, 800));
      aiReplyText =
        language === 'en'
          ? 'Processing your request... I can help you locate sessions, speakers, and stands in real time.'
          : 'Procesando tu solicitud... Puedo ayudarte a ubicar sesiones, ponentes y stands en tiempo real.';
    }

    const aiReply = {
      id: Date.now() + 1,
      sender: 'ai',
      text: aiReplyText,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, aiReply]);
    setIsLoading(false);
  };

  const handleReset = () => {
    setMessages([messages[0]]);
  };

  const content = (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-auto">
      {/* Pop-up flotante del Chat */}
      {isOpen && (
        <Card className="fixed inset-3 sm:inset-auto sm:relative w-auto sm:w-[400px] h-[calc(100dvh-5rem)] sm:h-[520px] max-h-[650px] shadow-2xl border border-border flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200 bg-background">
          {/* Header del Chat */}
          <CardHeader className="p-3.5 sm:p-4 border-b border-border flex flex-row items-center justify-between space-y-0 shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <CardTitle className="text-sm sm:text-base font-bold text-foreground flex items-center gap-1.5">
                  {copy?.title || 'IA CUSMEX'}
                  <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500" />
                </CardTitle>
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  {copy?.statusOnline || 'En línea'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={handleReset}
                className="text-muted-foreground hover:text-foreground h-8 w-8"
                title={copy?.clearHistory || 'Reiniciar conversación'}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Área de Mensajes */}
          <CardContent className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-background">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 sm:gap-3 max-w-[88%] sm:max-w-[85%] ${
                    isUser ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                      isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground border border-border'
                    }`}
                  >
                    {isUser ? <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                  </div>

                  {/* Burbuja */}
                  <div className="space-y-1">
                    <div
                      className={`rounded-2xl px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-primary text-primary-foreground rounded-tr-none'
                          : 'bg-muted/60 border border-border text-foreground rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span
                      className={`block text-[9px] sm:text-[10px] text-muted-foreground ${
                        isUser ? 'text-right' : 'text-left'
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
                <Bot className="h-4 w-4" />
                <span>Pensando respuesta...</span>
              </div>
            )}
          </CardContent>

          {/* Input e Ingreso de Datos */}
          <div className="p-3 sm:p-4 border-t border-border bg-card shrink-0">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <Input
                type="text"
                placeholder={
                  copy?.inputPlaceholder || 'Escribe tu pregunta sobre la agenda...'
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
                className="flex-1 rounded-xl text-base sm:text-sm h-10 sm:h-9"
              />
              <Button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="rounded-xl px-3.5 sm:px-4 h-10 sm:h-9 shrink-0"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">
                  {copy?.send || 'Enviar'}
                </span>
              </Button>
            </form>
          </div>
        </Card>
      )}

      {/* Botón Flotante de Apertura */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={copy?.badge || 'Asistente IA'}
        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
      >
        {isOpen ? (
          <Minus className="w-6 h-6" />
        ) : (
          <Sparkles className="w-6 h-6 animate-pulse group-hover:rotate-12 transition-transform text-amber-400" />
        )}
        <span className="hidden sm:inline font-medium text-sm">
          {isOpen ? 'Cerrar Chat' : copy?.badge || 'Asistente IA'}
        </span>
      </button>
    </div>
  );

  if (typeof window === 'undefined') return null;

  return createPortal(content, document.body);
}