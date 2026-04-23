export type UserRole = 'ADMIN' | 'EDITOR';

export interface User {
  id: string;
  username: string;
  passwordHash?: string;
  name: string;
  role: UserRole;
  avatar?: string;
}
