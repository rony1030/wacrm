'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { RotateCcw, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SettingsPanelHead } from './settings-panel-head';

export function RenderGatewayPanel() {
  const [restarting, setRestarting] = useState(false);
  const gatewayUrl = process.env.NEXT_PUBLIC_RENDER_GATEWAY_URL || 'https://wacrm-render-gateway.onrender.com';

  async function handleRestart() {
    const confirmRestart = confirm('¿Estás seguro de que deseas reiniciar el Gateway de Render? Esto tomará aproximadamente un minuto.');
    if (!confirmRestart) return;

    setRestarting(true);
    const toastId = toast.loading('Reiniciando Gateway en Render...');
    try {
      const res = await fetch('/api/whatsapp/gateway-restart', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        toast.success('Reinicio solicitado con éxito. Espera unos segundos a que el QR se recargue.', { id: toastId });
      } else {
        toast.error(data.error || 'Error al reiniciar el Gateway.', { id: toastId });
      }
    } catch (err) {
      toast.error('Error de red al intentar reiniciar el Gateway.', { id: toastId });
    } finally {
      setRestarting(false);
    }
  }

  return (
    <section className="animate-in fade-in-50 duration-200">
      <SettingsPanelHead
        title="Render WhatsApp Gateway"
        description="Vincule su número de WhatsApp escaneando el código QR y administre el microservicio de Render."
      />

      <div className="grid gap-6">
        {/* Card 1: QR Code Connection */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Zap className="size-5 text-primary fill-primary/10" />
              Código QR de Vinculación
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Escanea el código QR a continuación desde la aplicación de WhatsApp de tu celular (Dispositivos Vinculados).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg border border-border min-h-[480px]">
              <iframe
                src={`${gatewayUrl}/api/qr`}
                className="w-full h-[460px] border-0 rounded bg-white dark:bg-zinc-950 overflow-hidden"
                style={{ overflow: 'hidden' }}
                scrolling="no"
                title="WhatsApp QR Code Gateway"
              />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Troubleshooting and Restart */}
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4 p-4 bg-muted rounded-lg border border-border flex-wrap md:flex-nowrap">
              <div>
                <h4 className="text-sm font-semibold text-foreground">¿El Gateway está desconectado o muestra errores?</h4>
                <p className="text-xs text-muted-foreground">Si el QR no carga o los mensajes no llegan, puedes reiniciar el servicio en Render para restablecer la conexión.</p>
              </div>
              <Button
                onClick={handleRestart}
                disabled={restarting}
                variant="outline"
                size="sm"
                className="border-red-900/40 text-red-400 hover:text-red-300 hover:bg-red-950/20 shrink-0"
              >
                {restarting ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Reiniciando...
                  </>
                ) : (
                  <>
                    <RotateCcw className="size-4 mr-2" />
                    Reiniciar Gateway
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
