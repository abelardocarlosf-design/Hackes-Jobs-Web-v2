'use client';

import React from 'react';
import { Button } from '@/components/Button';

interface WhatsAppButtonProps {
  label?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function WhatsAppButton({ 
  label = 'Hablar con un experto', 
  variant = 'outline', 
  size = 'xl', 
  className 
}: WhatsAppButtonProps) {
  const handleClick = () => {
    // Registrar conversión en backend (analytics/dashboard)
    fetch('/api/conversion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'whatsapp_click', source: 'empresas_hero', label })
    }).catch(e => console.error(e));

    // Redirigir a WhatsApp
    window.open('https://wa.me/525650405218', '_blank');
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={className} 
      onClick={handleClick}
    >
      {label}
    </Button>
  );
}
