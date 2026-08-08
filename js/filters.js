// js/filters.js — chips de área, busca, selects de status/ano/deputado,
// botão limpar. Mantém a UI sincronizada com o estado.
import { getState, setState, resetFilters } from './state.js';
import { statusLabels } from './logic.js';
import { $, $all, el } from './dom.js';

export function initFilters() {
    $all('.chip[data-filter]').forEach((chip) => {
        chip.addEventListener('click', () => updateFilter({ area: chip.dataset.filter }));
    });

    let timer;
    const search = $('#searchInput');
    search.addEventListener('input', (e) => {
        clearTimeout(timer);
        timer = setTimeout(() => updateFilter({ search: e.target.value }), 200);
    });

    $('#filterStatus').addEventListener('change', (e) => updateFilter({ status: e.target.value }));
    $('#filterAno').addEventListener('change', (e) => updateFilter({ ano: e.target.value }));
    $('#filterDeputado').addEventListener('change', (e) => updateFilter({ deputado: e.target.value }));

    const clear = $('#clearFilters');
    if (clear) {
        clear.addEventListener('click', () => {
            resetFilters();
            search.value = '';
        });
    }
}

function updateFilter(patch) {
    const s = getState();
    setState({ filters: { ...s.filters, ...patch }, page: 1 });
}

/** Popula os <select> dinamicamente a partir dos dados carregados. */
export function populateFilterOptions(data) {
    const statusSel = $('#filterStatus');
    Object.entries(statusLabels).forEach(([k, v]) => {
        statusSel.appendChild(el('option', { value: k }, v));
    });

    const anos = [...new Set(data.map((e) => e.ano))].sort();
    const anoSel = $('#filterAno');
    anos.forEach((a) => anoSel.appendChild(el('option', { value: String(a) }, String(a))));

    const deps = [...new Set(data.map((e) => e.deputado))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
    const depSel = $('#filterDeputado');
    deps.forEach((d) => depSel.appendChild(el('option', { value: d }, d)));
}

/** Reflete o estado atual nos controles (chips, selects, busca, botão limpar). */
export function syncFiltersUI(state) {
    const f = state.filters;
    $all('.chip[data-filter]').forEach((chip) => {
        chip.classList.toggle('active', chip.dataset.filter === f.area);
    });
    $('#searchInput').value = f.search;
    $('#filterStatus').value = f.status;
    $('#filterAno').value = f.ano;
    $('#filterDeputado').value = f.deputado;

    const hasFilter = f.area !== 'all' || f.status !== 'all' || f.ano !== 'all' || f.deputado !== 'all' || !!f.search;
    const clearBtn = $('#clearFilters');
    if (clearBtn) clearBtn.hidden = !hasFilter;
}
