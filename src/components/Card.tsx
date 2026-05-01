import { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Card({ children, className, style }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 transition-all duration-500 hover:shadow-premium-hover hover:-translate-y-1 overflow-hidden",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardProps) {
  return (
    <div className={cn("flex flex-col space-y-2 p-8 sm:p-10", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: CardProps) {
  return (
    <h3 className={cn("text-2xl sm:text-3xl font-black leading-none tracking-tighter uppercase", className)}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className }: CardProps) {
  return (
    <div className={cn("p-8 sm:p-10 pt-0", className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }: CardProps) {
  return (
    <div className={cn("flex items-center p-8 sm:p-10 pt-0", className)}>
      {children}
    </div>
  );
}
