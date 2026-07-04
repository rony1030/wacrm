import { useState, useEffect } from 'react';

export type Locale = 'es' | 'en';

const translations = {
  es: {
    dashboard: "Panel de Control",
    inbox: "Bandeja de Entrada",
    notifications: "Notificaciones",
    contacts: "Contactos",
    pipelines: "Embudo de Ventas",
    broadcasts: "Difusiones",
    automations: "Automatizaciones",
    flows: "Flujos",
    aiAgents: "Agentes IA",
    settings: "Configuración",
    logout: "Cerrar Sesión",
    welcome: "Bienvenido",
    // Dashboard page
    active_conversations: "Conversaciones Activas",
    new_contacts: "Nuevos Contactos Hoy",
    open_deals: "Valor de Tratos Abiertos",
    messages_sent: "Mensajes Enviados Hoy",
    conversations_over_time: "Conversaciones en el Tiempo",
    pipeline_value: "Valor del Embudo",
    avg_first_response: "Tiempo Promedio de Primera Respuesta",
    recent_activity: "Actividad Reciente",
    new_contact_btn: "Nuevo Contacto",
    new_deal_btn: "Nuevo Trato",
    new_broadcast_btn: "Nueva Difusión",
    new_automation_btn: "Nueva Automatización",
    no_change: "Sin cambios hoy vs ayer",
    no_change_vs_yesterday: "Sin cambios vs ayer",
    no_open_deals: "Sin tratos abiertos",
    no_deals_yet: "Aún no hay tratos",
    create_deals_pip: "Crea tratos en el Embudo para ver el desglose aquí.",
    target_5m: "Meta 5m"
  },
  en: {
    dashboard: "Dashboard",
    inbox: "Inbox",
    notifications: "Notifications",
    contacts: "Contacts",
    pipelines: "Pipelines",
    broadcasts: "Broadcasts",
    automations: "Automations",
    flows: "Flows",
    aiAgents: "AI Agents",
    settings: "Settings",
    logout: "Log Out",
    welcome: "Welcome",
    active_conversations: "Active Conversations",
    new_contacts: "New Contacts Today",
    open_deals: "Open Deals Value",
    messages_sent: "Messages Sent Today",
    conversations_over_time: "Conversations Over Time",
    pipeline_value: "Pipeline Value",
    avg_first_response: "Average First Response Time",
    recent_activity: "Recent Activity",
    new_contact_btn: "New Contact",
    new_deal_btn: "New Deal",
    new_broadcast_btn: "New Broadcast",
    new_automation_btn: "New Automation",
    no_change: "No change new today vs yesterday",
    no_change_vs_yesterday: "No change vs yesterday",
    no_open_deals: "0 open deals",
    no_deals_yet: "No open deals yet",
    create_deals_pip: "Create deals in Pipelines to see stage breakdowns here.",
    target_5m: "Target 5m"
  }
};

export const LANG_STORAGE_KEY = 'wacrm.language';

export function getTranslation(key: string, locale: Locale): string {
  const dict = translations[locale] || translations.es;
  return dict[key as keyof typeof dict] || key;
}

export function useI18n() {
  const [locale, setLocale] = useState<Locale>('es'); // Default is Spanish!

  useEffect(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY) as Locale;
    if (saved === 'en' || saved === 'es') {
      setLocale(saved);
    }
  }, []);

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem(LANG_STORAGE_KEY, newLocale);
    // Reload window to update all hardcoded text components in dynamic routing
    window.location.reload();
  };

  const t = (key: string) => getTranslation(key, locale);

  return { locale, t, changeLocale };
}
