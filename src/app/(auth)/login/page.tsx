'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Preencha seu e-mail e senha para entrar.');
      return;
    }

    setLoading(true);
    try {
      const res = await authClient.signIn.email({
        email,
        password,
      });

      if (res.error) {
        if (res.error.status === 429) {
          setErrorMessage('Muitas tentativas incorretas. Aguarde alguns minutos antes de tentar novamente.');
        } else {
          setErrorMessage(res.error.message || 'E-mail ou senha incorretos. Confira seus dados.');
        }
        setLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setErrorMessage('Falha ao conectar com o servidor. Verifique sua conexão.');
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
            Acessar sua conta
          </h1>
          <p className="text-xs text-[#71717A] mt-1">
            Digite seu e-mail e senha para ver seu fluxo financeiro.
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
              <span className="text-xs font-bold text-[#09090B]">Rosinha dá as boas-vindas!</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700">Mascote</span>
            </div>
            <p className="text-[11px] text-[#71717A] truncate">
              Pronto para manter seu caixa 100% sob controle?
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
              label="E-mail"
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="email"
            />

            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <div className="pt-2">
              <Button type="submit" loading={loading} className="w-full">
                Entrar no Caixa
              </Button>
            </div>
          </form>

          <div className="pt-4 border-t border-[#E4E4E7] text-center text-xs text-[#71717A]">
            Ainda não tem conta?{' '}
            <Link href="/cadastro" className="font-semibold text-[#09090B] hover:underline">
              Criar conta gratuita
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
