# Plataforma de Vinculación Empresarial (CUSMEX)

Es una plataforma web modular diseñada para potenciar la interacción, el networking y la gestión de reuniones entre empresas participantes en los eventos de **CUSMEX**. Este repositorio contiene el Producto Mínimo Viable (MVP), desarrollado bajo una arquitectura escalable que permite la validación en tiempo real durante el evento y sienta las bases para futuras expansiones tecnológicas.

---

## Alcance del MVP (Producto Mínimo Viable)

El objetivo principal de esta versión es validar la solución en un entorno real, garantizando las funciones críticas de conectividad, administración y asistencia inteligente.

### Características Principales
* **Autenticación y Control de Acceso:** Inicio de sesión seguro con un sistema de roles básicos (de 4 a 5 niveles de permisos diferenciados).
* **Dashboard Principal:** Panel de control centralizado con un resumen estadístico y visual del estado del evento en tiempo real.
* **Catálogo de Empresas:** Registro y visualización detallada del perfil de las organizaciones participantes.
* **Buscador Avanzado:** Sistema de filtrado rápido de empresas por nombre, categoría o giro comercial.
* **Agenda y Gestión de Reuniones:** Herramienta para agendar, coordinar y hacer seguimiento a las citas de negocios entre empresas (*B2B*).
* **Asistente Virtual con IA:** Integración de un modelo de Inteligencia Artificial (utilizando el token oficial provisto) para:
    * Responder preguntas frecuentes del evento.
    * Recomendar reuniones estratégicas entre empresas.
    * Facilitar la consulta rápida de información dentro de la plataforma.
* **Panel Administrativo:** Módulo centralizado para la gestión, moderación y edición de usuarios, empresas y reuniones agendadas.

---

## Arquitectura del Software

Ha sido concebido bajo un enfoque de **arquitectura modular**. El código está estructurado para desacoplar las reglas de negocio de los servicios externos. Esto garantiza que el sistema pueda crecer orgánicamente sin requerir un rediseño de la infraestructura base.