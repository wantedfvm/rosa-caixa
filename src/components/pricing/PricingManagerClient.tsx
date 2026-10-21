'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { MoneyInput } from '../ui/MoneyInput';
import { Modal } from '../ui/Modal';
import { savePricingItemAction, deletePricingItemAction } from '@/actions/pricingActions';
import {
  Calculator,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Package,
  Sparkles,
  TrendingUp,
  Percent,
  Copy,
  Check,
  ShoppingBag,
  Briefcase,
  Layers,
  ArrowRight
} from 'lucide-react';
import Image from 'next/image';

interface MaterialItem {
  id: string;
  name: string;
  costCents: number;
}

export interface SavedPricingItem {
  id: string;
  name: string;
  type: 'product' | 'service';
  directCostCents: number;
  fixedCostPercent: number;
  variableCostPercent: number;
  profitMarginPercent: number;
  suggestedPriceCents: number;
  materialsDetails: string | null;
  notes: string | null;
  createdAt: Date | string | number;
}

interface PricingManagerClientProps {
  initialItems: SavedPricingItem[];
}

export const PricingManagerClient: React.FC<PricingManagerClientProps> = ({ initialItems }) => {
  const router = useRouter();

  // Estados principais da calculadora
  const [activeTab, setActiveTab] = useState<'calculator' | 'catalog'>('calculator');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [itemType, setItemType] = useState<'product' | 'service'>('product');
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');

  // Materiais diretos/indiretos
  const [materials, setMaterials] = useState<MaterialItem[]>([
    { id: '1', name: 'Insumo principal / Matéria-prima', costCents: 1000 },
    { id: '2', name: 'Embalagem / Material descartável', costCents: 250 },
  ]);

  // Se não quiser usar lista de insumos detalhada, custo direto manual
  const [manualDirectCostCents, setManualDirectCostCents] = useState<number | null>(null);

  // Porcentagens
  const [fixedCostPercent, setFixedCostPercent] = useState<number>(10);
  const [variableCostPercent, setVariableCostPercent] = useState<number>(6); // Ex: 3.5% maquininha + 2.5% taxas
  const [profitMarginPercent, setProfitMarginPercent] = useState<number>(30); // 30% lucro desejado

  // Simulador de preço personalizado
  const [customPriceCents, setCustomPriceCents] = useState<number | null>(null);

  // Estados de feedback e loading
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal explicativo didático da aula
  const [explainModalOpen, setExplainModalOpen] = useState(false);

  // Calcular Custo Direto Total
  const totalDirectCostCents = manualDirectCostCents !== null
    ? manualDirectCostCents
    : materials.reduce((acc, m) => acc + (m.costCents || 0), 0);

  // Fórmula do Markup Divisor
  // Preço = Custo Direto / (1 - (Custos Fixos% + Custos Variáveis% + Margem Lucro%) / 100)
  const totalPercentages = fixedCostPercent + variableCostPercent + profitMarginPercent;
  const isPercentInvalid = totalPercentages >= 100;

  const markupDivisor = isPercentInvalid ? 0.01 : Math.max(0.01, 1 - totalPercentages / 100);
  const suggestedPriceCents = isPercentInvalid
    ? 0
    : Math.round(totalDirectCostCents / markupDivisor);

  // Cálculos de decomposição com base no preço sugerido
  const activePriceCents = customPriceCents !== null && customPriceCents > 0
    ? customPriceCents
    : suggestedPriceCents;

  const variableCostRealCents = Math.round(activePriceCents * (variableCostPercent / 100));
  const fixedCostRealCents = Math.round(activePriceCents * (fixedCostPercent / 100));
  const profitNetCents = activePriceCents - totalDirectCostCents - variableCostRealCents - fixedCostRealCents;
  const profitRealPercent = activePriceCents > 0
    ? Math.round((profitNetCents / activePriceCents) * 100)
    : 0;

  // Funções para manipular materiais
  const handleAddMaterial = () => {
    setMaterials((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: '', costCents: 0 },
    ]);
  };

  const handleUpdateMaterial = (id: string, field: 'name' | 'costCents', value: any) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleRemoveMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  // Salvar no catálogo
  const handleSave = async () => {
    if (!name.trim()) {
      setFeedback({ type: 'error', message: 'Digite o nome do produto ou serviço para salvar.' });
      return;
    }

    if (totalDirectCostCents <= 0) {
      setFeedback({ type: 'error', message: 'O custo direto deve ser maior que zero.' });
      return;
    }

    if (isPercentInvalid) {
      setFeedback({ type: 'error', message: 'A soma das porcentagens não pode ser 100% ou mais.' });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const res = await savePricingItemAction({
        id: editingId || undefined,
        name: name.trim(),
        type: itemType,
        directCostCents: totalDirectCostCents,
        fixedCostPercent,
        variableCostPercent,
        profitMarginPercent,
        suggestedPriceCents: activePriceCents,
        materialsDetails: JSON.stringify(materials),
        notes: notes.trim() || null,
      });

      if (!res.success) {
        setFeedback({ type: 'error', message: res.error || 'Erro ao salvar item.' });
        setLoading(false);
        return;
      }

      setFeedback({
        type: 'success',
        message: editingId
          ? 'Item de precificação atualizado com sucesso!'
          : 'Produto/Serviço salvo no seu catálogo com sucesso!',
      });

      if (!editingId) {
        setName('');
        setNotes('');
        setCustomPriceCents(null);
      }
      setEditingId(null);
      router.refresh();
    } catch {
      setFeedback({ type: 'error', message: 'Falha de comunicação com o servidor.' });
    } finally {
      setLoading(false);
    }
  };

  // Editar item existente do catálogo
  const handleEdit = (item: SavedPricingItem) => {
    setEditingId(item.id);
    setName(item.name);
    setItemType(item.type);
    setFixedCostPercent(item.fixedCostPercent);
    setVariableCostPercent(item.variableCostPercent);
    setProfitMarginPercent(item.profitMarginPercent);
    setNotes(item.notes || '');
    setCustomPriceCents(item.suggestedPriceCents);

    try {
      if (item.materialsDetails) {
        const parsed = JSON.parse(item.materialsDetails);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMaterials(parsed);
          setManualDirectCostCents(null);
        } else {
          setManualDirectCostCents(item.directCostCents);
        }
      } else {
        setManualDirectCostCents(item.directCostCents);
      }
    } catch {
      setManualDirectCostCents(item.directCostCents);
    }

    setActiveTab('calculator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Excluir item do catálogo
  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente remover este item do catálogo?')) return;

    try {
      await deletePricingItemAction(id);
      router.refresh();
    } catch {
      alert('Erro ao excluir item.');
    }
  };

  // Copiar resumo formatado para o cliente no WhatsApp
  const handleCopySummary = (item: SavedPricingItem) => {
    const formattedPrice = (item.suggestedPriceCents / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    const text = `*${item.name}*\n🏷️ Preço: ${formattedPrice}\n${item.notes ? `ℹ️ Detalhes: ${item.notes}\n` : ''}✨ Garantia de qualidade e atendimento especial!`;

    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Topo / Banner Didático */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E4E4E7] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
              <Calculator className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#09090B] tracking-tight">
              Módulo de Precificação
            </h1>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Novo
            </span>
          </div>
          <p className="text-xs text-[#71717A] max-w-xl">
            Descubra o preço de venda ideal para seus produtos e serviços considerando custos fixos, variáveis, insumos e margem de lucro real.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setExplainModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-rose-50 via-white to-pink-50 border border-rose-200 text-xs font-semibold text-rose-800 hover:border-rose-300 transition-all shadow-2xs self-start md:self-auto cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-rose-500" />
          <span>Ver Regras da Aula</span>
        </button>
      </div>

      {/* Navegação entre Calculadora e Catálogo */}
      <div className="flex items-center gap-2 border-b border-[#E4E4E7] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('calculator')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'calculator'
              ? 'bg-[#09090B] text-white shadow-xs'
              : 'text-[#71717A] hover:text-[#09090B] hover:bg-[#F4F4F5]'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>{editingId ? 'Editando Item' : 'Calculadora & Simulador'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'catalog'
              ? 'bg-[#09090B] text-white shadow-xs'
              : 'text-[#71717A] hover:text-[#09090B] hover:bg-[#F4F4F5]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Meus Itens Salvos ({initialItems.length})</span>
        </button>
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

      {/* ABA 1: CALCULADORA */}
      {activeTab === 'calculator' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Coluna da Esquerda (Inputs) - 7 colunas */}
          <div className="lg:col-span-7 space-y-5">
            {/* 1. Identificação do Item */}
            <div className="bg-white p-5 rounded-2xl border border-[#E4E4E7] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                  Etapa 1
                </span>
                <span className="text-[11px] font-semibold text-[#09090B]">
                  Identificação do Negócio
                </span>
              </div>

              {/* Seletor Produto vs Serviço */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#F4F4F5] rounded-xl">
                <button
                  type="button"
                  onClick={() => setItemType('product')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    itemType === 'product'
                      ? 'bg-white text-[#09090B] shadow-2xs'
                      : 'text-[#71717A] hover:text-[#09090B]'
                  }`}
                >
                  <Package className="w-4 h-4 text-amber-600" />
                  <span>Produto Físico</span>
                </button>

                <button
                  type="button"
                  onClick={() => setItemType('service')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    itemType === 'service'
                      ? 'bg-white text-[#09090B] shadow-2xs'
                      : 'text-[#71717A] hover:text-[#09090B]'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>Serviço Prestado</span>
                </button>
              </div>

              <Input
                label={itemType === 'product' ? 'Nome do Produto' : 'Nome do Serviço'}
                placeholder={itemType === 'product' ? 'Ex: Pudim de Leite Médio, Hambúrguer Artesanal...' : 'Ex: Alongamento de Unhas, Manutenção, Consultoria...'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* 2. Custos Diretos / Insumos */}
            <div className="bg-white p-5 rounded-2xl border border-[#E4E4E7] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                    Etapa 2
                  </span>
                  <h2 className="text-sm font-bold text-[#09090B] mt-0.5">
                    {itemType === 'product'
                      ? 'Custo do Produto (Insumos e Ingredientes)'
                      : 'Materiais Diretos e Indiretos'}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#71717A] block">Total Insumos</span>
                  <span className="text-sm font-bold text-[#09090B]">
                    {(totalDirectCostCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[#71717A] leading-relaxed">
                {itemType === 'product'
                  ? 'Liste os ingredientes, matéria-prima e embalagens consumidos para produzir 1 unidade.'
                  : 'Liste os materiais descartáveis ou produtos consumidos em 1 atendimento (ex: lixas, luvas, tintas, cremes).'}
              </p>

              {/* Lista dinâmica de materiais */}
              <div className="space-y-2.5">
                {materials.map((mat, idx) => (
                  <div key={mat.id} className="flex items-center gap-2 bg-[#FAFAFA] p-2.5 rounded-xl border border-[#E4E4E7]">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder={`Item ${idx + 1} (ex: Leite Moça, Embalagem...)`}
                        value={mat.name}
                        onChange={(e) => handleUpdateMaterial(mat.id, 'name', e.target.value)}
                        className="w-full bg-transparent text-xs text-[#09090B] font-medium placeholder-[#A1A1AA] outline-none"
                      />
                    </div>
                    <div className="w-28 sm:w-32">
                      <MoneyInput
                        label="Custo do Insumo"
                        hideLabel
                        valueCents={mat.costCents}
                        onChangeCents={(val) => handleUpdateMaterial(mat.id, 'costCents', val)}
                        className="text-xs py-1.5"
                      />
                    </div>
                    {materials.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMaterial(mat.id)}
                        className="p-1.5 text-[#A1A1AA] hover:text-[#DC2626] transition-colors rounded-lg hover:bg-red-50 cursor-pointer"
                        title="Remover insumo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddMaterial}
                className="w-full py-2.5 border border-dashed border-[#D4D4D8] hover:border-[#09090B] rounded-xl text-xs font-semibold text-[#52525B] hover:text-[#09090B] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar outro ingrediente/material</span>
              </button>
            </div>

            {/* 3. Custos Fixos, Variáveis e Margem de Lucro */}
            <div className="bg-white p-5 rounded-2xl border border-[#E4E4E7] shadow-xs space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                  Etapa 3
                </span>
                <h2 className="text-sm font-bold text-[#09090B] mt-0.5">
                  Custos da Empresa e Margem de Lucro
                </h2>
                <p className="text-[11px] text-[#71717A] mt-0.5">
                  Defina as porcentagens que serão absorvidas pelo preço final.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Custos Variáveis */}
                <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-[#09090B]">
                      Custos Variáveis
                    </label>
                    <span className="text-xs font-extrabold text-amber-600">{variableCostPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="0.5"
                    value={variableCostPercent}
                    onChange={(e) => setVariableCostPercent(parseFloat(e.target.value) || 0)}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <p className="text-[10px] text-[#71717A] leading-tight">
                    Taxas de maquininha (ex: 2.5% a 5%), impostos MEI e comissões.
                  </p>
                </div>

                {/* Custos Fixos */}
                <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-[#09090B]">
                      Custos Fixos
                    </label>
                    <span className="text-xs font-extrabold text-blue-600">{fixedCostPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="1"
                    value={fixedCostPercent}
                    onChange={(e) => setFixedCostPercent(parseFloat(e.target.value) || 0)}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <p className="text-[10px] text-[#71717A] leading-tight">
                    Rateio de aluguel, luz, internet, água e despesas fixas.
                  </p>
                </div>

                {/* Margem de Lucro Desejada */}
                <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-[#09090B]">
                      Margem de Lucro
                    </label>
                    <span className="text-xs font-extrabold text-emerald-600">{profitMarginPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="80"
                    step="1"
                    value={profitMarginPercent}
                    onChange={(e) => setProfitMarginPercent(parseFloat(e.target.value) || 0)}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <p className="text-[10px] text-[#71717A] leading-tight">
                    Quanto você quer que sobre limpo no bolso em cada venda.
                  </p>
                </div>
              </div>

              {/* Botões rápidos de margem */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-[#71717A] mr-1">Sugestões de Lucro:</span>
                {[20, 25, 30, 40, 50].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setProfitMarginPercent(pct)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                      profitMarginPercent === pct
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#F4F4F5] text-[#52525B] hover:bg-[#E4E4E7]'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>

              {isPercentInvalid && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-[#DC2626]">
                  A soma das porcentagens ({totalPercentages}%) é maior ou igual a 100%. Reduza os custos ou a margem para poder calcular.
                </div>
              )}
            </div>
          </div>

          {/* Coluna da Direita (Resultado & Simulador) - 5 colunas */}
          <div className="lg:col-span-5 space-y-5">
            {/* Card Principal de Preço Sugerido */}
            <div className="bg-gradient-to-br from-[#09090B] to-[#18181B] text-white p-6 rounded-2xl shadow-md space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                  Resultado Financeiro
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/10 text-rose-300">
                  Fórmula de Markup
                </span>
              </div>

              <div className="space-y-1 relative z-10">
                <span className="text-xs text-[#A1A1AA] block">Preço de Venda Sugerido</span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {(suggestedPriceCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
                <p className="text-[11px] text-[#A1A1AA]">
                  Com esse valor, você paga todos os custos e garante <strong className="text-emerald-400">{profitMarginPercent}%</strong> de lucro limpo.
                </p>
              </div>

              {/* Destaque do Lucro Líquido Real */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1 relative z-10">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#A1A1AA]">Lucro Líquido por Venda:</span>
                  <span className="font-extrabold text-emerald-400 text-sm">
                    {(profitNetCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#A1A1AA]">
                  <span>Margem Real:</span>
                  <span className="font-bold text-white">{profitRealPercent}%</span>
                </div>
              </div>

              {/* Raio-X do Preço (Onde vai cada real) */}
              <div className="space-y-2 relative z-10 pt-1">
                <span className="text-[11px] font-bold text-[#E4E4E7] block">
                  Para onde vai o dinheiro dessa venda:
                </span>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-amber-300">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      Insumos / Custo Direto:
                    </span>
                    <span className="font-bold text-white">
                      {(totalDirectCostCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-amber-200">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Custos Variáveis ({variableCostPercent}%):
                    </span>
                    <span className="font-bold text-white">
                      {(variableCostRealCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-blue-300">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      Custos Fixos ({fixedCostPercent}%):
                    </span>
                    <span className="font-bold text-white">
                      {(fixedCostRealCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-white/10 font-bold">
                    <span className="flex items-center gap-1.5 text-emerald-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Sobra no Bolso (Lucro):
                    </span>
                    <span className="text-emerald-400">
                      {(profitNetCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulador de Preço Próprio ("E se eu vender por...") */}
            <div className="bg-white p-5 rounded-2xl border border-[#E4E4E7] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#09090B] flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-rose-500" />
                  <span>Simulador de Preço Personalizado</span>
                </h3>
                {customPriceCents !== null && (
                  <button
                    type="button"
                    onClick={() => setCustomPriceCents(null)}
                    className="text-[10px] text-rose-600 hover:underline font-semibold cursor-pointer"
                  >
                    Usar Preço Sugerido
                  </button>
                )}
              </div>

              <p className="text-[11px] text-[#71717A]">
                Quer arredondar ou testar outro valor? Digite abaixo para ver o impacto no seu bolso:
              </p>

              <MoneyInput
                label="Se eu vender por este valor:"
                valueCents={customPriceCents !== null ? customPriceCents : suggestedPriceCents}
                onChangeCents={(val) => setCustomPriceCents(val)}
                className="font-bold text-base"
              />

              {profitNetCents < 0 ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-[#DC2626] font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Cuidado: Esse preço dá prejuízo de {(Math.abs(profitNetCents) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} por unidade!</span>
                </div>
              ) : null}
            </div>

            {/* Observações e Botão de Salvar */}
            <div className="bg-white p-5 rounded-2xl border border-[#E4E4E7] shadow-xs space-y-3">
              <Input
                label="Observações / Anotações (Opcional)"
                placeholder="Ex: Rende 8 fatias, tempo de preparo 40 min, cliente busca no local..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              <div className="flex items-center gap-2 pt-2">
                {editingId && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setEditingId(null);
                      setName('');
                      setNotes('');
                      setCustomPriceCents(null);
                    }}
                  >
                    Cancelar
                  </Button>
                )}

                <Button
                  type="button"
                  onClick={handleSave}
                  loading={loading}
                  className="w-full"
                  icon={<Sparkles className="w-4 h-4" />}
                >
                  {editingId ? 'Salvar Alterações' : 'Salvar no Meu Catálogo'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ABA 2: CATÁLOGO DE ITENS SALVOS */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#09090B]">
              Seus Produtos e Serviços Precificados ({initialItems.length})
            </h2>
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setActiveTab('calculator');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#09090B] text-white text-xs font-bold hover:bg-[#27272A] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Precificar Novo Item</span>
            </button>
          </div>

          {initialItems.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-[#E4E4E7] text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#09090B]">Nenhum item salvo ainda</h3>
                <p className="text-xs text-[#71717A] mt-1 max-w-sm mx-auto">
                  Use a calculadora ao lado para montar a precificação dos seus produtos ou serviços e salve para consultar quando quiser.
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => setActiveTab('calculator')}
                className="mt-2"
              >
                Começar a Precificar Agora
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {initialItems.map((item) => {
                const priceFormatted = (item.suggestedPriceCents / 100).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                });
                const costFormatted = (item.directCostCents / 100).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                });

                return (
                  <div
                    key={item.id}
                    className="bg-white p-5 rounded-2xl border border-[#E4E4E7] shadow-xs space-y-3 hover:border-[#A1A1AA] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            item.type === 'product'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {item.type === 'product' ? 'Produto' : 'Serviço'}
                          </span>
                          <span className="text-[10px] font-semibold text-[#71717A]">
                            {item.profitMarginPercent}% de margem
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-[#09090B] mt-1">
                          {item.name}
                        </h3>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-[#71717A] block">Preço Final</span>
                        <span className="text-base font-extrabold text-[#09090B]">
                          {priceFormatted}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#FAFAFA] rounded-xl text-[11px]">
                      <div>
                        <span className="text-[#71717A] block">Custo Insumos:</span>
                        <span className="font-semibold text-[#09090B]">{costFormatted}</span>
                      </div>
                      <div>
                        <span className="text-[#71717A] block">Custos Fixos / Var:</span>
                        <span className="font-semibold text-[#09090B]">
                          {item.fixedCostPercent}% + {item.variableCostPercent}%
                        </span>
                      </div>
                    </div>

                    {item.notes ? (
                      <p className="text-[11px] text-[#71717A] line-clamp-2">
                        {item.notes}
                      </p>
                    ) : null}

                    {/* Ações */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#E4E4E7] text-xs">
                      <button
                        type="button"
                        onClick={() => handleCopySummary(item)}
                        className="inline-flex items-center gap-1.5 text-[#52525B] hover:text-[#09090B] font-semibold cursor-pointer"
                        title="Copiar resumo para WhatsApp"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600 font-bold">Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar Preço</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="p-1.5 text-[#52525B] hover:text-[#09090B] rounded-lg hover:bg-[#F4F4F5] cursor-pointer"
                          title="Editar precificação"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-[#A1A1AA] hover:text-[#DC2626] rounded-lg hover:bg-red-50 cursor-pointer"
                          title="Excluir item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal Didático Explicando as Regras da Aula */}
      <Modal
        isOpen={explainModalOpen}
        onClose={() => setExplainModalOpen(false)}
        title="Como Funciona a Precificação Correta?"
        description="Regras fundamentais de finanças para novos empresários."
        maxWidth="md"
      >
        <div className="space-y-4 pt-2 text-xs text-[#52525B] leading-relaxed">
          {/* Card do Mascote */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-rose-50 via-white to-pink-50 border border-rose-200">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-rose-200 bg-white shrink-0 shadow-xs">
              <Image
                src="/mascote-rosa.png"
                alt="Rosinha"
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div>
              <span className="font-bold text-[#09090B] block">Dica de Ouro da Rosinha</span>
              <p className="text-[11px] text-[#71717A]">
                &quot;Nunca some a porcentagem direto no custo! Se você tem um custo de R$ 10 e quer 30% de lucro, vender a R$ 13 é um erro clássico que dá prejuízo.&quot;
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-[#FAFAFA] rounded-xl border border-[#E4E4E7]">
              <h4 className="font-bold text-[#09090B] mb-1">1. Custo Direto (Produto ou Serviço)</h4>
              <p>
                É o que você gasta especificamente para fazer aquela unidade existir. Ingredientes, embalagens, fitas para produto; ou luvas, algodão, tintas e produtos no caso de serviço.
              </p>
            </div>

            <div className="p-3 bg-[#FAFAFA] rounded-xl border border-[#E4E4E7]">
              <h4 className="font-bold text-[#09090B] mb-1">2. Custos Variáveis (%)</h4>
              <p>
                Gastos que só acontecem quando você vende: taxa da maquininha de cartão (débito, crédito ou parcelamento), nota fiscal/imposto (DAS MEI ou Simples) e comissões.
              </p>
            </div>

            <div className="p-3 bg-[#FAFAFA] rounded-xl border border-[#E4E4E7]">
              <h4 className="font-bold text-[#09090B] mb-1">3. Custos Fixos (%)</h4>
              <p>
                As contas que chegam todo mês mesmo que você não venda nada: aluguel, internet, luz, água e o seu pró-labore. O Rosa Caixa calcula a fração que esse produto ajuda a pagar as contas fixas.
              </p>
            </div>

            <div className="p-3 bg-[#FAFAFA] rounded-xl border border-[#E4E4E7]">
              <h4 className="font-bold text-[#09090B] mb-1">4. Margem de Lucro Real (%)</h4>
              <p>
                O dinheiro que sobra livre na sua mão para reinvestir no negócio ou guardar na poupança depois de pagar todas as contas acima.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="primary" onClick={() => setExplainModalOpen(false)}>
              Entendi, vamos precificar!
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
