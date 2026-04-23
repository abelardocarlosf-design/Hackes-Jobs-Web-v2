import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

// Form validation schema
const schema = z.object({
  nombre: z.string().min(2, "El nombre es muy corto"),
  empresa: z.string().min(2, "El nombre de la empresa es muy corto"),
  email: z.string().email("Email inválido"),
  telefono: z.string().min(10, "El teléfono debe tener al menos 10 dígitos"),
  vacante: z.string().min(3, "La descripción de la vacante es muy corta"),
});

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&"']/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&apos;';
      default: return c;
    }
  });
}

// Función para lectura manual de variables de entorno para SMTP
function getSmtpEnv() {
  const env = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || null,
    pass: process.env.SMTP_PASSWORD || null,
  };

  if (env.user && env.pass) return env;

  const pathsToCheck = ['.env.local', '.env.local.txt'];
  for (const fileName of pathsToCheck) {
    const envPath = path.resolve(process.cwd(), fileName);
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
        
        if (key.trim() === 'SMTP_HOST') env.host = value;
        if (key.trim() === 'SMTP_PORT') env.port = Number(value);
        if (key.trim() === 'SMTP_USER') env.user = value;
        if (key.trim() === 'SMTP_PASSWORD') env.pass = value;
      }
    }
    if (env.user && env.pass) break;
  }
  return env;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Server-side validation
    const result = schema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ 
        success: false, 
        errors: result.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const { nombre, empresa, email, telefono, vacante } = result.data;
    const fecha = new Date().toISOString();

    // Obtener configuración SMTP
    const smtp = getSmtpEnv();

    if (!smtp.user || !smtp.pass) {
      console.error('[Error SMTP]: Faltan credenciales de correo (SMTP_USER/SMTP_PASSWORD)');
      return NextResponse.json({ 
        success: false, 
        message: 'Error de configuración en el servidor: Faltan credenciales de correo.' 
      }, { status: 500 });
    }

    // Generate XML content
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<solicitud_talento>
  <fecha>${fecha}</fecha>
  <nombre_completo>${escapeXml(nombre)}</nombre_completo>
  <empresa>${escapeXml(empresa)}</empresa>
  <email>${escapeXml(email)}</email>
  <telefono>${escapeXml(telefono)}</telefono>
  <vacante>${escapeXml(vacante)}</vacante>
</solicitud_talento>`;

    // Email Configuration
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465, // true para 465, false para otros
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
      tls: {
        // No fallar si el certificado es auto-firmado (común en algunos servidores de hosting)
        rejectUnauthorized: false
      },
      connectionTimeout: 10000, 
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    const mailOptions = {
      from: `"Hacke's Jobs - Sistema" <${smtp.user}>`,
      to: 'abelardo.carlos@hackesjobs.com.mx',
      subject: `Nueva Solicitud de Talento: ${empresa}`,
      text: `Has recibido una nueva solicitud de talento de ${nombre} (${empresa}).\n\nDetalles:\nEmail: ${email}\nTeléfono: ${telefono}\nVacante: ${vacante}\n\nSe adjunta el archivo XML para el sistema.`,
      attachments: [
        {
          filename: `solicitud_${empresa.replace(/\s+/g, '_')}_${new Date().getTime()}.xml`,
          content: xmlContent,
          contentType: 'application/xml',
        },
      ],
    };

    // Send Email
    try {
      await transporter.sendMail(mailOptions);
    } catch (mailError: any) {
      console.error('[Nodemailer Error]:', mailError.message);
      return NextResponse.json({ 
        success: false, 
        message: `Error al enviar el correo: ${mailError.message}. Verifica que el usuario y contraseña de SMTP sean correctos.` 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Solicitud enviada exitosamente' 
    });

  } catch (error: any) {
    console.error('Error en solicitar-talento:', error);
    return NextResponse.json({ 
      success: false, 
      message: `Error crítico: ${error.message || 'Ocurrió un error al procesar la solicitud'}` 
    }, { status: 500 });
  }
}
