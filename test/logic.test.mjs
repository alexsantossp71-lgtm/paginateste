import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as L from '../js/logic.js';

const sample = [
    { id: 1, numeroEmenda: 'EMD-2024-0001', deputado: 'A', partido: 'X/SP', valor: 2000000, valorEmpenhado: 2000000, valorLiquidado: 1000000, valorPago: 800000, area: 'saude', projeto: 'p1', ano: 2024, status: 'em-execucao', dataAprovacao: '2024-03-15' },
    { id: 2, numeroEmenda: 'EMD-2023-0010', deputado: 'B', partido: 'Y/SP', valor: 1000000, valorEmpenhado: 1000000, valorLiquidado: 1000000, valorPago: 1000000, area: 'educacao', projeto: 'p2', ano: 2023, status: 'concluido', dataAprovacao: '2023-05-10' },
    { id: 3, numeroEmenda: 'EMD-2024-0002', deputado: 'A', partido: 'X/SP', valor: 500000, valorEmpenhado: 0, valorLiquidado: 0, valorPago: 0, area: 'saude', projeto: 'p3', ano: 2024, status: 'planejamento', dataAprovacao: '2024-04-20' },
];

test('validateData aceita dados válidos', () => {
    const r = L.validateData({ emendas: sample });
    assert.equal(r.ok, true);
    assert.equal(r.errors.length, 0);
});

test('validateData rejeita formato inválido', () => {
    const r = L.validateData({ foo: [] });
    assert.equal(r.ok, false);
});

test('validateData detecta área/status desconhecidos', () => {
    const r = L.validateData({ emendas: [{ id: 1, numeroEmenda: 'x', deputado: 'a', valor: 1, area: 'xxx', status: 'yyy' }] });
    assert.equal(r.ok, false);
    assert.ok(r.errors[0].includes('área desconhecida'));
});

test('filterEmendas por área', () => {
    assert.equal(L.filterEmendas(sample, { area: 'saude' }).length, 2);
    assert.equal(L.filterEmendas(sample, { area: 'educacao' }).length, 1);
});

test('filterEmendas por status e ano', () => {
    assert.equal(L.filterEmendas(sample, { status: 'concluido' }).length, 1);
    assert.equal(L.filterEmendas(sample, { ano: '2024' }).length, 2);
});

test('filterEmendas por deputado', () => {
    assert.equal(L.filterEmendas(sample, { deputado: 'A' }).length, 2);
});

test('filterEmendas busca textual (número e área)', () => {
    assert.equal(L.filterEmendas(sample, { search: 'EMD-2024' }).length, 2);
    assert.equal(L.filterEmendas(sample, { search: 'educação' }).length, 1);
});

test('sortEmendas por valor desc', () => {
    const r = L.sortEmendas(sample, { column: 'valor', dir: 'desc' });
    assert.equal(r[0].valor, 2000000);
    assert.equal(r[2].valor, 500000);
});

test('sortEmendas por execução desc (concluido 100% primeiro)', () => {
    const r = L.sortEmendas(sample, { column: 'execucao', dir: 'desc' });
    assert.equal(r[0].status, 'concluido');
});

test('sortEmendas sem coluna retorna cópia não mutada', () => {
    const r = L.sortEmendas(sample, { column: null, dir: 'asc' });
    assert.equal(r.length, 3);
    assert.notEqual(r, sample);
});

test('paginate básico', () => {
    const p = L.paginate(sample, 1, 2);
    assert.equal(p.items.length, 2);
    assert.equal(p.total, 3);
    assert.equal(p.totalPages, 2);
    assert.equal(p.start, 1);
    assert.equal(p.end, 2);
});

test('paginate segunda página', () => {
    const p = L.paginate(sample, 2, 2);
    assert.equal(p.items.length, 1);
    assert.equal(p.start, 3);
    assert.equal(p.end, 3);
});

test('paginate clampa página acima do limite', () => {
    const p = L.paginate(sample, 99, 2);
    assert.equal(p.page, 2);
});

