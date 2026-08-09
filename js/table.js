// js/table.js — tabela detalhada com ordenação, paginação, linhas acessíveis
// e coluna de execução financeira. Render via DOM (sem innerHTML com dados).
import {
    paginate, getPageList, areaConfig, statusLabels,
    computeExecucao, formatarValor,
} from './logic.js';
import { getState, setState } from './state.js';
import { el, clear, $, $all } from './dom.js';
import { openModalById } from './modal.js';

export function initTable() {
    const tbody = $('#tableBody');
    tbody.addEventListener('click', (e) => {
        const row = e.target.closest('tr[data-emenda-id]');
        if (row) openModalById(parseInt(row.dataset.emendaId, 10));
    });
    tbody.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const row = e.target.closest('tr[data-emenda-id]');
        if (row) { e.preventDefault(); openModalById(parseInt(row.dataset.emendaId, 10)); }
    });

    $all('.data-table th.sortable').forEach((th) => {
        th.setAttribute('tabindex', '0');
        th.setAttribute('role', 'button');
        th.addEventListener('click', () => toggleSort(th.dataset.sort));
        th.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSort(th.dataset.sort); }
        });
    });
}

function toggleSort(column) {
    const s = getState();
    let dir = 'asc';
    if (s.sort.column === column) dir = s.sort.dir === 'asc' ? 'desc' : 'asc';
    setState({ sort: { column, dir }, page: 1 });
}

export function renderTable(state, filtered) {
    const tbody = clear($('#tableBody'));
    const emptyState = $('#emptyState');
    const recordCount = $('#recordCount');
    recordCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'registro' : 'registros'}`;
    updateSortIndicators(state.sort);

    if (filtered.length === 0) {
        emptyState.style.display = 'block';
        renderPagination(state, filtered);
        return;
    }
    emptyState.style.display = 'none';

    const { items } = paginate(filtered, state.page, state.perPage);
    items.forEach((emenda) => tbody.appendChild(createRow(emenda)));
    renderPagination(state, filtered);
}

function updateSortIndicators(sort) {
    $all('.data-table th.sortable').forEach((th) => {
        th.classList.remove('sort-asc', 'sort-desc');
        if (th.dataset.sort === sort.column) {
            th.classList.add(sort.dir === 'asc' ? 'sort-asc' : 'sort-desc');
            th.setAttribute('aria-sort', sort.dir === 'asc' ? 'ascending' : 'descending');
        } else {
            th.removeAttribute('aria-sort');
        }
    });
}

function createRow(e) {
    const ex = computeExecucao(e);
    const cfg = areaConfig[e.area];
    const tr = el('tr', {
        class: 'table-row-clickable', tabindex: '0', role: 'button',
        dataset: { emendaId: String(e.id) },
        'aria-label': `Emenda ${e.numeroEmenda}, ${e.deputado}, ${cfg.label}, ${formatarValor(e.valor)}, ${statusLabels[e.status]}, ${ex.percentual}% executado`,
    });
    tr.appendChild(cell('table-numero', e.numeroEmenda));
    tr.appendChild(cell('table-deputado', e.deputado));
    tr.appendChild(cell('table-partido', e.partido));
    tr.appendChild(cell('table-projeto', e.projeto));
    tr.appendChild(areaCell(cfg));
    tr.appendChild(valorCell(e.valor));
    tr.appendChild(execCell(ex));
    tr.appendChild(el('td', { text: String(e.ano) }));
    tr.appendChild(statusCell(e.status));
    return tr;
}

function cell(className, text) {
    return el('td', {}, [el('div', { class: className, text })]);
}

function areaCell(cfg) {
    const td = el('td');
    td.appendChild(el('div', { class: 'table-area' }, [
        el('span', { class: 'dot', style: `background:${cfg.color}` }),
        cfg.label,
    ]));
    return td;
}

function valorCell(valor) {
    return el('td', {}, [el('div', { class: 'table-valor', text: formatarValor(valor) })]);
}

function execCell(ex) {
    const td = el('td');
    td.appendChild(el('div', { class: 'exec-cell' }, [
        el('div', { class: 'exec-track' }, [el('div', { class: 'exec-fill', style: `width:${ex.percentual}%` })]),
        el('span', { class: 'exec-pct', text: `${ex.percentual}%` }),
    ]));
    return td;
}

function statusCell(status) {
    const td = el('td');
    td.appendChild(el('span', { class: `table-status status-${status}`, text: statusLabels[status] }));
    return td;
}

/* ---------- Paginação ---------- */
function renderPagination(state, filtered) {
    const controls = clear($('#paginationControls'));
    const info = $('#paginationInfo');
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / state.perPage));
    const page = Math.min(Math.max(1, state.page), totalPages);

    if (total === 0) { info.textContent = 'Nenhum registro'; return; }

    const { start, end } = paginate(filtered, page, state.perPage);
    info.textContent = `Mostrando ${start}–${end} de ${total} registros`;

    const prev = el('button', { class: 'page-btn', 'aria-label': 'Página anterior', disabled: page === 1, onclick: () => setState({ page: page - 1 }) }, '‹');
    controls.appendChild(prev);

    getPageList(page, totalPages).forEach((p) => {
        if (p === '...') {
            controls.appendChild(el('span', { class: 'page-ellipsis' }, '…'));
            return;
        }
        controls.appendChild(el('button', {
            class: `page-btn${p === page ? ' active' : ''}`,
            'aria-label': `Página ${p}`, 'aria-current': p === page ? 'page' : 'false',
            disabled: p === page, onclick: () => setState({ page: p }),
        }, String(p)));
    });

    const next = el('button', { class: 'page-btn', 'aria-label': 'Próxima página', disabled: page === totalPages, onclick: () => setState({ page: page + 1 }) }, '›');
    controls.appendChild(next);
}
