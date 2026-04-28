import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'abelardo.carlos@hackesjobs.com',
    pass: 'r#BUg#3Q',
  },
});

export const sendCandidatePDFEmail = async (candidateName: string, candidateEmail: string, pdfBuffer: Buffer) => {
  const mailOptions = {
    from: '"Hackes Jobs" <abelardo.carlos@hackesjobs.com>',
    to: 'abelardo.carlos@hackesjobs.com',
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
