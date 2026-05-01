import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className,
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue disabled:opacity-50 disabled:pointer-events-none active:scale-[0.95] select-none';
  
  const variants = {
    primary: 'bg-brand-blue text-white hover:bg-blue-600 shadow-blue hover:shadow-blue/60 active:shadow-[0_0_20px_rgba(30,64,175,0.6)] border-none',
    secondary: 'bg-brand-orange text-white hover:bg-orange-600 shadow-orange hover:shadow-orange/60 active:shadow-[0_0_20px_rgba(255,107,0,0.6)] border-none',
    outline: 'border-2 border-white/20 bg-transparent hover:border-brand-blue hover:text-brand-blue text-white active:shadow-[0_0_20px_rgba(30,64,175,0.2)]',
    ghost: 'bg-transparent hover:bg-white/5 text-slate-400 hover:text-white active:shadow-[0_0_15px_rgba(255,255,255,0.1)]',
    dark: 'bg-brand-black text-white hover:bg-zinc-800 shadow-premium active:shadow-[0_0_20px_rgba(0,0,0,0.8)] border border-white/10',
  };

  const sizes = {
    sm: 'h-10 px-4 text-xs uppercase tracking-widest rounded-xl',
    md: 'h-12 px-6 text-sm uppercase tracking-widest rounded-2xl',
    lg: 'h-14 px-8 text-base rounded-2xl',
    xl: 'h-20 px-12 text-xl rounded-3xl font-black',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
