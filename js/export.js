// js/export.js — exportação CSV da lista filtrada e impressão (Salvar como PDF).
import { toCSV, filterEmendas, sortEmendas } from './logic.js';
import { getState } from './state.js';
import { el, $ } from './dom.js';

export function initExport() {
    const csv = $('#exportCsv');
    if (csv) csv.addEventListener('click', exportCSV);
    const print = $('#printBtn');
    if (print) print.addEventListener('click', () => window.print());
}

function exportCSV() {
    const s = getState();
    const filtered = sortEmendas(filterEmendas(s.data, s.filters), s.sort);
    if (filtered.length === 0) return;
    const csv = toCSV(filtered);
    // BOM para o Excel reconhecer UTF-8
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = el('a', { href: url, download: `emendas-${new Date().toISOString().slice(0, 10)}.csv` });
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}
