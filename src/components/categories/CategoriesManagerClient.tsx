'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { createCategoryAction, deleteCategoryAction } from '@/actions/transactionActions';
import { PlusCircle, Tag, Trash2, AlertCircle } from 'lucide-react';

export interface CategoryItem {
  id: string;
  name: string;
  type: 'income' | 'expense' | 'both';
  color?: string | null;
  icon?: string | null;
  isDefault: boolean;
}

export interface CategoriesManagerClientProps {
  categories: CategoryItem[];
}

export const CategoriesManagerClient: React.FC<CategoriesManagerClientProps> = ({ categories }) => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense' | 'both'>('expense');
  const [color, setColor] = useState('#09090B');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultCategories = categories.filter((c) => c.isDefault);
  const userCategories = categories.filter((c) => !c.isDefault);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Informe o nome da categoria.');
      return;
    }

    setLoading(true);
    try {
      const res = await createCategoryAction({
        name: name.trim(),
        type,
        color,
        icon: 'Tag',
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Erro ao criar categoria.');
        setLoading(false);
        return;
      }

      setName('');
      setModalOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta categoria? As movimentações existentes continuarão salvas sem categoria vinculada.')) {
      return;
    }

    await deleteCategoryAction(id);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E4E4E7] shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#09090B] tracking-tight">
            Categorias de Caixa
          </h1>
          <p className="text-xs text-[#71717A] mt-0.5">
            Organize suas entradas e saídas por finalidade financeira.
          </p>
        </div>

        <Button variant="primary" onClick={() => setModalOpen(true)} icon={<PlusCircle className="w-4 h-4" />}>
          Nova Categoria
        </Button>
      </div>

      {/* Categorias Pessoais do Usuário */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E4E4E7] shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-[#09090B]">Suas Categorias Personalizadas</h2>
          <p className="text-xs text-[#71717A]">Categorias criadas exclusivamente para sua conta.</p>
        </div>

        {userCategories.length === 0 ? (
          <p className="text-xs text-[#71717A] py-3 italic">
            Você ainda não criou categorias personalizadas. O sistema utiliza as categorias padrão abaixo.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {userCategories.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-xl border border-[#E4E4E7] flex items-center justify-between bg-[#FAFAFA]"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: c.color || '#09090B' }}
                  />
                  <div>
                    <p className="text-xs font-semibold text-[#09090B]">{c.name}</p>
                    <span className="text-[10px] text-[#71717A] capitalize">
                      {c.type === 'income' ? 'Apenas Entradas' : c.type === 'expense' ? 'Apenas Saídas' : 'Entradas e Saídas'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(c.id)}
                  title="Excluir categoria"
                  className="p-1.5 rounded-lg text-[#71717A] hover:text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Categorias Padrão Globais */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E4E4E7] shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-[#09090B]">Categorias Padrão do Sistema</h2>
          <p className="text-xs text-[#71717A]">
            Categorias prontas para uso rápido em qualquer lançamento financeiro.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {defaultCategories.map((c) => (
            <div
              key={c.id}
              className="p-3 rounded-xl border border-[#E4E4E7] bg-white flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-[#71717A]" />
                <span className="text-xs font-medium text-[#09090B]">{c.name}</span>
              </div>
              <Badge variant={c.type === 'income' ? 'income' : 'expense'}>
                {c.type === 'income' ? 'Entrada' : 'Saída'}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Criação de Categoria */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nova Categoria"
        description="Crie uma categoria personalizada para classificar suas movimentações."
        maxWidth="sm"
      >
        <form onSubmit={handleCreate} className="space-y-4 pt-2">
          {errorMessage ? (
            <div
              role="alert"
              className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-[#DC2626] flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          ) : null}

          <Input
            label="Nome da Categoria"
            placeholder="Ex: Consultorias, Ferramentas SaaS..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />

          <div className="flex flex-col gap-1.5 w-full">
            <label htmlFor="cat-type-select" className="text-xs font-semibold text-[#52525B]">
              Tipo de Movimentação Aplicável
            </label>
            <select
              id="cat-type-select"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] bg-white text-xs text-[#09090B] outline-none focus:ring-2 focus:ring-[#09090B] cursor-pointer"
            >
              <option value="expense">Apenas Saídas (Despesas)</option>
              <option value="income">Apenas Entradas (Receitas)</option>
              <option value="both">Ambos os Tipos</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3">
            <Button variant="ghost" onClick={() => setModalOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              Salvar Categoria
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
