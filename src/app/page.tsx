import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, TrendingUp, ShieldCheck, Smartphone, FileSpreadsheet } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between">
      {/* Barra de Navegação Pública */}
      <header className="border-b border-[#E4E4E7] bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 shrink-0">
              <Image
                src="/logo-rosa.png"
                alt="Rosa Network Logo"
                width={32}
                height={32}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <span className="text-sm font-bold text-[#09090B] tracking-tight block">
                ROSA NETWORK
              </span>
              <span className="text-[10px] text-[#71717A] hidden sm:block">
                Controle de Caixa
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold text-[#52525B] hover:text-[#09090B] px-3 py-2 rounded-lg transition-colors touch-target flex items-center"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="text-xs sm:text-sm font-semibold bg-[#09090B] text-white hover:bg-[#27272A] px-4 py-2.5 rounded-xl transition-all shadow-xs touch-target flex items-center gap-1.5"
            >
              <span>Criar Conta</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal da Apresentação */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16 space-y-16">
        {/* Seção Hero Direta ao Ponto */}
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4F4F5] border border-[#E4E4E7] text-xs font-semibold text-[#09090B]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Gratuito • Simples • Sem anúncios</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#09090B] tracking-tight leading-[1.15]">
            Controle de caixa feito para substituir sua planilha manual.
          </h1>

          <p className="text-sm sm:text-base text-[#52525B] leading-relaxed max-w-2xl mx-auto">
            Registre entradas e saídas no computador ou celular em menos de 10 segundos. O sistema calcula o saldo real automaticamente e guarda seu histórico com segurança.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/cadastro"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#09090B] text-white font-bold rounded-xl shadow-card hover:bg-[#27272A] active:scale-98 transition-all flex items-center justify-center gap-2 text-sm touch-target"
            >
              <span>Começar a Usar Gratuitamente</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3.5 bg-white text-[#09090B] font-semibold rounded-xl border border-[#E4E4E7] hover:bg-[#F4F4F5] transition-all flex items-center justify-center text-sm touch-target"
            >
              Já tenho uma conta
            </Link>
          </div>
        </div>

        {/* Comparativo Prático: Planilha vs. Sistema */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-[#09090B] tracking-tight">
              Por que deixar a planilha de lado?
            </h2>
            <p className="text-xs sm:text-sm text-[#71717A]">
              Uma comparação direta com o método tradicional de preenchimento manual.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Cartão Planilha Manual */}
            <div className="bg-white p-6 rounded-2xl border border-red-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 text-[#DC2626]">
                <FileSpreadsheet className="w-5 h-5" />
                <span className="font-bold text-sm uppercase tracking-wider">Planilha Manual</span>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#52525B]">
                <li className="flex items-start gap-2">
                  <span className="text-[#DC2626] font-bold">✕</span>
                  <span>Fórmulas quebram facilmente ao excluir linhas ou copiar células.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#DC2626] font-bold">✕</span>
                  <span>Difícil de usar no celular (exige zoom constante e rolagem lateral).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#DC2626] font-bold">✕</span>
                  <span>Risco de perder arquivos locais ou sobrescrever dados antigos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#DC2626] font-bold">✕</span>
                  <span>Sem separação clara entre o lucro do mês e o dinheiro total em mãos.</span>
                </li>
              </ul>
            </div>

            {/* Cartão Controle de Caixa Rosa Network */}
            <div className="bg-white p-6 rounded-2xl border border-green-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 text-[#16A34A]">
                <TrendingUp className="w-5 h-5" />
                <span className="font-bold text-sm uppercase tracking-wider">Rosa Network — Caixa</span>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#52525B]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>Cálculo automático de saldo com precisão exata em centavos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>Formulário rápido adaptado ao teclado numérico do smartphone.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>Seus dados salvos em nuvem protegida, acessíveis de qualquer lugar.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>Exportação em CSV pronta para abrir no Excel quando você quiser.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3 Pilares Rápidos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E4E4E7] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#F4F4F5] text-[#09090B] flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#09090B]">Pronto para o celular</h3>
            <p className="text-xs text-[#71717A] leading-relaxed">
              Botões confortáveis para o polegar e alvos de toque de 44px sem zoom forçado da tela.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E4E4E7] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#F4F4F5] text-[#09090B] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#09090B]">Privacidade por padrão</h3>
            <p className="text-xs text-[#71717A] leading-relaxed">
              Isolamento de dados por usuário. Ninguém acessa suas movimentações a não ser você.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E4E4E7] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#F4F4F5] text-[#09090B] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#09090B]">Saldo inicial configurável</h3>
            <p className="text-xs text-[#71717A] leading-relaxed">
              Defina o valor em caixa no dia em que começou para manter o histórico coerente.
            </p>
          </div>
        </div>

        {/* Chamada Final */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E4E4E7] text-center space-y-4 shadow-sm">
          <h2 className="text-2xl font-bold text-[#09090B] tracking-tight">
            Pronto para organizar seu caixa?
          </h2>
          <p className="text-xs sm:text-sm text-[#52525B] max-w-lg mx-auto">
            Crie sua conta em 30 segundos usando apenas nome, e-mail e senha. O sistema é gratuito.
          </p>
          <div className="pt-2 flex justify-center">
            <Link
              href="/cadastro"
              className="px-6 py-3 bg-[#09090B] text-white font-bold rounded-xl hover:bg-[#27272A] transition-all flex items-center gap-2 text-sm touch-target"
            >
              <span>Criar Conta Gratuita</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
