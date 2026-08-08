// js/logic.js — Funções puras (sem dependência de DOM).
// São a "camada de domínio": filtragem, ordenação, paginação, KPIs,
// agrupamentos para gráficos, execução financeira, CSV e estado na URL.
// Mantê-las puras permite testá-las diretamente em Node (ver test/logic.test.mjs).

/**
 * @typedef {Object} Emenda
 * @property {number} id
 * @property {string} numeroEmenda
 * @property {string} deputado
 * @property {string} partido
 * @property {number} valor
 * @property {number} valorEmpenhado
 * @property {number} valorLiquidado
 * @property {number} valorPago
 * @property {string} area
 * @property {string} projeto
 * @property {string} descricaoCompleta
 * @property {string} beneficiarios
 * @property {number} ano
 * @property {string} status
 * @property {string} dataAprovacao
 *
 * @typedef {Object} Filters
 * @property {string} area
 * @property {string} status
 * @property {string} ano
 * @property {string} deputado
 * @property {string} search
 */

export const areaConfig = {
    saude: { label: 'Saúde', color: '#3b82f6', icon: 'health' },
    educacao: { label: 'Educação', color: '#f59e0b', icon: 'book' },
    infraestrutura: { label: 'Infraestrutura', color: '#00ff88', icon: 'building' },
    cultura: { label: 'Cultura', color: '#a855f7', icon: 'culture' },
};

export const statusLabels = {
    'em-execucao': 'Em Execução',
    'concluido': 'Concluído',
    'planejamento': 'Planejamento',
};

export const statusOrder = { 'em-execucao': 0, 'planejamento': 1, 'concluido': 2 };

export const numericColumns = new Set(['valor', 'ano']);

export const DEFAULT_FILTERS = { area: 'all', status: 'all', ano: 'all', deputado: 'all', search: '' };
export const DEFAULT_SORT = { column: null, dir: 'asc' };
export const PER_PAGE = 8;

/* ---------------- Validação de dados ---------------- */

/** @param {Emenda} e */
export function validateEmenda(e) {
    const errors = [];
    if (typeof e.id !== 'number') errors.push('id inválido');
    if (typeof e.numeroEmenda !== 'string') errors.push('numeroEmenda inválido');
    if (typeof e.deputado !== 'string') errors.push('deputado inválido');
    if (typeof e.valor !== 'number' || e.valor < 0) errors.push('valor inválido');
    if (!areaConfig[e.area]) errors.push(`área desconhecida: ${e.area}`);
    if (!statusLabels[e.status]) errors.push(`status desconhecido: ${e.status}`);
    return errors;
}

/** @param {{ emendas: Emenda[] }} data */
export function validateData(data) {
    if (!data || !Array.isArray(data.emendas)) {
        return { ok: false, errors: ['formato inválido: esperado { emendas: [] }'] };
    }
    const errors = [];
    data.emendas.forEach((e, i) => {
        const errs = validateEmenda(e);
        if (errs.length) errors.push(`#${i + 1} (${e.numeroEmenda || '?'}): ${errs.join('; ')}`);
    });
    return { ok: errors.length === 0, errors };
}

/* ---------------- Execução financeira ---------------- */

/** @param {Emenda} emenda */
export function computeExecucao(emenda) {
    const valor = emenda.valor || 0;
    const empenhado = emenda.valorEmpenhado || 0;
    const liquidado = emenda.valorLiquidado || 0;
    const pago = emenda.valorPago || 0;
    const percentual = valor > 0 ? Math.round((pago / valor) * 100) : 0;
    return { valor, empenhado, liquidado, pago, percentual };
}

/* ---------------- Filtro / ordenação / paginação ---------------- */

