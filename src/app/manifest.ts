import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Rosa Caixa | Controle de Caixa',
    short_name: 'Rosa Caixa',
    description: 'Controle de caixa simples, organizado e gratuito para autônomos e pequenos negócios.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#FAFAFA',
    theme_color: '#09090B',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo-rosa-comfundo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
