'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/Button';

export const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('rosa_lgpd_consent_2026');
      if (!consent) {
        setVisible(true);
      }
    } catch {
      // LocalStorage desativado ou modo anônimo restritivo
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('rosa_lgpd_consent_2026', 'true');
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Aviso de privacidade e consentimento de cookies"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-lg bg-white border border-[#E4E4E7] rounded-2xl shadow-pop p-4 sm:p-5 z-50 animate-in slide-in-from-bottom-4 duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-[#F4F4F5] rounded-xl text-[#09090B] shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5 text-[#16A34A]" />
        </div>

        <div className="space-y-3 text-xs text-[#52525B] flex-1">
          <div>
            <h2 className="font-bold text-sm text-[#09090B]">
              Privacidade e uso de dados (LGPD)
            </h2>
            <p className="mt-1 text-[#52525B] leading-relaxed">
              Coletamos apenas as informações necessárias para operar sua conta e manter seu acesso seguro. Não usamos cookies para fins de anúncio ou marketing.
            </p>
          </div>

          {/* Declaração explícita do que é coletado */}
          <div className="rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] p-3 space-y-2">
            <div className="font-semibold text-[#09090B] text-[11px] uppercase tracking-wider">
              O que coletamos e como usamos:
            </div>
            <ul className="space-y-1.5 list-disc pl-4 text-[#52525B]">
              <li>
                <strong className="text-[#09090B]">Cookies essenciais:</strong> um identificador temporário de sessão criptografada para manter seu login ativo e barrar tentativas de fraude.
              </li>
              <li>
                <strong className="text-[#09090B]">Dados de cadastro:</strong> somente seu nome e e-mail para identificação da sua conta.
              </li>
              <li>
                <strong className="text-[#09090B]">Dados financeiros:</strong> apenas as movimentações, datas, valores e categorias que você registrar no controle de caixa.
              </li>
            </ul>

            {showDetails && (
              <div className="pt-2 border-t border-[#E4E4E7] space-y-1 text-[#71717A]">
                <p>
                  Seus dados nunca são vendidos ou repassados a terceiros. Você pode baixar seu extrato em planilha ou excluir sua conta e apagar todos os registros no painel de configurações quando quiser.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#09090B] hover:underline pt-0.5 cursor-pointer"
            >
              <span>{showDetails ? 'Ocultar detalhes legais' : 'Ver mais detalhes da base legal'}</span>
              {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button size="sm" onClick={handleAccept} className="w-full sm:w-auto">
              Concordar e continuar
            </Button>
            <Link
              href="/privacidade"
              className="text-xs font-semibold text-[#52525B] hover:text-[#09090B] px-2 py-1.5 rounded-lg hover:bg-[#F4F4F5] transition-colors"
            >
              Política de privacidade completa
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};
