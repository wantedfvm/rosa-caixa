'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { MoneyInput } from '../ui/MoneyInput';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { getTodayISODate } from '@/lib/calculations';
import { createTransactionAction, updateTransactionAction } from '@/actions/transactionActions';
import { AlertCircle, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

export interface CategoryOption {
  id: string;
  name: string;
  type: string;
  color?: string | null;
}

export interface EditableTransactionData {
  id?: string;
  type: 'income' | 'expense';
  amountCents: number;
  description: string;
  transactionDate: string;
  categoryId?: string | null;
  notes?: string | null;
}

export interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryOption[];
  initialData?: EditableTransactionData | null;
  defaultType?: 'income' | 'expense';
  onSuccess?: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  categories,
  initialData,
  defaultType = 'income',
  onSuccess,
}) => {
  const [type, setType] = useState<'income' | 'expense'>(defaultType);
  const [amountCents, setAmountCents] = useState(0);
  const [description, setDescription] = useState('');
  const [transactionDate, setTransactionDate] = useState(getTodayISODate());
  const [categoryId, setCategoryId] = useState<string>('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isEditing = !!initialData?.id;

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setAmountCents(initialData.amountCents || 0);
      setDescription(initialData.description || '');
      setTransactionDate(initialData.transactionDate || getTodayISODate());
      setCategoryId(initialData.categoryId || '');
      setNotes(initialData.notes || '');
    } else {
      setType(defaultType);
      setAmountCents(0);
      setDescription('');
      setTransactionDate(getTodayISODate());
      setCategoryId('');
      setNotes('');
    }
    setErrorMessage(null);
  }, [initialData, defaultType, isOpen]);

  // Filtra categorias compatíveis com o tipo selecionado
  const filteredCategories = categories.filter(
    (c) => c.type === 'both' || c.type === type
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (amountCents <= 0) {
      setErrorMessage('Informe um valor maior que zero.');
      return;
    }

    if (!description.trim()) {
      setErrorMessage('Informe uma descrição para o lançamento.');
      return;
    }

    if (!transactionDate) {
      setErrorMessage('Informe a data do lançamento.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        type,
        amountCents,
        description: description.trim(),
        transactionDate,
        categoryId: categoryId || null,
        notes: notes.trim() || null,
        // Gera chave de idempotência aleatória única para cada tentativa de envio
        idempotencyKey: isEditing ? undefined : crypto.randomUUID(),
      };

      let res;
      if (isEditing && initialData?.id) {
        res = await updateTransactionAction(initialData.id, payload);
      } else {
        res = await createTransactionAction(payload);
      }

      if (!res.success) {
        setErrorMessage(res.error || 'Erro ao salvar movimentação.');
        setLoading(false);
        return;
      }

      setLoading(false);
      onClose();
      if (onSuccess) onSuccess();
    } catch {
      setErrorMessage('Erro de comunicação com o servidor.');
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Movimentação' : type === 'income' ? 'Nova Entrada' : 'Nova Saída'}
      description="Preencha os dados da movimentação financeira."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage ? (
          <div
            role="alert"
            className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-[#DC2626] flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        ) : null}

        {/* Seletor de Tipo (Entrada vs Saída) */}
        {!isEditing ? (
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#F4F4F5] rounded-xl border border-[#E4E4E7]">
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategoryId('');
              }}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer touch-target ${
                type === 'income'
                  ? 'bg-white text-[#16A34A] shadow-xs'
                  : 'text-[#71717A] hover:text-[#09090B]'
              }`}
            >
              <ArrowUpCircle className="w-4 h-4" />
              <span>Entrada (+)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setType('expense');
                setCategoryId('');
              }}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer touch-target ${
                type === 'expense'
                  ? 'bg-white text-[#DC2626] shadow-xs'
                  : 'text-[#71717A] hover:text-[#09090B]'
              }`}
            >
              <ArrowDownCircle className="w-4 h-4" />
              <span>Saída (-)</span>
            </button>
          </div>
        ) : null}

        {/* Campo Monetário Formatado */}
        <MoneyInput
          label="Valor"
          valueCents={amountCents}
          onChangeCents={setAmountCents}
          autoFocus={!isEditing}
          required
        />

        {/* Descrição */}
        <Input
          label="Descrição"
          placeholder="Ex: Recebimento cliente, Supermercado..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {/* Linha com Data e Categoria */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Data"
            type="date"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5 w-full">
            <label htmlFor="category-select" className="text-xs font-semibold text-[#52525B]">
              Categoria
            </label>
            <select
              id="category-select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] bg-white text-[#09090B] text-sm outline-none focus:ring-2 focus:ring-[#09090B] cursor-pointer"
            >
              <option value="">Sem Categoria</option>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Observações Opcionais */}
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="notes-textarea" className="text-xs font-semibold text-[#52525B]">
            Observações (opcional)
          </label>
          <textarea
            id="notes-textarea"
            rows={2}
            placeholder="Detalhes adicionais..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-[#E4E4E7] bg-white text-[#09090B] text-xs outline-none focus:ring-2 focus:ring-[#09090B]"
          />
        </div>

        {/* Ações */}
        <div className="flex items-center justify-end gap-2 pt-3">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant={type === 'income' ? 'income' : 'expense'}
            loading={loading}
          >
            {isEditing ? 'Salvar Alterações' : type === 'income' ? 'Registrar Entrada' : 'Registrar Saída'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
