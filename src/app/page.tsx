import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, TrendingUp, FileSpreadsheet, Download, Tags, Lock } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between">
      {/* Barra de navegacao publica */}
      <header className="border-b border-[#E4E4E7] bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 shrink-0">
              <Image
                src="/logo-rosa.png"
                alt="Logo da Rosa Network"
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
              className="text-xs sm:text-sm font-semibold text-[#52525B] hover:text-[#09090B] px-3 py-2 rounded-lg transition-colors flex items-center"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="text-xs sm:text-sm font-semibold bg-[#09090B] text-white hover:bg-[#27272A] px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Criar conta</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Conteudo principal */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16 space-y-16">
        {/* Cabecalho e chamada principal */}
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4F4F5] border border-[#E4E4E7] text-xs font-semibold text-[#09090B]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Sistema gratuito sem cobranças ou anúncios</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-xs font-semibold text-[#881337]">
              <div className="relative w-4 h-4 rounded-full overflow-hidden shrink-0 border border-rose-300">
                <Image
                  src="/mascote-rosa.png"
                  alt="Rosinha"
                  fill
                  sizes="16px"
                  className="object-cover"
                />
              </div>
              <span>Com a Rosinha, mascote da Rosa Network</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#09090B] tracking-tight leading-[1.15]">
            Controle de caixa para quem não quer perder tempo com planilha manual.
          </h1>

          <p className="text-sm sm:text-base text-[#52525B] leading-relaxed max-w-2xl mx-auto">
            Lance receitas e despesas em poucos segundos, acompanhe seu saldo em tempo real e mantenha o histórico financeiro do seu negócio organizado em um só lugar.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/cadastro"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#09090B] text-white font-bold rounded-xl shadow-card hover:bg-[#27272A] active:scale-98 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <span>Criar conta gratuita</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3.5 bg-white text-[#09090B] font-semibold rounded-xl border border-[#E4E4E7] hover:bg-[#F4F4F5] transition-all flex items-center justify-center text-sm"
            >
              Já tenho cadastro
            </Link>
          </div>
        </div>

        {/* Comparativo: Planilha Manual vs Sistema */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-[#09090B] tracking-tight">
              A diferença prática no dia a dia
            </h2>
            <p className="text-xs sm:text-sm text-[#71717A]">
              Veja como o sistema evita os problemas mais comuns das planilhas manuais.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Bloco Planilha */}
            <div className="bg-white p-6 rounded-2xl border border-red-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 text-[#DC2626]">
                <FileSpreadsheet className="w-5 h-5" />
                <span className="font-bold text-sm uppercase tracking-wider">Planilha manual</span>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#52525B]">
                <li className="flex items-start gap-2">
                  <span className="text-[#DC2626] font-bold">✕</span>
                  <span>Fórmulas de soma quebram ao deletar linhas ou colar valores incorretos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#DC2626] font-bold">✕</span>
                  <span>Risco constante de perder arquivos locais ou esquecer de salvar alterações.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#DC2626] font-bold">✕</span>
                  <span>Falta de relatórios claros de quanto sobrou no mês vs. saldo acumulado.</span>
                </li>
              </ul>
            </div>

            {/* Bloco Sistema */}
            <div className="bg-white p-6 rounded-2xl border border-green-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 text-[#16A34A]">
                <TrendingUp className="w-5 h-5" />
                <span className="font-bold text-sm uppercase tracking-wider">Controle de Caixa Rosa Network</span>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#52525B]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>Cálculo automático em centavos, sem risco de erro por fórmula quebrada.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>Histórico gravado na sua conta com filtros por período e categorias.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>Extrato exportável para planilha Excel (CSV) com um clique quando quiser.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recursos funcionais reais */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E4E4E7] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#F4F4F5] text-[#09090B] flex items-center justify-center">
              <Tags className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#09090B]">Categorias personalizadas</h3>
            <p className="text-xs text-[#71717A] leading-relaxed">
              Crie categorias para suas vendas, custos fixos e compras de fornecedores para saber onde o dinheiro está concentrado.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E4E4E7] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#F4F4F5] text-[#09090B] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#09090B]">Seus dados protegidos</h3>
            <p className="text-xs text-[#71717A] leading-relaxed">
              Cada conta tem acesso exclusivo aos seus próprios lançamentos, com senhas criptografadas e sem compartilhamento com terceiros.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E4E4E7] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#F4F4F5] text-[#09090B] flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#09090B]">Exportação para Excel</h3>
            <p className="text-xs text-[#71717A] leading-relaxed">
              Baixe seus lançamentos em arquivo compatível com Excel para enviar ao contador ou guardar um arquivo físico.
            </p>
          </div>
        </div>

        {/* Apresentação da Mascote Rosinha */}
        <div className="bg-gradient-to-r from-rose-50 via-white to-pink-50/40 p-6 sm:p-8 rounded-3xl border border-rose-100 flex flex-col sm:flex-row items-center gap-6 shadow-xs">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-rose-200 bg-white shadow-xs shrink-0">
            <Image
              src="/mascote-rosa.png"
              alt="Rosinha - Mascote Oficial Rosa Network"
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold">
              <span>Mascote Oficial</span>
            </div>
            <h3 className="text-xl font-bold text-[#09090B] tracking-tight">
              Conheça a Rosinha, guardiã do seu caixa
            </h3>
            <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed">
              Criada para representar a união de tecnologia leve e finanças sem complicação. Com a Rosinha e a Rosa Network, seu controle financeiro se torna um hábito diário simples, ágil e prazeroso.
            </p>
          </div>
        </div>

        {/* Chamada para criacao de conta */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E4E4E7] text-center space-y-4 shadow-sm">
          <h2 className="text-2xl font-bold text-[#09090B] tracking-tight">
            Pronto para organizar seu caixa?
          </h2>
          <p className="text-xs sm:text-sm text-[#52525B] max-w-lg mx-auto">
            Cadastre-se com seu nome e e-mail para começar a usar agora mesmo. O sistema é gratuito.
          </p>
          <div className="pt-2 flex justify-center">
            <Link
              href="/cadastro"
              className="px-6 py-3 bg-[#09090B] text-white font-bold rounded-xl hover:bg-[#27272A] transition-all flex items-center gap-2 text-sm"
            >
              <span>Criar conta gratuita</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
