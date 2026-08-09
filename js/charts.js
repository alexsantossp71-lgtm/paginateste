// js/charts.js — gráficos SVG: barras (deputado), donut (área) e linha (evolução anual).
// Interativos: tooltip (title), clicáveis/teclado para filtrar, com % do total.
// Acessíveis: role="img" + aria-label com resumo textual.
import {
    groupByDeputado, groupByArea, groupByAno,
    formatarValor, formatarValorCurto,
} from './logic.js';
import { getState, setState } from './state.js';
import { svg, el, clear, $ } from './dom.js';

const DEP_COLORS = ['#00ff88', '#3b82f6', '#f59e0b', '#a855f7', '#ff4466'];

export function renderCharts(state, filtered) {
    renderDeputadoChart(filtered);
    renderAreaDonut(filtered);
    renderEvolucaoChart(filtered);
}

/* ---------- Barras por deputado ---------- */
function renderDeputadoChart(filtered) {
    const container = clear($('#deputadoChart'));
    const data = groupByDeputado(filtered);
    if (!data.length) { container.textContent = 'Sem dados para exibir.'; return; }

    const total = data.reduce((s, d) => s + d.valor, 0);
    const max = data[0].valor;
    const summary = data.map((d) => `${d.nome}: ${formatarValor(d.valor)} (${Math.round((d.valor / total) * 100)}%)`).join('; ');
    const chart = el('div', { class: 'bars', role: 'img', 'aria-label': `Distribuição por deputado. ${summary}` });

    data.forEach((d, i) => {
        const color = DEP_COLORS[i % DEP_COLORS.length];
        const pctMax = (d.valor / max) * 100;
        const pctTotal = Math.round((d.valor / total) * 100);
        const nomeCurto = d.nome.split(' ').slice(0, 2).join(' ');
        const bar = el('div', {
            class: 'chart-bar', tabindex: '0', role: 'button',
            'aria-label': `${d.nome}: ${formatarValor(d.valor)} (${pctTotal}% do total)`,
            title: `${d.nome}: ${formatarValor(d.valor)} (${pctTotal}%)`,
        }, [
            el('div', { class: 'chart-bar-label' }, [
                el('span', { class: 'chart-bar-name' }, [
                    el('span', { class: 'dot', style: `background:${color}` }),
                    nomeCurto,
                ]),
                el('span', { class: 'chart-bar-value' }, `${formatarValorCurto(d.valor)} · ${pctTotal}%`),
            ]),
            el('div', { class: 'chart-bar-track' }, [
                el('div', { class: 'chart-bar-fill', style: `width:${pctMax}%;background:${color}` }),
            ]),
        ]);
        bar.addEventListener('click', () => setFilter({ deputado: d.nome }));
        bar.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFilter({ deputado: d.nome }); } });
        chart.appendChild(bar);
    });
    container.appendChild(chart);
}

/* ---------- Donut por área ---------- */
function renderAreaDonut(filtered) {
    const container = clear($('#areaChart'));
    const data = groupByArea(filtered);
    if (!data.length) { container.textContent = 'Sem dados para exibir.'; return; }

    const total = data.reduce((s, d) => s + d.valor, 0);
    const r = 40, cx = 50, cy = 50, circ = 2 * Math.PI * r;
    const summary = data.map((d) => `${d.label}: ${Math.round((d.valor / total) * 100)}%`).join(', ');

    const wrap = el('div', { class: 'donut-wrap' });
    const donut = svg('svg', { class: 'donut', viewBox: '0 0 100 100', role: 'img', 'aria-label': `Distribuição por área. ${summary}` });
    donut.appendChild(svg('circle', { cx: String(cx), cy: String(cy), r: String(r), fill: 'none', stroke: 'var(--bg-tertiary)', 'stroke-width': '14' }));

    let offset = 0;
    data.forEach((d) => {
        const frac = d.valor / total;
        const len = frac * circ;
        const slice = svg('circle', {
            cx: String(cx), cy: String(cy), r: String(r), fill: 'none',
            stroke: d.color, 'stroke-width': '14',
            'stroke-dasharray': `${len} ${circ - len}`,
            'stroke-dashoffset': String(-offset),
            transform: 'rotate(-90 50 50)',
            class: 'donut-slice', tabindex: '0', role: 'button',
            'aria-label': `${d.label}: ${formatarValor(d.valor)} (${Math.round(frac * 100)}%)`,
            title: `${d.label}: ${formatarValor(d.valor)} (${Math.round(frac * 100)}%)`,
        });
        slice.addEventListener('click', () => setFilter({ area: d.area }));
        slice.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFilter({ area: d.area }); } });
        donut.appendChild(slice);
        offset += len;
    });

    // rótulo central
    const center = svg('text', { x: '50', y: '54', 'text-anchor': 'middle', class: 'donut-center' }, formatarValorCurto(total));
    donut.appendChild(center);

    wrap.appendChild(donut);

    // legenda clicável
    const legend = el('div', { class: 'donut-legend' });
    data.forEach((d) => {
        const pct = Math.round((d.valor / total) * 100);
        legend.appendChild(el('button', {
            class: 'legend-item', type: 'button', title: `Filtrar por ${d.label}`,
            onclick: () => setFilter({ area: d.area }),
        }, [
            el('span', { class: 'dot', style: `background:${d.color}` }),
            el('span', { class: 'legend-label' }, d.label),
            el('span', { class: 'legend-pct' }, `${pct}%`),
        ]));
    });
    wrap.appendChild(legend);
    container.appendChild(wrap);
}

/* ---------- Linha de evolução anual ---------- */
function renderEvolucaoChart(filtered) {
    const container = clear($('#evolucaoChart'));
    const data = groupByAno(filtered);
    if (!data.length) { container.textContent = 'Sem dados para exibir.'; return; }

    const W = 340, H = 150, padL = 40, padB = 26, padT = 18;
    const maxVal = Math.max(...data.map((d) => d.valor), 1);
    const innerW = W - padL - 12;
    const innerH = H - padB - padT;
    const xStep = data.length > 1 ? innerW / (data.length - 1) : 0;
    const pts = data.map((d, i) => ({
        x: padL + i * xStep,
        y: padT + innerH - (d.valor / maxVal) * innerH,
        d,
    }));
    const summary = data.map((d) => `${d.ano}: ${formatarValor(d.valor)} em ${d.count} emenda(s)`).join('; ');

    const chart = svg('svg', { class: 'line-chart', viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': `Evolução anual. ${summary}` });
    // eixo X
    chart.appendChild(svg('line', {
        x1: String(padL), y1: String(padT + innerH), x2: String(padL + innerW), y2: String(padT + innerH), class: 'axis',
    }));
    // linha
    chart.appendChild(svg('polyline', { class: 'line', points: pts.map((p) => `${p.x},${p.y}`).join(' ') }));
    // pontos + rótulos
    pts.forEach((p) => {
        chart.appendChild(svg('circle', {
            cx: String(p.x), cy: String(p.y), r: '4', class: 'point',
            title: `${p.d.ano}: ${formatarValor(p.d.valor)} (${p.d.count} emendas)`,
        }));
        chart.appendChild(svg('text', { x: String(p.x), y: String(H - 6), 'text-anchor': 'middle', class: 'axis-label' }, String(p.d.ano)));
        chart.appendChild(svg('text', { x: String(p.x), y: String(p.y - 10), 'text-anchor': 'middle', class: 'point-label' }, formatarValorCurto(p.d.valor)));
    });
    container.appendChild(chart);
}

function setFilter(patch) {
    const s = getState();
    setState({ filters: { ...s.filters, ...patch }, page: 1 });
}
