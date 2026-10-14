'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { MoneyInput } from '../ui/MoneyInput';
import { Modal } from '../ui/Modal';
import { updateUserSettingsAction } from '@/actions/transactionActions';
import { authClient } from '@/lib/auth-client';
import { Shield, Save, Trash2, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';

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
    </div>
  );
};
