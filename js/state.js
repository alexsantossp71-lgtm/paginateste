// js/state.js — store centralizado com padrão pub/sub.
// Um único source of truth: dados, filtros, página, ordenação e status de carga.
import { DEFAULT_FILTERS, DEFAULT_SORT, PER_PAGE } from './logic.js';

const listeners = new Set();

let state = {
    data: [],
    meta: null,
    filters: { ...DEFAULT_FILTERS },
    page: 1,
    perPage: PER_PAGE,
    sort: { ...DEFAULT_SORT },
    status: 'idle', // 'idle' | 'loading' | 'ready' | 'error'
    error: null,
    selectedId: null,
};

export function getState() {
    return state;
}

export function setState(patch) {
    state = { ...state, ...patch };
    listeners.forEach((fn) => fn(state));
}

export function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
}

export function resetFilters() {
    setState({ filters: { ...DEFAULT_FILTERS }, page: 1, sort: { ...DEFAULT_SORT } });
}
