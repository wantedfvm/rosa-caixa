'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ArrowLeftRight, Tag, Settings, LogOut, MessageCircle } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const navItems = [
    { href: '/dashboard', label: 'Painel Geral', icon: LayoutDashboard },
    { href: '/movimentacoes', label: 'Movimentações', icon: ArrowLeftRight },
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
      </div>

      {/* Rodape da barra lateral */}
      <div className="p-4 border-t border-[#E4E4E7] space-y-3">
        <a
          href="https://wa.me/5551989509959"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-2.5 rounded-xl bg-[#F4F4F5] hover:bg-[#E4E4E7] text-xs text-[#09090B] transition-colors"
        >
          <div className="flex items-center gap-2">
            <MessageCircle className="w-3.5 h-3.5 text-[#16A34A]" />
            <span className="font-medium">Falar com Desenvolvedor</span>
          </div>
        </a>

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
