import fs from 'fs';
import path from 'path';
import { User, UserRole } from './auth.types';

export * from './auth.types';

const USERS_PATH = path.join(process.cwd(), 'data/users.json');

// Initial setup with default admin if not exists
if (!fs.existsSync(USERS_PATH)) {
  const defaultAdmin: User = {
    id: '1',
    username: process.env.BLOG_ADMIN_USER || 'admin',
    passwordHash: process.env.BLOG_ADMIN_PASS || 'hackesjobs2025',
    name: 'Administrador Principal',
    role: 'ADMIN'
  };
  fs.writeFileSync(USERS_PATH, JSON.stringify([defaultAdmin], null, 2));
}

export async function getUsers(): Promise<User[]> {
  const content = fs.readFileSync(USERS_PATH, 'utf8');
  return JSON.parse(content);
}

export async function saveUsers(users: User[]): Promise<void> {
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
}

export async function addUser(user: Omit<User, 'id'>): Promise<User> {
  const users = await getUsers();
  const newUser = {
    ...user,
    id: Math.random().toString(36).substr(2, 9)
  };
  users.push(newUser);
  await saveUsers(users);
  return newUser as User;
}

export async function deleteUser(id: string): Promise<void> {
  const users = await getUsers();
  const filteredUsers = users.filter(u => u.id !== id);
  await saveUsers(filteredUsers);
}
