import fs from 'fs';
import path from 'path';
import { Subscriber } from './newsletter.types';

export * from './newsletter.types';

const SUBSCRIBERS_PATH = path.join(process.cwd(), 'data/subscribers.json');

// Ensure data directory exists
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export async function getAllSubscribers(): Promise<Subscriber[]> {
  if (!fs.existsSync(SUBSCRIBERS_PATH)) return [];
  
  try {
    const content = fs.readFileSync(SUBSCRIBERS_PATH, 'utf8');
    return JSON.parse(content) as Subscriber[];
  } catch (error) {
    return [];
  }
}

export async function addSubscriber(email: string): Promise<{ success: boolean; message: string }> {
  const subscribers = await getAllSubscribers();
  
  if (subscribers.find(s => s.email === email)) {
    return { success: false, message: 'Este correo ya está suscrito.' };
  }

  const newSubscriber: Subscriber = {
    email,
    date: new Date().toISOString(),
  };

  subscribers.push(newSubscriber);
  
  try {
    fs.writeFileSync(SUBSCRIBERS_PATH, JSON.stringify(subscribers, null, 2), 'utf8');
    return { success: true, message: '¡Gracias por suscribirte!' };
  } catch (error) {
    return { success: false, message: 'Error al guardar la suscripción.' };
  }
}
