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
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue disabled:opacity-50 disabled:pointer-events-none active:scale-95 select-none';
  
  const variants = {
    primary: 'bg-brand-blue text-white hover:bg-blue-700 shadow-blue hover:shadow-blue/40',
    secondary: 'bg-brand-orange text-white hover:bg-orange-600 shadow-orange hover:shadow-orange/40',
    outline: 'border-2 border-slate-200 bg-transparent hover:border-brand-blue hover:text-brand-blue text-brand-black',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-brand-black',
    dark: 'bg-brand-black text-white hover:bg-zinc-800 shadow-premium',
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
