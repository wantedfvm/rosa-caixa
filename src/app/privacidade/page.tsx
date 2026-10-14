import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Lock } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'Privacidade e LGPD | Rosa Network — Controle de Caixa',
  description: 'Política de privacidade e proteção de dados pessoais em conformidade com a LGPD.',
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between">
      <header className="border-b border-[#E4E4E7] bg-white py-4 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[#52525B] hover:text-[#09090B]">
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao início</span>
          </Link>
          <div className="flex items-center gap-2">
            <Image src="/logo-rosa.png" alt="Rosa Network" width={22} height={22} className="object-contain" />
            <span className="text-xs font-bold text-[#09090B] tracking-tight">ROSA NETWORK</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-8 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F4F4F5] text-xs font-semibold text-[#09090B] border border-[#E4E4E7]">
            <Lock className="w-3.5 h-3.5" />
            <span>Conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#09090B] tracking-tight">
            Política de Privacidade e LGPD
          </h1>
          <p className="text-xs text-[#71717A]">
            Última atualização: 14 de outubro de 2026
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E4E4E7] space-y-6 text-sm text-[#52525B] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#09090B]">1. Controlador e Encarregado dos Dados</h2>
            <p>
              O controlador dos dados tratados nesta aplicação é a <strong>Rosa Network</strong>, sob coordenação de <strong>Lucas da Rosa</strong>. Para esclarecimentos sobre privacidade, o titular pode entrar em contato diretamente pelo canal profissional de WhatsApp informado no rodapé.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#09090B]">2. Dados Pessoais Coletados e Base Legal</h2>
            <p>
              Coletamos estritamente os dados necessários para o funcionamento seguro da aplicação (princípio da necessidade e minimização de dados):
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li><strong>Dados Cadastrais:</strong> Nome completo e endereço de e-mail (para identificação e login).</li>
              <li><strong>Dados de Autenticação:</strong> Senha criptografada com algoritmo Scrypt (a senha original nunca é armazenada em texto simples).</li>
              <li><strong>Registros Financeiros:</strong> Valores em centavos, datas, categorias e descrições inseridas pelo próprio usuário.</li>
            </ul>
            <p className="pt-1">
              A base legal para o tratamento é a execução do serviço solicitado pelo titular (Artigo 7º, V da LGPD).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#09090B]">3. Política de Cookies Essenciais</h2>
            <p>
              Utilizamos <strong>exclusivamente cookies estritamente necessários</strong> para autenticação de sessão e prevenção de fraudes (CSRF):
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li>Não utilizamos cookies de rastreamento para fins de marketing ou publicidade.</li>
              <li>Não compartilhamos seus dados financeiros com corretores de anúncios ou empresas de mídia.</li>
              <li>Os cookies de sessão utilizam as diretivas seguras <code>HttpOnly</code>, <code>Secure</code> e <code>SameSite=Lax</code>.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#09090B]">4. Direitos do Titular (Artigo 18 da LGPD)</h2>
            <p>O usuário pode exercer seus direitos a qualquer momento:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li><strong>Acesso e Confirmação:</strong> Visualizar todo o histórico financeiro na tela de movimentações.</li>
              <li><strong>Portabilidade dos Dados:</strong> Exportar todos os lançamentos para arquivo de planilha (formato CSV) a qualquer momento.</li>
              <li><strong>Correção:</strong> Editar descrições, categorias, datas e valores diretamente no sistema.</li>
              <li><strong>Eliminação Total:</strong> Excluir a conta e apagar definitivamente todos os registros da base de dados através do painel de Configurações.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#09090B]">5. Segurança e Armazenamento</h2>
            <p>
              As informações são armazenadas em banco de dados relacional com comunicação criptografada por TLS/HTTPS e proteção de acesso no servidor. As rotinas de backup permitem restauração em caso de incidentes técnicos sem expor os registros a terceiros.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