test('paginate lista vazia', () => {
    const p = L.paginate([], 1, 8);
    assert.equal(p.totalPages, 1);
    assert.equal(p.items.length, 0);
});

test('getPageList com poucas páginas', () => {
    assert.deepEqual(L.getPageList(1, 3), [1, 2, 3]);
});

test('getPageList com elipse (janela ±1 ao redor da página atual)', () => {
    assert.deepEqual(L.getPageList(1, 10), [1, 2, '...', 10]);
    assert.deepEqual(L.getPageList(5, 10), [1, '...', 4, 5, 6, '...', 10]);
    assert.deepEqual(L.getPageList(10, 10), [1, '...', 9, 10]);
});

test('computeExecucao', () => {
    assert.equal(L.computeExecucao(sample[0]).percentual, 40);
    assert.equal(L.computeExecucao(sample[1]).percentual, 100);
    assert.equal(L.computeExecucao(sample[2]).percentual, 0);
});

test('computeKPIs', () => {
    const k = L.computeKPIs(sample);
    assert.equal(k.totalEmendas, 3);
    assert.equal(k.totalDeputados, 2);
    assert.equal(k.valorTotal, 3500000);
    assert.equal(k.emExecucao, 1);
    assert.equal(k.concluidas, 1);
    assert.equal(k.taxaExecucao, Math.round((1800000 / 3500000) * 100));
});

test('computeKPIs vazio', () => {
    const k = L.computeKPIs([]);
    assert.equal(k.totalEmendas, 0);
    assert.equal(k.taxaExecucao, 0);
    assert.equal(k.trends.emendas, '-');
});

test('groupByArea / groupByAno / groupByDeputado', () => {
    assert.equal(L.groupByArea(sample).length, 2);
    assert.equal(L.groupByAno(sample).length, 2);
    assert.equal(L.groupByDeputado(sample).length, 2);
    assert.equal(L.groupByDeputado(sample)[0].nome, 'A'); // A tem 2.5M > B 1M
});

test('toCSV', () => {
    const csv = L.toCSV(sample);
    const lines = csv.split('\n');
    assert.equal(lines.length, 4); // header + 3
    assert.ok(lines[0].includes('Numero'));
    assert.ok(lines[1].includes('EMD-2024-0001'));
    assert.ok(lines[1].includes('Saúde'));
});

test('serializeState / parseState roundtrip', () => {
    const state = {
        filters: { area: 'saude', status: 'em-execucao', ano: 'all', deputado: 'all', search: 'abc' },
        page: 2,
        sort: { column: 'valor', dir: 'desc' },
    };
    const qs = L.serializeState(state);
    const parsed = L.parseState(qs);
    assert.equal(parsed.filters.area, 'saude');
    assert.equal(parsed.filters.status, 'em-execucao');
    assert.equal(parsed.filters.search, 'abc');
    assert.equal(parsed.page, 2);
    assert.equal(parsed.sort.column, 'valor');
    assert.equal(parsed.sort.dir, 'desc');
});

test('serializeState omite defaults', () => {
    const qs = L.serializeState({
        filters: { ...L.DEFAULT_FILTERS },
        page: 1,
        sort: { ...L.DEFAULT_SORT },
    });
    assert.equal(qs, '');
});

test('parseState de string vazia retorna defaults', () => {
    const parsed = L.parseState('');
    assert.deepEqual(parsed.filters, L.DEFAULT_FILTERS);
    assert.equal(parsed.page, 1);
    assert.equal(parsed.sort.column, null);
});

test('formatarValor e formatarDataISO', () => {
    assert.match(L.formatarValor(2000000), /2\.000\.000/);
    assert.equal(L.formatarDataISO('2024-03-15'), '15/03/2024');
});

test('formatarValorCurto', () => {
    assert.equal(L.formatarValorCurto(2200000), 'R$ 2,2 mi');
    assert.equal(L.formatarValorCurto(900000), 'R$ 900 mil');
});
