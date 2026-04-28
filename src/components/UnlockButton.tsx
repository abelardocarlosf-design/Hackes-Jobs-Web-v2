'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function UnlockButton({ testId, price }: { testId: string; price: number }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUnlock = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testId })
      });
      const data = await res.json();
      
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        // Redirigir a login si no está autenticado
        if (res.status === 401 || res.status === 403) {
          router.push('/login?redirect=/psicometrias');
        } else {
          alert(data.message || 'Error al iniciar el pago');
        }
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleUnlock} 
      disabled={isLoading}
      className="h-10 px-5 text-xs font-black rounded-xl bg-brand-black text-white hover:bg-brand-black/90 flex items-center justify-center min-w-[140px]"
    >
      {isLoading ? <Loader2 size={14} className="animate-spin" /> : `Desbloquear $${price}`}
    </Button>
  );
}
