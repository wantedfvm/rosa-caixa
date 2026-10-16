import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, Globe, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#E4E4E7] bg-white py-8 px-4 sm:px-6 mb-20 md:mb-0 mt-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Identificação institucional Rosa Network */}
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 shrink-0 rounded-xl overflow-hidden bg-white border border-[#E4E4E7] p-1 shadow-2xs">
            <Image
              src="/logo-rosa.png"
              alt="Rosa Network Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#09090B] tracking-tight">
                ROSA NETWORK
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]">
                100% Gratuito
              </span>
            </div>
            <p className="text-[11px] text-[#71717A]">
              Conectando você a resultados.
            </p>
          </div>
        </div>

        {/* Crédito de autoria e contato profissional */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-xs text-[#52525B]">
          <p className="flex items-center gap-1.5">
            <span>Desenvolvido por</span>
            <strong className="text-[#09090B]">Lucas da Rosa</strong>
            <span className="text-[#71717A]">(Rosa Network)</span>
          </p>

          <div className="flex items-center gap-2">
            <a
              href="https://rosanetwork.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#09090B] font-semibold text-xs transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#71717A]" />
              <span>rosanetwork.cloud</span>
            </a>

            <a
              href="https://wa.me/5551989509959"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#16A34A] font-bold text-xs transition-colors border border-[#DCFCE7]"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>(51) 98950-9959</span>
            </a>
          </div>
        </div>

        {/* Links obrigatórios de governança e LGPD */}
        <div className="flex items-center gap-3 text-xs text-[#71717A]">
          <Link href="/termos" className="hover:text-[#09090B] transition-colors underline-offset-4 hover:underline">
            Termos
          </Link>
          <span>•</span>
          <Link href="/privacidade" className="hover:text-[#09090B] transition-colors underline-offset-4 hover:underline">
            Privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
};
