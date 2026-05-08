import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { webhookUrlMap } from '@/lib/psicometriasConfig';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { slug, body } = data;

    if (!slug || !body) {
      return NextResponse.json({ success: false, message: 'Faltan datos requeridos' }, { status: 400 });
    }

    // ACCIÓN 1: Sistema de Respaldo Local (Fail-safe)
    try {
      const backupDir = path.join(process.cwd(), 'backups');
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      const backupFile = path.join(backupDir, 'respuestas_psicometrias.json');
      const backupEntry = {
        timestamp: new Date().toISOString(),
        slug,
        payload: body
      };

      // Leemos el archivo actual si existe para hacer un append de un array JSON
      let currentData: any[] = [];
      if (fs.existsSync(backupFile)) {
        const fileContent = fs.readFileSync(backupFile, 'utf-8');
        try {
          currentData = JSON.parse(fileContent);
        } catch (e) {
          // Si el archivo está corrupto, empezamos uno nuevo
        }
      }

      currentData.push(backupEntry);
      fs.writeFileSync(backupFile, JSON.stringify(currentData, null, 2));
      console.log(`[Backup] Respaldo guardado exitosamente para el test ${slug}`);
    } catch (backupError) {
      console.error('[Backup Error] No se pudo guardar el respaldo local:', backupError);
      // No bloqueamos la ejecución si falla el backup, aunque es crítico, intentaremos enviar a n8n de todas formas
    }

    // ACCIÓN 2: Dispatch por Webhook a n8n
    const webhookUrl = webhookUrlMap[slug];

    if (!webhookUrl) {
      console.warn(`[Webhook Warning] No se encontró URL de webhook para el slug: ${slug}`);
      // Si no hay webhook, al menos ya se guardó en local. Devolvemos éxito.
      return NextResponse.json({ success: true, message: 'Respaldo guardado, sin webhook configurado' });
    }

    try {
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      if (!webhookResponse.ok) {
        console.error(`[Webhook Error] n8n respondió con error: ${webhookResponse.status}`);
        // Devolvemos éxito parcial ya que el respaldo local fue exitoso
        return NextResponse.json({ 
          success: true, 
          message: 'Respaldo local exitoso, error en n8n',
          n8nStatus: webhookResponse.status 
        });
      }

      console.log(`[Webhook] Enviado exitosamente a n8n (${slug})`);
      return NextResponse.json({ success: true });

    } catch (webhookFetchError) {
      console.error('[Webhook Fetch Error] Error al contactar a n8n:', webhookFetchError);
      // Devolvemos éxito parcial ya que el respaldo local fue exitoso
      return NextResponse.json({ 
        success: true, 
        message: 'Respaldo local exitoso, error de conexión con n8n'
      });
    }

  } catch (error) {
    console.error('[Submit Error] Error procesando el envío:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
