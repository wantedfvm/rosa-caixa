import type { Metadata } from 'next';
import './globals.css';
import { CookieConsent } from '@/components/layout/CookieConsent';
import { ServiceWorkerRegister } from '@/components/layout/ServiceWorkerRegister';

export const metadata: Metadata = {
  title: 'Rosa Network | Controle de Caixa: Simples, Organizado e Gratuito',
  description: 'Sistema web gratuito de controle de caixa desenvolvido pela Rosa Network. Acompanhe entradas, saídas e saldo real sem depender de planilhas manuais.',
  keywords: ['controle de caixa', 'fluxo de caixa', 'finanças pessoais', 'pequenos negócios', 'Rosa Network', 'Lucas da Rosa'],
  authors: [{ name: 'Lucas da Rosa', url: 'https://wa.me/5551989509959' }],
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Rosa Caixa',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Rosa Caixa" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen bg-[#FAFAFA] text-[#09090B] antialiased">
        {children}
        <CookieConsent />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
