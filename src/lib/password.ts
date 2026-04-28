import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Genera un hash seguro de una contraseña.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compara una contraseña en texto plano con su hash.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
