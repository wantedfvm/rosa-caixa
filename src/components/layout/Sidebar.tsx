'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ArrowLeftRight, Tag, Settings, LogOut, MessageCircle, Calculator } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const navItems = [
    { href: '/dashboard', label: 'Painel Geral', icon: LayoutDashboard },
    { href: '/movimentacoes', label: 'Movimentações', icon: ArrowLeftRight },
    { href: '/precificacao', label: 'Precificação', icon: Calculator },
    { href: '/categorias', label: 'Categorias', icon: Tag },
    { href: '/configuracoes', label: 'Configurações', icon: Settings },
  ];

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-[#E4E4E7] bg-white h-screen sticky top-0 justify-between shrink-0 select-none">
      <div className="p-5 space-y-6">
        {/* Marca Rosa Network */}
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 shrink-0">
            <Image
              src="/logo-rosa.png"
              alt="Rosa Network Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div>
            <span className="text-sm font-bold text-[#09090B] tracking-tight block">
              ROSA NETWORK
            </span>
            <span className="text-[11px] text-[#71717A]">
              Controle de Caixa
            </span>
          </div>
        </div>

        {/* Links de Navegação */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all touch-target ${
                  isActive
                    ? 'bg-[#09090B] text-white shadow-xs'
                    : 'text-[#52525B] hover:text-[#09090B] hover:bg-[#F4F4F5]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#71717A]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mascote Rosinha da Rosa Network */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-50 via-white to-pink-50/40 border border-rose-100 shadow-2xs relative overflow-hidden group">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 shrink-0 rounded-xl overflow-hidden border border-rose-200 bg-white shadow-xs group-hover:scale-105 transition-transform">
              <Image
                src="/mascote-rosa.png"
                alt="Rosinha - Mascote Rosa Network"
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#09090B] tracking-tight">
                  Rosinha
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700">
                  Mascote
                </span>
              </div>
              <p className="text-[10px] text-[#71717A] leading-tight mt-0.5">
                Rosa Network ao lado do seu fluxo de caixa!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rodape da barra lateral */}
      <div className="p-4 border-t border-[#E4E4E7] space-y-3">
        {/* Créditos Oficiais Rosa Network */}
        <div className="p-3.5 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider">
              Desenvolvido por
            </span>
            <span className="text-[9px] font-extrabold text-[#16A34A] bg-[#F0FDF4] px-1.5 py-0.5 rounded border border-[#DCFCE7]">
              100% Grátis
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-[#09090B]">
              Lucas da Rosa
            </p>
            <p className="text-[10px] text-[#71717A] leading-tight mt-0.5">
              Fundador da <strong className="text-[#09090B]">Rosa Network</strong>
            </p>
          </div>
          <div className="flex items-center justify-between pt-1.5 text-[11px] border-t border-[#E4E4E7]">
            <a
              href="https://rosanetwork.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#52525B] hover:text-[#09090B] hover:underline font-semibold text-[10px]"
            >
              rosanetwork.cloud ↗
            </a>
            <a
              href="https://wa.me/5551989509959"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#16A34A] hover:text-[#15803D] font-bold flex items-center gap-1 text-[10px]"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 text-[11px] text-[#71717A]">
          <span className="truncate max-w-[140px] font-medium text-[#09090B]">
            {session?.user?.name || 'Minha Conta'}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            title="Sair da conta"
            className="flex items-center gap-1 text-[#DC2626] hover:text-[#B91C1C] font-semibold cursor-pointer p-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