/** @param {Emenda[]} emendas @param {Filters} filters */
export function filterEmendas(emendas, filters) {
    const f = { ...DEFAULT_FILTERS, ...filters };
    const term = (f.search || '').trim().toLowerCase();
    return emendas.filter((e) => {
        if (f.area !== 'all' && e.area !== f.area) return false;
        if (f.status !== 'all' && e.status !== f.status) return false;
        if (f.ano !== 'all' && String(e.ano) !== String(f.ano)) return false;
        if (f.deputado !== 'all' && e.deputado !== f.deputado) return false;
        if (term) {
            const haystack = [
                e.deputado, e.partido, e.projeto, e.numeroEmenda,
                areaConfig[e.area]?.label, statusLabels[e.status],
            ].join(' ').toLowerCase();
            if (!haystack.includes(term)) return false;
        }
        return true;
    });
}

/** @param {string} column @param {'asc'|'desc'} dir */
export function getComparator(column, dir) {
    const factor = dir === 'asc' ? 1 : -1;
    return (a, b) => {
        let va = a[column];
        let vb = b[column];
        if (column === 'area') {
            va = areaConfig[va]?.label ?? va;
            vb = areaConfig[vb]?.label ?? vb;
        } else if (column === 'status') {
            va = statusOrder[va] ?? 99;
            vb = statusOrder[vb] ?? 99;
        } else if (column === 'execucao') {
            return (computeExecucao(a).percentual - computeExecucao(b).percentual) * factor;
        } else if (numericColumns.has(column)) {
            return (va - vb) * factor;
        }
        return String(va).localeCompare(String(vb), 'pt-BR') * factor;
    };
}

/** @param {Emenda[]} emendas @param {{column:string|null,dir:string}} sort */
export function sortEmendas(emendas, sort) {
    if (!sort || !sort.column) return [...emendas];
    return [...emendas].sort(getComparator(sort.column, sort.dir));
}

/** @param {Emenda[]} emendas @param {number} page @param {number} perPage */
export function paginate(emendas, page, perPage) {
    const total = emendas.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const p = Math.min(Math.max(1, page), totalPages);
    const start = (p - 1) * perPage;
    const end = Math.min(start + perPage, total);
    return { items: emendas.slice(start, end), total, totalPages, page: p, start: start + 1, end };
}

export function getPageList(current, total) {
    const pages = [];
    if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i);
        return pages;
    }
    pages.push(1);
    if (current > 3) pages.push('...');
    const s = Math.max(2, current - 1);
    const e = Math.min(total - 1, current + 1);
    for (let i = s; i <= e; i++) pages.push(i);
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
}

/* ---------------- KPIs ---------------- */

/** @param {Emenda[]} emendas */
export function computeKPIs(emendas) {
    const total = emendas.length;
    const deputados = new Set(emendas.map((e) => e.deputado)).size;
    const valorTotal = emendas.reduce((s, e) => s + (e.valor || 0), 0);
    const emExecucao = emendas.filter((e) => e.status === 'em-execucao').length;
    const concluidas = emendas.filter((e) => e.status === 'concluido').length;
    const pagoTotal = emendas.reduce((s, e) => s + (e.valorPago || 0), 0);
    const taxaExecucao = valorTotal > 0 ? Math.round((pagoTotal / valorTotal) * 100) : 0;
    const media = total > 0 ? valorTotal / total : 0;

    const anos = [...new Set(emendas.map((e) => e.ano))].sort();
    const anoRecente = anos[anos.length - 1];
    const qtdAnoRecente = anoRecente ? emendas.filter((e) => e.ano === anoRecente).length : 0;
    const areasDistintas = new Set(emendas.map((e) => e.area)).size;

    return {
        totalEmendas: total,
        totalDeputados: deputados,
        valorTotal,
        emExecucao,
        concluidas,
        pagoTotal,
        taxaExecucao,
        media,
        trends: {
            emendas: total === 0 ? '-' : `${qtdAnoRecente} em ${anoRecente}`,
            deputados: total === 0 ? '-' : `${areasDistintas} ${areasDistintas === 1 ? 'área' : 'áreas'}`,
            valor: total === 0 ? '-' : `Média: ${Math.round(media)}`,
            execucao: total === 0 ? '-' : `${concluidas} concluíd${concluidas === 1 ? 'a' : 'as'}`,
        },
    };
}

/* ---------------- Agrupamentos para gráficos ---------------- */

