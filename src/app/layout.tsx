import type { Metadata } from 'next';
import './globals.css';
import { CookieConsent } from '@/components/layout/CookieConsent';

export const metadata: Metadata = {
  title: 'Rosa Network | Controle de Caixa: Simples, Organizado e Gratuito',
  description: 'Sistema web gratuito de controle de caixa desenvolvido pela Rosa Network. Acompanhe entradas, saídas e saldo real sem depender de planilhas manuais.',
  keywords: ['controle de caixa', 'fluxo de caixa', 'finanças pessoais', 'pequenos negócios', 'Rosa Network', 'Lucas da Rosa'],
  authors: [{ name: 'Lucas da Rosa', url: 'https://wa.me/5551989509959' }],
  icons: {
    icon: [
      { url: '/icon.png', sizes: '64x64', type: 'image/png' },
      { url: '/favicon.png', type: 'image/png' },
      { url: '/logo-rosa.png', type: 'image/png' },
    ],
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#FAFAFA] text-[#09090B] antialiased">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
