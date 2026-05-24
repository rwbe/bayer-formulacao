import { ProductionItem } from './types';

interface GroupedItems {
  [unit: string]: {
    [sc: string]: ProductionItem[];
  };
}

export const formatReportText = (items: ProductionItem[], extraObs?: string): string => {
  if (!items.length) {
    return 'Nenhum item para esta data.';
  }

  const grouped: GroupedItems = {};

  items.forEach(item => {
    if (!grouped[item.unit]) {
      grouped[item.unit] = {};
    }
    if (!grouped[item.unit][item.sc]) {
      grouped[item.unit][item.sc] = [];
    }
    grouped[item.unit][item.sc].push(item);
  });

  const currentYear = String(new Date().getFullYear()).slice(-2);

  let text = '*Bom dia, segue a situação dos materiais para o próximo turno:*\n\n';

  const units = Object.keys(grouped).sort();

  units.forEach((unit, unitIndex) => {
    text += `> ${unit.toUpperCase()}\n\n`;

    const scs = Object.keys(grouped[unit]).sort();

    scs.forEach((sc, scIndex) => {
      const scItems = grouped[unit][sc];
      const product = scItems[0]?.product || 'Produto desconhecido';

      text += `*${sc} – ${product}*\n\n`;

      scItems.forEach(item => {
        text += `• Lote ${item.batch}/${currentYear} - ${item.situation}\n\n`;
      });
    });

    if (unitIndex < units.length - 1) {
      text += '──────────────\n\n';
    }
  });

  text += '──────────────\n\n';

  if (extraObs) {
    text += '*Observações:*\n';
    text += extraObs;
  } else {
    text += '*Observações:*';
  }

  return text;
};
