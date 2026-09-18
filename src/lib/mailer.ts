import nodemailer from 'nodemailer';

// La configuración SMTP vive en variables de entorno (.env.local en desarrollo,
// panel de Vercel en producción). Nunca en el código: este archivo va a git.
function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) return null;

  return { host, port, user, pass };
}

/**
 * Crea el transporte SMTP bajo demanda.
 * Retorna null si falta configuración, para que quien llame decida si eso es
 * un error fatal o algo que solo se registra.
 */
export function createTransporter() {
  const smtp = getSmtpConfig();
  if (!smtp) return null;

  return nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    auth: { user: smtp.user, pass: smtp.pass },
  });
}

/** Buzón interno que recibe las notificaciones de nuevos registros. */
function getNotificationRecipient() {
  return process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER || '';
}

export const sendCandidatePDFEmail = async (
  candidateName: string,
  candidateEmail: string,
  pdfBuffer: Buffer
) => {
  const smtp = getSmtpConfig();
  const transporter = createTransporter();

  if (!smtp || !transporter) {
    throw new Error(
      'SMTP no configurado: faltan SMTP_HOST, SMTP_USER o SMTP_PASSWORD en las variables de entorno.'
    );
  }

  const mailOptions = {
    from: `"Hacke's Jobs" <${smtp.user}>`,
    to: getNotificationRecipient(),
    subject: `Nuevo Candidato Registrado: ${candidateName}`,
    text: `Un nuevo candidato se ha registrado en la plataforma.\n\nNombre: ${candidateName}\nEmail: ${candidateEmail}`,
    attachments: [
      {
        filename: `Candidato_${candidateName.replace(/\s+/g, '_')}.pdf`,
        content: pdfBuffer,
      },
    ],
  };

  return await transporter.sendMail(mailOptions);
};
