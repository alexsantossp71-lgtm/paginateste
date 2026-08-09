// js/modal.js — detalhamento com navegação ‹/›, foco-trap, inert no fundo,
// execução financeira (barra de progresso) e restauração de foco.
import {
    filterEmendas, sortEmendas, areaConfig, statusLabels,
    computeExecucao, formatarValor, formatarDataISO,
} from './logic.js';
import { getState, setState } from './state.js';
import { el, clear, $ } from './dom.js';

let lastFocused = null;

export function initModal() {
    $('#modalClose').addEventListener('click', closeModal);
    $('#modalPrev').addEventListener('click', () => navModal(-1));
    $('#modalNext').addEventListener('click', () => navModal(1));
    $('#modalOverlay').addEventListener('click', (e) => {
        if (e.target === $('#modalOverlay')) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if ($('#modalOverlay').getAttribute('aria-hidden') !== 'false') return;
        if (e.key === 'Escape') closeModal();
        else if (e.key === 'Tab') trapTab(e, $('#modalOverlay'));
        else if (e.key === 'ArrowLeft') navModal(-1);
        else if (e.key === 'ArrowRight') navModal(1);
    });
}

export function openModalById(id) {
    const s = getState();
    const emenda = s.data.find((e) => e.id === id);
    if (!emenda) return;
    fillModal(emenda);
    updateNavButtons(id);
    showOverlay();
}

function currentOrderedIds() {
    const s = getState();
    return sortEmendas(filterEmendas(s.data, s.filters), s.sort).map((e) => e.id);
}

function navModal(delta) {
    const s = getState();
    const ids = currentOrderedIds();
    const idx = ids.indexOf(s.selectedId);
    if (idx === -1) return;
    const nextId = ids[idx + delta];
    if (nextId == null) return;
    setState({ selectedId: nextId });
    const emenda = s.data.find((e) => e.id === nextId);
    if (emenda) { fillModal(emenda); updateNavButtons(nextId); }
}

function updateNavButtons(id) {
    const ids = currentOrderedIds();
    const idx = ids.indexOf(id);
    $('#modalPrev').disabled = idx <= 0;
    $('#modalNext').disabled = idx === -1 || idx >= ids.length - 1;
}

function fillModal(e) {
    const cfg = areaConfig[e.area];
    const ex = computeExecucao(e);

    $('#modalNumero').textContent = e.numeroEmenda;
    $('#modalDeputado').textContent = e.deputado;
    $('#modalPartido').textContent = e.partido;

    const areaEl = clear($('#modalArea'));
    areaEl.appendChild(el('span', { class: 'dot', style: `background:${cfg.color}` }));
    areaEl.appendChild(document.createTextNode(` ${cfg.label}`));

    const statusBox = clear($('#modalStatus'));
    statusBox.appendChild(el('span', { class: `table-status status-${e.status}`, text: statusLabels[e.status] }));

    $('#modalValor').textContent = formatarValor(e.valor);
    $('#modalAno').textContent = e.ano;
    $('#modalDataAprovacao').textContent = formatarDataISO(e.dataAprovacao);
    $('#modalProjeto').textContent = e.projeto;
    $('#modalDescricao').textContent = e.descricaoCompleta;
    $('#modalBeneficiarios').textContent = e.beneficiarios;

    // Execução financeira
    $('#modalExecPct').textContent = `${ex.percentual}%`;
    const fill = $('#modalExecFill');
    if (fill) fill.style.width = `${ex.percentual}%`;
    $('#modalExecEmpenhado').textContent = formatarValor(ex.empenhado);
    $('#modalExecLiquidado').textContent = formatarValor(ex.liquidado);
    $('#modalExecPago').textContent = formatarValor(ex.pago);
}

function showOverlay() {
    lastFocused = document.activeElement;
    const overlay = $('#modalOverlay');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Conteúdo atrás do modal fica inerte (fora do AT e da tab order)
    document.querySelector('.sidebar')?.setAttribute('inert', '');
    document.querySelector('.main-content')?.setAttribute('inert', '');
    setTimeout(() => $('#modalClose').focus(), 0);
}

function closeModal() {
    const overlay = $('#modalOverlay');
    if (overlay.getAttribute('aria-hidden') === 'true') return;
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.querySelector('.sidebar')?.removeAttribute('inert');
    document.querySelector('.main-content')?.removeAttribute('inert');
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
}

function trapTab(e, container) {
    const focusables = container.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

// Estado selecionado é rastreado para navegação — atualiza sem re-render pesado.
export function setSelected(id) { setState({ selectedId: id }); }
