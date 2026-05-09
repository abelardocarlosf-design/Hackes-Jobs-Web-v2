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

    // ACCIÓN 1: Sistema de Respaldo Local (Fail-safe) Dual (JSON y CSV)
    try {
      const backupDir = path.join(process.cwd(), 'backups');
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      // 1. Respaldo CSV de Contactos (Lead Gen)
      const csvFile = path.join(backupDir, 'directorio_pacientes.csv');
      const header = 'Fecha,Nombre Completo,Email,Telefono,Test Realizado\n';
      
      const dp = body.datos_paciente || {};
      const safeName = (dp.nombre_completo || '').replace(/"/g, '""');
      const safeEmail = (dp.email || '').replace(/"/g, '""');
      const safePhone = (dp.telefono || '').replace(/"/g, '""');
      const timestamp = new Date().toISOString();
      const csvLine = `"${timestamp}","${safeName}","${safeEmail}","${safePhone}","${slug}"\n`;

      if (!fs.existsSync(csvFile)) {
        fs.writeFileSync(csvFile, header + csvLine, 'utf8');
      } else {
        fs.appendFileSync(csvFile, csvLine, 'utf8');
      }

      // 2. Respaldo JSON completo
      const jsonFile = path.join(backupDir, 'respuestas_completas.json');
      const backupEntry = {
        timestamp,
        slug,
        payload: body
      };

      let currentData: any[] = [];
      if (fs.existsSync(jsonFile)) {
        const fileContent = fs.readFileSync(jsonFile, 'utf-8');
        try {
          if (fileContent.trim()) {
            currentData = JSON.parse(fileContent);
          }
        } catch (e) {
          // Si el archivo está corrupto, empezamos uno nuevo o lo ignoramos
          console.error('[Backup Error] Error parseando JSON existente:', e);
        }
      }

      currentData.push(backupEntry);
      fs.writeFileSync(jsonFile, JSON.stringify(currentData, null, 2), 'utf8');

      console.log(`[Backup] Respaldo dual (CSV/JSON) guardado exitosamente para ${slug}`);
    } catch (backupError) {
      console.error('[Backup Error] No se pudo guardar el respaldo local:', backupError);
    }

    // ACCIÓN 2: Dispatch por Webhook a n8n
    const webhookUrl = webhookUrlMap[slug];

    if (!webhookUrl) {
      console.warn(`[Webhook Warning] No se encontró URL de webhook para el slug: ${slug}`);
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
