import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#E4E4E7] bg-white py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        {/* Identificação institucional Rosa Network */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-7 h-7 shrink-0">
            <Image
              src="/logo-rosa.png"
              alt="Rosa Network Logo"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          <div>
            <p className="text-xs font-bold text-[#09090B]">
              ROSA NETWORK
            </p>
            <p className="text-[11px] text-[#71717A]">
              Conectando você a resultados.
            </p>
          </div>
        </div>

        {/* Crédito de autoria e contato profissional */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-[#52525B]">
          <p>
            Desenvolvido por <span className="font-semibold text-[#09090B]">Lucas da Rosa</span> — Founder & CEO
          </p>
          <a
            href="https://wa.me/5551989509959"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F4F4F5] text-[#09090B] font-medium hover:bg-[#E4E4E7] transition-all touch-target"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Falar no WhatsApp</span>
          </a>
        </div>

        {/* Links obrigatórios de governança e LGPD */}
        <div className="flex items-center gap-4 text-xs text-[#71717A]">
          <Link href="/termos" className="hover:text-[#09090B] transition-colors underline-offset-4 hover:underline">
            Termos de Uso
          </Link>
          <span>•</span>
          <Link href="/privacidade" className="hover:text-[#09090B] transition-colors underline-offset-4 hover:underline">
            Privacidade e LGPD
          </Link>
        </div>
      </div>
    </footer>
  );
};
