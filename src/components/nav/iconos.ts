import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  User,
  UserPlus,
  BrainCircuit,
  Clock,
  Plus,
  type LucideIcon,
} from 'lucide-react';

/**
 * Resuelve las claves `icono` de `src/lib/navegacion.ts` a componentes.
 *
 * Vive separado porque `navegacion.ts` lo importa el middleware (runtime Edge)
 * y `lucide-react` no puede entrar en ese bundle.
 */
export const ICONOS: Record<string, LucideIcon> = {
  panel: LayoutDashboard,
  documento: FileText,
  maletin: Briefcase,
  usuarios: Users,
  usuario: User,
  altaUsuario: UserPlus,
  cerebro: BrainCircuit,
  reloj: Clock,
  mas: Plus,
};

export function iconoDe(clave?: string): LucideIcon {
  return (clave && ICONOS[clave]) || FileText;
}
