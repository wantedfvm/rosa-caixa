import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Shield } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'Termos de Uso | Rosa Network — Controle de Caixa',
  description: 'Termos de uso do sistema gratuito de controle de caixa da Rosa Network.',
};

export default function TermosDeUsoPage() {
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
            <Shield className="w-3.5 h-3.5" />
            <span>Termos e Condições</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#09090B] tracking-tight">
            Termos de Uso
          </h1>
          <p className="text-xs text-[#71717A]">
            Última atualização: 14 de outubro de 2026
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E4E4E7] space-y-6 text-sm text-[#52525B] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#09090B]">1. Objeto e Finalidade do Sistema</h2>
            <p>
              O <strong>Rosa Network — Controle de Caixa</strong> é uma ferramenta web gratuita destinada ao registro simplificado de entradas, saídas, saldo e resultado de fluxo de caixa para uso pessoal, autônomo e de pequenos empreendimentos.
            </p>
            <p>
              O sistema não constitui consultoria financeira, contábil ou fiscal e não substitui a atuação de contadores profissionais habilitados ou obrigações acessórias perante os órgãos tributários.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#09090B]">2. Acesso, Cadastro e Responsabilidade</h2>
            <p>
              Para utilizar a ferramenta, o usuário cria uma conta mediante e-mail válido e senha segura. O usuário é o único responsável por manter o sigilo de suas credenciais e por todas as movimentações realizadas em sua conta.
            </p>
            <p>
              É expressamente proibido utilizar a plataforma para fins ilícitos, tentar violar a segurança de outros usuários ou sobrecarregar a infraestrutura intencionalmente.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#09090B]">3. Gratuidade e Disponibilidade</h2>
            <p>
              O acesso básico às funcionalidades de controle de caixa é gratuito. A Rosa Network emprega boas práticas de engenharia para assegurar a estabilidade do serviço, mas não garante funcionamento ininterrupto ou livre de instabilidades temporárias de conexão ou manutenção de infraestrutura.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#09090B]">4. Propriedade Intelectual</h2>
            <p>
              A marca Rosa Network, logotipos, layout, design system e código-fonte pertencem à Rosa Network e a Lucas da Rosa. Os dados financeiros inseridos pertencem exclusivamente ao usuário titular da conta.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#09090B]">5. Cancelamento e Exclusão</h2>
            <p>
              O usuário pode encerrar o uso e solicitar a exclusão de sua conta e histórico financeiro a qualquer momento na tela de Configurações, conforme previsto na Lei Geral de Proteção de Dados (LGPD).
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
