'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

export const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('controlerosa_cookie_consent');
      if (!consent) {
        setVisible(true);
      }
    } catch {
      // LocalStorage desativado ou privado
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('controlerosa_cookie_consent', 'true');
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de cookies e privacidade"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md bg-white border border-[#E4E4E7] rounded-2xl shadow-pop p-4 z-50 animate-in slide-in-from-bottom-4 duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-[#F4F4F5] rounded-xl text-[#09090B] shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-2 text-xs text-[#52525B]">
          <p className="font-semibold text-[#09090B]">Privacidade e Cookies Essenciais</p>
          <p className="leading-relaxed">
            Utilizamos apenas cookies necessários para manter sua sessão segura e proteger seus dados financeiros (LGPD). Não usamos cookies de publicidade.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <Button size="sm" onClick={handleAccept}>
              Entendi e concordo
            </Button>
            <Link
              href="/privacidade"
              className="text-xs font-semibold text-[#71717A] hover:text-[#09090B] underline transition-colors px-2 py-1"
            >
              Ver política
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
