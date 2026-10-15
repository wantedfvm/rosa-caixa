'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function CadastroPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    // Garante que sessoes anteriores residuais sejam limpas ao abrir a tela de cadastro
    authClient.signOut().catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name || !email || !password) {
      setErrorMessage('Preencha todos os campos para se cadastrar.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Sua senha deve ter no mínimo 8 caracteres.');
      return;
    }

    if (!acceptTerms) {
      setErrorMessage('Você precisa aceitar os Termos de Uso e a Política de Privacidade (LGPD).');
      return;
    }

    setLoading(true);
    try {
      const res = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (res.error) {
        setErrorMessage(res.error.message || 'Não foi possível criar a conta. Este e-mail pode já estar em uso.');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setErrorMessage('Falha ao conectar com o servidor. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#71717A] hover:text-[#09090B] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar ao início</span>
        </Link>

        <div className="flex items-center gap-3">
          <Image
            src="/logo-rosa.png"
            alt="Rosa Network Logo"
            width={36}
            height={36}
            className="object-contain"
          />
          <div>
            <span className="text-sm font-bold text-[#09090B] tracking-tight block">
              ROSA NETWORK
            </span>
            <span className="text-xs text-[#71717A]">
              Controle de Caixa
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-[#09090B] tracking-tight">
            Criar conta gratuita
          </h1>
          <p className="text-xs text-[#71717A] mt-1">
            Preencha seus dados para começar a controlar seu fluxo de caixa.
          </p>
        </div>

        {/* Card do Mascote Rosinha */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-rose-50 via-white to-pink-50/40 border border-rose-100/80 shadow-2xs">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-rose-200 bg-white shrink-0 shadow-xs">
            <Image
              src="/mascote-rosa.png"
              alt="Rosinha - Mascote Rosa Network"
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#09090B]">Venha com a Rosinha!</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700">Mascote</span>
            </div>
            <p className="text-[11px] text-[#71717A] truncate">
              Livre-se de planilhas manuais e bagunça no caixa.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-5 sm:px-8 rounded-2xl border border-[#E4E4E7] shadow-xs space-y-5">
          {errorMessage ? (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-[#DC2626] flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Seu Nome ou Nome do Negócio"
              type="text"
              placeholder="Ex: Lucas da Rosa"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              autoComplete="name"
            />

            <Input
              label="E-mail"
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Input
              label="Senha (mínimo de 8 caracteres)"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />

            <div className="pt-1 flex items-start gap-2.5">
              <input
                id="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-[#D4D4D8] text-[#09090B] focus:ring-[#09090B] cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-[#52525B] leading-relaxed cursor-pointer select-none">
                Li e concordo com os{' '}
                <Link href="/termos" target="_blank" className="font-semibold text-[#09090B] underline">
                  Termos de Uso
                </Link>{' '}
                e a{' '}
                <Link href="/privacidade" target="_blank" className="font-semibold text-[#09090B] underline">
                  Política de Privacidade (LGPD)
                </Link>.
              </label>
            </div>

            <div className="pt-2">
              <Button type="submit" loading={loading} className="w-full">
                Criar Minha Conta
              </Button>
            </div>
          </form>

          <div className="pt-4 border-t border-[#E4E4E7] text-center text-xs text-[#71717A]">
            Já tem uma conta cadastrada?{' '}
            <Link href="/login" className="font-semibold text-[#09090B] hover:underline">
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
