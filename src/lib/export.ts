import { formatDateBR } from './calculations';

export interface ExportableTransaction {
  transactionDate: string;
  type: string;
  description: string;
  categoryName?: string | null;
  amountCents: number;
  notes?: string | null;
}

/**
 * Gera o conteúdo de um arquivo CSV otimizado para o Microsoft Excel em português brasileiro:
 * - Separador ponto e vírgula (;)
 * - Caractere BOM UTF-8 (\uFEFF) para garantir abertura correta de acentos no Excel
 * - Valores numéricos com vírgula como separador decimal
 */
export function generateTransactionsCSV(items: ExportableTransaction[]): string {
  const headers = ['Data', 'Tipo', 'Descrição', 'Categoria', 'Valor (R$)', 'Observações'];

  const rows = items.map((item) => {
    const date = formatDateBR(item.transactionDate);
    const type = item.type === 'income' ? 'Entrada' : 'Saída';
    const desc = `"${(item.description || '').replace(/"/g, '""')}"`;
    const cat = `"${(item.categoryName || 'Sem Categoria').replace(/"/g, '""')}"`;
    
    // Valor em reais com vírgula para fórmulas do Excel
    const valorNum = (item.amountCents / 100).toFixed(2).replace('.', ',');
    const valorFormatado = item.type === 'expense' ? `-${valorNum}` : valorNum;
    const notes = `"${(item.notes || '').replace(/"/g, '""')}"`;

    return [date, type, desc, cat, valorFormatado, notes].join(';');
  });

  // BOM UTF-8 (\uFEFF) no início do arquivo
  return '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
}
