import { config } from 'dotenv';
import { SignJWT } from 'jose';

config({ path: '.env', quiet: true });
config({ path: '.env.local', override: true, quiet: true });

// Sin valor por defecto a propósito: el que había aquí era el mismo secreto
// que estuvo publicado en el repositorio, y dejarlo escrito invita a volver a
// usarlo. Si falta JWT_SECRET, este script no debe firmar nada.
if (!process.env.JWT_SECRET) {
  console.error('Falta JWT_SECRET en .env. No se firma ningún token.');
  process.exit(1);
}

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const role = process.argv[2] || 'admin';

const token = await new SignJWT({
  userId: 'test-user-id',
  email: 'test@hackesjobs.com.mx',
  role,
  name: 'Test User',
})
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setIssuer('hackesjobs')
  .setAudience('hackesjobs-app')
  .setExpirationTime('1h')
  .sign(SECRET);

console.log(token);
