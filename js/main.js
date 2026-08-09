// js/main.js — ponto de entrada. Orquestra carga de dados, estado e render.
import {
    filterEmendas, sortEmendas, serializeState, parseState, formatarDataISO,
} from './logic.js';
import { getState, setState, subscribe } from './state.js';
import { loadData } from './data.js';
import { initTheme } from './theme.js';
import { initSidebar } from './sidebar.js';
import { initFilters, populateFilterOptions, syncFiltersUI } from './filters.js';
import { initTable, renderTable } from './table.js';
import { renderKPIs } from './kpis.js';
import { renderCharts } from './charts.js';
import { initModal } from './modal.js';
import { initExport } from './export.js';
import { $ } from './dom.js';

// Memoização do conjunto filtrado/ordenado (evita recálculo a cada render).
let memoKey = '';
let memoFiltered = [];
function computeFiltered(s) {
    const key = JSON.stringify({ n: s.data.length, f: s.filters, sort: s.sort });
    if (key === memoKey) return memoFiltered;
    memoFiltered = sortEmendas(filterEmendas(s.data, s.filters), s.sort);
    memoKey = key;
    return memoFiltered;
}

let optionsReady = false;

function render() {
    const s = getState();

    if (s.status === 'loading') { showLoading(true); hideError(); return; }
    if (s.status === 'error') { showLoading(false); showError(s.error); return; }
    if (s.status !== 'ready') return;

    showLoading(false);
    hideError();

    if (!optionsReady) { populateFilterOptions(s.data); optionsReady = true; }
    updateMeta(s.meta);

    const filtered = computeFiltered(s);
    renderKPIs(s, filtered);
    renderCharts(s, filtered);
    renderTable(s, filtered);
    syncFiltersUI(s);
    syncURL(s);
}

subscribe(render);

function syncURL(s) {
    const qs = serializeState(s);
    const url = qs ? `?${qs}` : location.pathname;
    history.replaceState(null, '', url);
}

function updateMeta(meta) {
    if (!meta) return;
    const node = $('#lastUpdate');
    if (node) node.textContent = `Fonte: ${meta.fonte} · Atualizado: ${formatarDataISO(meta.dataCaptura)}`;
}

function showLoading(show) {
    const l = $('#loadingState');
    if (l) l.hidden = !show;
    const app = $('#appContent');
    if (app) app.setAttribute('aria-busy', String(show));
}

function showError(msg) {
    const e = $('#errorState');
    if (!e) return;
    e.hidden = false;
    const m = $('#errorMessage');
    if (m) m.textContent = msg;
}

function hideError() {
    const e = $('#errorState');
    if (e) e.hidden = true;
}

async function loadAndRender() {
    try {
        await loadData();
        // render() dispara automaticamente via subscribe quando status vira 'ready'.
    } catch {
        // erro já tratado pelo render (status 'error').
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSidebar();
    initFilters();
    initTable();
    initModal();
    initExport();

    // Restaura estado (filtros, página, ordenação) a partir da URL.
    const { filters, page, sort } = parseState(location.search.slice(1));
    setState({ filters, page, sort });

    const retry = $('#retryBtn');
    if (retry) retry.addEventListener('click', loadAndRender);

    loadAndRender();
});
