'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { MoneyInput } from '../ui/MoneyInput';
import { Modal } from '../ui/Modal';
import { updateUserSettingsAction } from '@/actions/transactionActions';
import { authClient } from '@/lib/auth-client';
import {
  Shield,
  Save,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Download,
  Share,
  HelpCircle,
  Monitor,
  Check
} from 'lucide-react';
import Image from 'next/image';

export interface SettingsManagerClientProps {
  initialSettings: {
    initialBalanceCents: number;
    initialBalanceDate: string;
    fullName?: string | null;
  };
  userEmail: string;
}

export const SettingsManagerClient: React.FC<SettingsManagerClientProps> = ({
  initialSettings,
  userEmail,
}) => {
  const router = useRouter();

  const [initialBalanceCents, setInitialBalanceCents] = useState(initialSettings.initialBalanceCents);
  const [initialBalanceDate, setInitialBalanceDate] = useState(initialSettings.initialBalanceDate);
  const [fullName, setFullName] = useState(initialSettings.fullName || '');

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Estado PWA (Instalação / Adicionar à Tela Inicial)
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const [installTab, setInstallTab] = useState<'android' | 'ios' | 'pc'>('android');
  const [isStandalone, setIsStandalone] = useState(false);
  const [canPromptNative, setCanPromptNative] = useState(false);

  useEffect(() => {
    // Detectar se já está rodando como app standalone
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Detectar se prompt nativo está disponível
    if (typeof window !== 'undefined' && window.deferredPWAInstallPrompt) {
      setCanPromptNative(true);
    }

    const onPromptReady = () => setCanPromptNative(true);
    window.addEventListener('pwa-install-ready', onPromptReady);

    // Detectar sistema operacional padrão do usuário
    const ua = navigator.userAgent || '';
    if (/iPad|iPhone|iPod/.test(ua)) {
      setInstallTab('ios');
    } else if (/Android/.test(ua)) {
      setInstallTab('android');
    } else {
      setInstallTab('pc');
    }

    return () => {
      window.removeEventListener('pwa-install-ready', onPromptReady);
    };
  }, []);

  const handleInstallClick = async () => {
    if (window.deferredPWAInstallPrompt) {
      try {
        window.deferredPWAInstallPrompt.prompt();
        const choice = await window.deferredPWAInstallPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsStandalone(true);
          window.deferredPWAInstallPrompt = undefined;
          setCanPromptNative(false);
        }
      } catch (err) {
        console.error('Erro ao chamar prompt nativo:', err);
        setInstallModalOpen(true);
      }
    } else {
      setInstallModalOpen(true);
    }
  };

  // Modal de exclusão definitiva (LGPD)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setLoading(true);

    try {
      const res = await updateUserSettingsAction({
        initialBalanceCents,
        initialBalanceDate,
        fullName: fullName.trim() || undefined,
      });

      if (!res.success) {
        setFeedback({ type: 'error', message: res.error || 'Erro ao salvar alterações.' });
        setLoading(false);
        return;
      }

      setFeedback({ type: 'success', message: 'Configurações e saldo inicial atualizados com sucesso.' });
      router.refresh();
    } catch {
      setFeedback({ type: 'error', message: 'Falha de comunicação com o servidor.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmationInput !== 'EXCLUIR') {
      setDeleteError('Digite EXCLUIR para confirmar a ação.');
      return;
    }

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      // Dispara exclusão via API ou server action e encerra sessão
      const response = await fetch('/api/user/delete-account', {
        method: 'POST',
      });

      if (!response.ok) {
        setDeleteError('Erro ao excluir conta. Tente novamente mais tarde.');
        setDeleteLoading(false);
        return;
      }

      await authClient.signOut();
      router.push('/');
      router.refresh();
    } catch {
      setDeleteError('Falha de conexão.');
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Topo */}
      <div className="bg-white p-5 rounded-2xl border border-[#E4E4E7] shadow-xs">
        <h1 className="text-xl sm:text-2xl font-bold text-[#09090B] tracking-tight">
          Configurações da Conta
        </h1>
        <p className="text-xs text-[#71717A] mt-0.5">
          Defina o saldo inicial do seu caixa e gerencie seus dados pessoais.
        </p>
      </div>

      {feedback ? (
        <div
          role="alert"
          className={`p-4 rounded-2xl border text-xs flex items-start gap-2.5 ${
            feedback.type === 'success'
              ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#16A34A]'
              : 'bg-red-50 border-red-200 text-[#DC2626]'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          <span className="font-medium">{feedback.message}</span>
        </div>
      ) : null}

      {/* Bloco PWA: Salvar na Tela Inicial / Instalar Aplicativo */}
      <div className="bg-gradient-to-r from-rose-50 via-white to-pink-50/50 p-5 sm:p-6 rounded-2xl border border-rose-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-rose-200 bg-white shrink-0 shadow-xs p-1">
              <Image
                src="/icon-192.png"
                alt="Rosa Caixa Ícone"
                width={48}
                height={48}
                className="object-contain rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-[#09090B]">
                  Salvar na Tela do Celular (Aplicativo)
                </h2>
                {isStandalone && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Instalado
                  </span>
                )}
              </div>
              <p className="text-xs text-[#52525B] mt-0.5">
                {isStandalone
                  ? 'Você já está usando o Rosa Caixa em modo aplicativo nativo!'
                  : 'Acesse em 1 clique direto da sua tela inicial como um app nativo, sem barras do navegador.'}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <Button
              type="button"
              variant={isStandalone ? 'secondary' : 'primary'}
              onClick={handleInstallClick}
              icon={<Smartphone className="w-4 h-4" />}
            >
              {isStandalone
                ? 'Como Reinstalar'
                : canPromptNative
                ? 'Instalar Aplicativo Agora'
                : 'Adicionar à Tela Inicial'}
            </Button>
          </div>
        </div>
      </div>

      {/* Formulário Principal */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Bloco 1: Dados do Titular */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E4E4E7] shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#09090B]">Dados Cadastrais</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nome do Titular ou Razão Social"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ex: Lucas da Rosa"
            />

            <Input
              label="E-mail da Conta (Não editável)"
              value={userEmail}
              disabled
              className="bg-[#F4F4F5] cursor-not-allowed opacity-80"
            />
          </div>
        </div>

        {/* Bloco 2: Regra do Saldo Inicial */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E4E4E7] shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[#09090B]">Saldo Inicial e Data de Início</h2>
            <p className="text-xs text-[#71717A] mt-0.5 leading-relaxed">
              Se você já tinha dinheiro em caixa antes de usar o sistema, informe o valor de partida e a data em que começou a registrar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MoneyInput
              label="Valor do Saldo Inicial"
              valueCents={initialBalanceCents}
              onChangeCents={setInitialBalanceCents}
              hint="Valor em mãos na data informada."
            />

            <Input
              label="Data de Início da Vigência"
              type="date"
              value={initialBalanceDate}
              onChange={(e) => setInitialBalanceDate(e.target.value)}
              hint="Lançamentos anteriores não somam no saldo atual."
              required
            />
          </div>

          <div className="p-3.5 bg-[#F4F4F5] rounded-xl text-xs text-[#52525B] leading-relaxed">
            <strong>Como funciona a regra:</strong> Movimentações com data anterior à data de vigência continuam visíveis no extrato histórico, mas não alteram o saldo atual ativo em caixa. Isso impede que valores antigos somem duas vezes.
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" loading={loading} icon={<Save className="w-4 h-4" />}>
            Salvar Alterações
          </Button>
        </div>
      </form>

      {/* Bloco 3: Área de Privacidade e LGPD (Exclusão Definitiva) */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-red-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-[#DC2626]">
          <Shield className="w-4 h-4" />
          <h2 className="text-sm font-bold">Privacidade e Eliminação de Dados (LGPD)</h2>
        </div>
        <p className="text-xs text-[#52525B] leading-relaxed">
          Conforme assegurado pelo Artigo 18 da Lei Geral de Proteção de Dados (Lei 13.709/2018), você pode excluir definitivamente sua conta e todos os lançamentos financeiros a qualquer momento.
        </p>
        <div className="pt-1">
          <Button
            variant="danger"
            onClick={() => {
              setDeleteConfirmationInput('');
              setDeleteError(null);
              setDeleteModalOpen(true);
            }}
            icon={<Trash2 className="w-4 h-4" />}
          >
            Excluir Minha Conta e Todos os Dados
          </Button>
        </div>
      </div>

      {/* Modal de Exclusão Definitiva */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Excluir conta definitivamente?"
        description="Esta ação é permanente e irreversível."
        maxWidth="sm"
      >
        <div className="space-y-4 pt-2">
          {deleteError ? (
            <div className="p-3 bg-red-50 rounded-xl text-xs text-[#DC2626]">
              {deleteError}
            </div>
          ) : null}

          <div className="p-3.5 bg-red-50 rounded-xl text-xs text-[#DC2626] space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>Aviso Importante</span>
            </div>
            <p className="leading-relaxed">
              Ao confirmar, seu cadastro, configurações e todo o histórico de entradas e saídas serão apagados imediatamente do banco de dados.
            </p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirm-del" className="text-xs font-semibold text-[#52525B]">
              Digite <span className="font-bold text-[#DC2626]">EXCLUIR</span> para confirmar:
            </label>
            <input
              id="confirm-del"
              type="text"
              value={deleteConfirmationInput}
              onChange={(e) => setDeleteConfirmationInput(e.target.value)}
              placeholder="EXCLUIR"
              className="w-full px-3.5 py-2.5 rounded-xl border border-red-300 bg-white text-xs text-[#09090B] outline-none focus:ring-2 focus:ring-[#DC2626]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setDeleteModalOpen(false)} disabled={deleteLoading}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              loading={deleteLoading}
              disabled={deleteConfirmationInput !== 'EXCLUIR'}
            >
              Apagar Tudo Definitivamente
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de Instruções de Instalação (PWA) */}
      <Modal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
        title="Como Salvar o Rosa Caixa na Tela Inicial"
        description="Acesse suas finanças instantaneamente como um app de celular."
        maxWidth="md"
      >
        <div className="space-y-4 pt-2">
          {/* Seletor de Sistema */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F4F4F5] rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setInstallTab('android')}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                installTab === 'android' ? 'bg-white text-[#09090B] shadow-2xs' : 'text-[#71717A]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Android</span>
            </button>
            <button
              type="button"
              onClick={() => setInstallTab('ios')}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                installTab === 'ios' ? 'bg-white text-[#09090B] shadow-2xs' : 'text-[#71717A]'
              }`}
            >
              <Share className="w-3.5 h-3.5 text-blue-600" />
              <span>iPhone (iOS)</span>
            </button>
            <button
              type="button"
              onClick={() => setInstallTab('pc')}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                installTab === 'pc' ? 'bg-white text-[#09090B] shadow-2xs' : 'text-[#71717A]'
              }`}
            >
              <Monitor className="w-3.5 h-3.5 text-purple-600" />
              <span>Computador</span>
            </button>
          </div>

          {/* Conteúdo Android */}
          {installTab === 'android' && (
            <div className="space-y-3 text-xs text-[#52525B] leading-relaxed">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-semibold">
                No Google Chrome para Android:
              </div>
              <ol className="space-y-2 list-decimal list-inside pl-1 text-[11px]">
                <li>
                  Toque no menu de <strong>3 pontinhos (⋮)</strong> no canto superior direito do Chrome.
                </li>
                <li>
                  Procure e toque na opção <strong>&quot;Instalar aplicativo&quot;</strong> ou <strong>&quot;Adicionar à tela inicial&quot;</strong>.
                </li>
                <li>
                  Confirme tocando em <strong>&quot;Instalar&quot;</strong>.
                </li>
                <li>
                  Pronto! O ícone oficial do <strong>Rosa Caixa</strong> será criado junto com seus aplicativos no celular.
                </li>
              </ol>
            </div>
          )}

          {/* Conteúdo iOS (iPhone/Safari) */}
          {installTab === 'ios' && (
            <div className="space-y-3 text-xs text-[#52525B] leading-relaxed">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 font-semibold">
                No Safari do iPhone / iPad:
              </div>
              <ol className="space-y-2 list-decimal list-inside pl-1 text-[11px]">
                <li>
                  Abra este site no navegador <strong>Safari</strong> (navegador padrão da Apple).
                </li>
                <li>
                  Toque no botão de <strong>Compartilhar</strong> (ícone de um quadrado com seta para cima <strong>⎋</strong> na barra inferior).
                </li>
                <li>
                  Role as opções para baixo e selecione <strong>&quot;Adicionar à Tela de Início&quot; (➕)</strong>.
                </li>
                <li>
                  Toque em <strong>&quot;Adicionar&quot;</strong> no canto superior direito.
                </li>
                <li>
                  O Rosa Caixa funcionará em tela cheia como se tivesse sido baixado da App Store!
                </li>
              </ol>
            </div>
          )}

          {/* Conteúdo PC */}
          {installTab === 'pc' && (
            <div className="space-y-3 text-xs text-[#52525B] leading-relaxed">
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-purple-900 font-semibold">
                No Chrome, Edge ou Brave no Computador:
              </div>
              <ol className="space-y-2 list-decimal list-inside pl-1 text-[11px]">
                <li>
                  Olhe na barra de endereço do navegador (ao lado da estrelinha de favoritos).
                </li>
                <li>
                  Clique no ícone de <strong>Instalar</strong> (ícone de computadorzinho com uma setinha).
                </li>
                <li>
                  Confirme em <strong>&quot;Instalar&quot;</strong> para abrir o Rosa Caixa em janela exclusiva e rápida.
                </li>
              </ol>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button variant="primary" onClick={() => setInstallModalOpen(false)}>
              Entendi
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
