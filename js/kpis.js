// js/kpis.js — render dos cartões de KPI (reativos aos filtros).
import { computeKPIs } from './logic.js';
import { formatarValor } from './dom.js';

export function renderKPIs(state, filtered) {
    const k = computeKPIs(filtered);
    setText('totalEmendas', k.totalEmendas);
    setText('trendEmendas', k.trends.emendas);
    setText('totalDeputados', k.totalDeputados);
    setText('trendDeputados', k.trends.deputados);
    setText('totalValor', formatarValor(k.valorTotal));
    setText('trendValor', k.totalEmendas === 0 ? '-' : `Média: ${formatarValor(Math.round(k.media))}`);
    setText('totalExecucao', k.emExecucao);
    setText('trendExecucao', k.trends.execucao);
    setText('totalTaxa', k.totalEmendas === 0 ? '-' : `${k.taxaExecucao}%`);
    setText('trendTaxa', k.totalEmendas === 0 ? '-' : `Pago: ${formatarValor(k.pagoTotal)}`);
}

function setText(id, value) {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
}
