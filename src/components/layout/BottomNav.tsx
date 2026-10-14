'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ArrowLeftRight, Tag, Settings, Plus } from 'lucide-react';

export interface BottomNavProps {
  onOpenNewTransaction?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenNewTransaction }) => {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Painel', icon: LayoutDashboard },
    { href: '/movimentacoes', label: 'Extrato', icon: ArrowLeftRight },
    { href: '/categorias', label: 'Categorias', icon: Tag },
    { href: '/configuracoes', label: 'Ajustes', icon: Settings },
  ];

  return (
    <nav
      aria-label="Navegação móvel"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E4E4E7] pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="flex items-center justify-around h-16 px-2 relative">
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full touch-target transition-colors ${
                isActive ? 'text-[#09090B] font-bold' : 'text-[#71717A]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-1">{item.label}</span>
            </Link>
          );
        })}

        {/* Botão Central de Nova Movimentação */}
        <div className="flex flex-col items-center justify-center px-2">
          <button
            type="button"
            onClick={onOpenNewTransaction}
            aria-label="Registrar nova movimentação"
            className="w-12 h-12 rounded-full bg-[#09090B] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform touch-target cursor-pointer"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {navItems.slice(2, 4).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full touch-target transition-colors ${
                isActive ? 'text-[#09090B] font-bold' : 'text-[#71717A]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