export function groupByDeputado(emendas) {
    const map = {};
    emendas.forEach((e) => { map[e.deputado] = (map[e.deputado] || 0) + e.valor; });
    return Object.entries(map)
        .map(([nome, valor]) => ({ nome, valor }))
        .sort((a, b) => b.valor - a.valor);
}

export function groupByArea(emendas) {
    const map = {};
    emendas.forEach((e) => { map[e.area] = (map[e.area] || 0) + e.valor; });
    return Object.entries(map)
        .map(([area, valor]) => ({
            area,
            label: areaConfig[area]?.label || area,
            color: areaConfig[area]?.color || '#888',
            valor,
        }))
        .sort((a, b) => b.valor - a.valor);
}

export function groupByAno(emendas) {
    const map = {};
    emendas.forEach((e) => {
        if (!map[e.ano]) map[e.ano] = { ano: e.ano, count: 0, valor: 0 };
        map[e.ano].count += 1;
        map[e.ano].valor += e.valor;
    });
    return Object.values(map).sort((a, b) => a.ano - b.ano);
}

/* ---------------- CSV ---------------- */

/** @param {Emenda[]} emendas */
export function toCSV(emendas) {
    const headers = ['Numero', 'Deputado', 'Partido', 'Area', 'Projeto', 'Valor', 'Ano', 'Status', 'Empenhado', 'Liquidado', 'Pago', '% Execucao', 'Data Aprovacao'];
    const escape = (v) => {
        const s = String(v ?? '');
        return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = emendas.map((e) => {
        const ex = computeExecucao(e);
        return [
            e.numeroEmenda, e.deputado, e.partido, areaConfig[e.area]?.label || e.area,
            e.projeto, e.valor, e.ano, statusLabels[e.status],
            ex.empenhado, ex.liquidado, ex.pago, `${ex.percentual}%`, e.dataAprovacao,
        ].map(escape).join(',');
    });
    return [headers.join(','), ...rows].join('\n');
}

/* ---------------- Estado na URL ---------------- */

/** @param {{filters:Filters, page:number, sort:{column:string|null,dir:string}}} state */
export function serializeState(state) {
    const f = state.filters;
    const p = new URLSearchParams();
    if (f.area && f.area !== 'all') p.set('area', f.area);
    if (f.status && f.status !== 'all') p.set('status', f.status);
    if (f.ano && f.ano !== 'all') p.set('ano', f.ano);
    if (f.deputado && f.deputado !== 'all') p.set('deputado', f.deputado);
    if (f.search) p.set('q', f.search);
    if (state.page && state.page > 1) p.set('page', String(state.page));
    if (state.sort && state.sort.column) {
        p.set('sort', state.sort.column);
        p.set('dir', state.sort.dir);
    }
    return p.toString();
}

/** @param {string} search */
export function parseState(search) {
    const p = new URLSearchParams(search || '');
    const filters = { ...DEFAULT_FILTERS };
    if (p.get('area')) filters.area = p.get('area');
    if (p.get('status')) filters.status = p.get('status');
    if (p.get('ano')) filters.ano = p.get('ano');
    if (p.get('deputado')) filters.deputado = p.get('deputado');
    if (p.get('q')) filters.search = p.get('q');
    const page = p.get('page') ? Math.max(1, parseInt(p.get('page'), 10) || 1) : 1;
    const sortCol = p.get('sort');
    const sort = sortCol
        ? { column: sortCol, dir: p.get('dir') === 'desc' ? 'desc' : 'asc' }
        : { ...DEFAULT_SORT };
    return { filters, page, sort };
}

/* ---------------- Formatação ---------------- */

export function formatarValor(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency', currency: 'BRL',
        minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(valor || 0);
}

/** Versão compacta para rótulos de gráfico (mi/mil). */
export function formatarValorCurto(valor) {
    const v = valor || 0;
    if (v >= 1e6) return `R$ ${(v / 1e6).toFixed(1).replace('.', ',')} mi`;
    if (v >= 1e3) return `R$ ${Math.round(v / 1e3)} mil`;
    return formatarValor(v);
}

export function formatarDataISO(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    if (!y || !m || !d) return iso;
    return `${d}/${m}/${y}`;
}
