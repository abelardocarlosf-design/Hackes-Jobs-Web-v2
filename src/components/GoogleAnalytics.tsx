import Script from 'next/script';

// ID de medición GA4 (G-XXXXXXX). Sin ID no se carga nada.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// Consent Mode v2: analytics_storage arranca denegado y solo se concede si el
// usuario aceptó todas las cookies (hj_cookie_consent = 'all'), en línea con
// el banner de CookieConsent y la LFPDPPP.
export function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script id="ga-consent" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
var c=null;try{c=localStorage.getItem('hj_cookie_consent')}catch(e){}
gtag('consent','default',{analytics_storage:c==='all'?'granted':'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
gtag('js',new Date());gtag('config','${GA_ID}');
document.addEventListener('click',function(e){var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a)return;var h=a.getAttribute('href')||'';
if(h.indexOf('wa.me')>-1||h.indexOf('api.whatsapp.com')>-1)gtag('event','whatsapp_click',{link_url:h});
else if(h.indexOf('mailto:')===0)gtag('event','email_click',{link_url:h});});`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
    </>
  );
}

// Evento de conversión; no hace nada si GA no está cargado.
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  w.gtag?.('event', name, params);
}
