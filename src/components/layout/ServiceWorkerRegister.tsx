'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    deferredPWAInstallPrompt?: any;
  }
}

export function ServiceWorkerRegister() {
  useEffect(() => {
    // 1. Registrar Service Worker para PWA
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('Rosa Caixa PWA Service Worker registrado:', reg.scope);
          })
          .catch((err) => {
            console.error('Falha ao registrar Service Worker:', err);
          });
      });
    }

    // 2. Capturar evento de instalação do Chrome/Android
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      window.deferredPWAInstallPrompt = e;
      window.dispatchEvent(new CustomEvent('pwa-install-ready'));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return null;
}
