export const UNITS = ['Everest', 'Fênix'] as const;

export const SCS = ['SC1', 'SC2', 'SC3', 'SC4', 'SC5', 'SC6', 'SC7'] as const;

export const SITUATIONS = ['Recebido', 'A preparar', 'Preparado', 'Em fábrica'] as const;

/**
 * Registro principal de produção
 */
export type ProductionItem = {
  id: string;
  date: string;
  unit: string;
  sc: string;
  product: string;
  product_abbr: string;
  batch: string;
  quantity?: number | null;
  quantity_unit: string;
  material_status: string;
  situation: string;
  observation: string;
  created_at: string;
  updated_at: string;
};

/**
 * Retorna data atual em formato YYYY-MM-DD
 */
export const todayISO = (): string => {
  const d = new Date();

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
};

/**
 * Formata data ISO (YYYY-MM-DD) para label PT-BR
 */
export const formatDateLabel = (iso: string): string => {
  if (!iso || typeof iso !== 'string') return '';

  const parts = iso.split('-');
  if (parts.length !== 3) return '';

  const [y, m, d] = parts.map(Number);

  if (!y || !m || !d) return '';

  const dt = new Date(y, m - 1, d);

  if (Number.isNaN(dt.getTime())) return '';

  return dt.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });
};

/**
 * Formata quantidade de sacos
 */
export const formatBags = (q?: number | null): string => {
  if (q === null || q === undefined) return '';

  const n = Number(q);
  if (!Number.isFinite(n)) return '';

  return `${n} bag${n === 1 ? '' : 's'}`;
};
