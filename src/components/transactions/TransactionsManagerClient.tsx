'use client';

import React, { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { TransactionModal, CategoryOption, EditableTransactionData } from './TransactionModal';
import { formatCurrency, formatDateBR } from '@/lib/calculations';
import { generateTransactionsCSV } from '@/lib/export';
import { deleteTransactionAction } from '@/actions/transactionActions';
import {
  Download,
  PlusCircle,
  Search,
  Filter,
  Edit2,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';

export interface TransactionRecord {
  id: string;
  type: 'income' | 'expense';
  amountCents: number;
  description: string;
  transactionDate: string;
  categoryId?: string | null;
  categoryName?: string | null;
  categoryColor?: string | null;
  notes?: string | null;
}

export interface TransactionsManagerClientProps {
  initialTransactions: TransactionRecord[];
  categories: CategoryOption[];
}

export const TransactionsManagerClient: React.FC<TransactionsManagerClientProps> = ({
  initialTransactions,
  categories,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Filtros locais sincronizados
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>(
    (searchParams.get('type') as any) || 'all'
  );
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'all');

  // Modais de criação, edição e exclusão
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EditableTransactionData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Filtragem no cliente para resposta instantânea
  const filtered = initialTransactions.filter((item) => {
    if (typeFilter !== 'all' && item.type !== typeFilter) return false;
    if (categoryFilter !== 'all' && item.categoryId !== categoryFilter) return false;
    if (search.trim()) {
      const matchDesc = item.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = (item.categoryName || '').toLowerCase().includes(search.toLowerCase());
      if (!matchDesc && !matchCat) return false;
    }
    return true;
  });

  // Exportação direta em CSV para Microsoft Excel
  const handleExportCSV = () => {
    const csvContent = generateTransactionsCSV(filtered);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `controle_de_caixa_rosanetwork_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: TransactionRecord) => {
    setEditingItem({
      id: t.id,
      type: t.type,
      amountCents: t.amountCents,
      description: t.description,
      transactionDate: t.transactionDate,
      categoryId: t.categoryId,
      notes: t.notes,
    });
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    setDeleteLoading(true);

    try {
      await deleteTransactionAction(deleteConfirmId);
      setDeleteConfirmId(null);
      router.refresh();
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Topo com Título e Ações Principais */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E4E4E7] shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#09090B] tracking-tight">
            Extrato de Movimentações
          </h1>
          <p className="text-xs text-[#71717A] mt-0.5">
            Consulte, filtre, edite ou exporte seus lançamentos financeiros.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            onClick={handleExportCSV}
            disabled={filtered.length === 0}
            icon={<Download className="w-4 h-4" />}
          >
            Exportar CSV (Excel)
          </Button>
          <Button
            variant="primary"
            onClick={handleOpenCreate}
            icon={<PlusCircle className="w-4 h-4" />}
          >
            Novo Lançamento
          </Button>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white p-4 rounded-2xl border border-[#E4E4E7] shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Busca textual */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#71717A] absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E4E4E7] bg-white text-xs outline-none focus:ring-2 focus:ring-[#09090B]"
            />
          </div>

          {/* Filtro por Tipo */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] bg-white text-xs text-[#09090B] outline-none focus:ring-2 focus:ring-[#09090B] cursor-pointer"
          >
            <option value="all">Todos os tipos (Entradas e Saídas)</option>
            <option value="income">Apenas Entradas (+)</option>
            <option value="expense">Apenas Saídas (-)</option>
          </select>

          {/* Filtro por Categoria */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] bg-white text-xs text-[#09090B] outline-none focus:ring-2 focus:ring-[#09090B] cursor-pointer"
          >
            <option value="all">Todas as Categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Registros */}
      <div className="bg-white rounded-2xl border border-[#E4E4E7] shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="Nenhum lançamento encontrado"
              description="Ajuste os filtros ou crie uma nova movimentação para visualizar aqui."
              action={
                <Button size="sm" onClick={handleOpenCreate}>
                  Criar Lançamento
                </Button>
              }
            />
          </div>
        ) : (
          <>
            {/* Visualização em Tabela para Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F4F4F5] text-[#71717A] uppercase text-[10px] tracking-wider border-b border-[#E4E4E7]">
                  <tr>
                    <th className="py-3 px-4 font-bold">Data</th>
                    <th className="py-3 px-4 font-bold">Tipo</th>
                    <th className="py-3 px-4 font-bold">Descrição</th>
                    <th className="py-3 px-4 font-bold">Categoria</th>
                    <th className="py-3 px-4 font-bold text-right">Valor</th>
                    <th className="py-3 px-4 font-bold text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E4E7]">
                  {filtered.map((t) => {
                    const isIncome = t.type === 'income';
                    return (
                      <tr key={t.id} className="hover:bg-[#FAFAFA] transition-colors">
                        <td className="py-3.5 px-4 font-medium text-[#52525B]">
                          {formatDateBR(t.transactionDate)}
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant={isIncome ? 'income' : 'expense'}>
                            {isIncome ? 'Entrada' : 'Saída'}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#09090B]">
                          <div>{t.description}</div>
                          {t.notes ? (
                            <div className="text-[11px] text-[#71717A] font-normal truncate max-w-xs">{t.notes}</div>
                          ) : null}
                        </td>
                        <td className="py-3.5 px-4 text-[#52525B]">
                          {t.categoryName || 'Sem Categoria'}
                        </td>
                        <td className={`py-3.5 px-4 text-right font-bold text-sm ${isIncome ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                          {isIncome ? '+' : '-'}{formatCurrency(t.amountCents)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(t)}
                              title="Editar"
                              className="p-1.5 rounded-lg text-[#71717A] hover:text-[#09090B] hover:bg-[#F4F4F5] transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(t.id)}
                              title="Excluir"
                              className="p-1.5 rounded-lg text-[#71717A] hover:text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Visualização em Cartões para Dispositivos Móveis */}
            <div className="md:hidden divide-y divide-[#E4E4E7]">
              {filtered.map((t) => {
                const isIncome = t.type === 'income';
                return (
                  <div key={t.id} className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isIncome ? 'bg-[#F0FDF4] text-[#16A34A]' : 'bg-[#FEF2F2] text-[#DC2626]'
                          }`}
                        >
                          {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#09090B]">{t.description}</p>
                          <p className="text-[11px] text-[#71717A]">{formatDateBR(t.transactionDate)}</p>
                        </div>
                      </div>
                      <p className={`text-sm font-bold ${isIncome ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                        {isIncome ? '+' : '-'}{formatCurrency(t.amountCents)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-dashed border-[#E4E4E7] text-xs">
                      <span className="text-[11px] text-[#71717A]">{t.categoryName || 'Sem Categoria'}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(t)}
                          className="text-xs font-semibold text-[#09090B] px-2 py-1 rounded bg-[#F4F4F5]"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(t.id)}
                          className="text-xs font-semibold text-[#DC2626] px-2 py-1 rounded bg-red-50"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Modal de Criação / Edição */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        initialData={editingItem}
        onSuccess={() => router.refresh()}
      />

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirmar exclusão"
        description="Esta movimentação será apagada definitivamente do seu histórico de caixa."
        maxWidth="sm"
      >
        <div className="space-y-4 pt-2">
          <div className="p-3 bg-red-50 rounded-xl text-xs text-[#DC2626] flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>O saldo atual e os relatórios serão recalculados automaticamente.</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setDeleteConfirmId(null)} disabled={deleteLoading}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete} loading={deleteLoading}>
              Excluir Movimentação
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
