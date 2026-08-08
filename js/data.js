// js/data.js — carregamento e validação dos dados (fetch de data/emendas.json).
import { validateData } from './logic.js';
import { setState } from './state.js';

const DATA_URL = 'data/emendas.json';

export async function loadData() {
    setState({ status: 'loading', error: null });
    try {
        const res = await fetch(DATA_URL, { cache: 'no-cache' });
        if (!res.ok) throw new Error(`Falha ao carregar (HTTP ${res.status}).`);
        const data = await res.json();
        const { ok, errors } = validateData(data);
        if (!ok) throw new Error(`Dados inválidos: ${errors.join(' | ')}`);
        setState({ data: data.emendas, meta: data.meta, status: 'ready', error: null });
        return data;
    } catch (err) {
        // fetch via file:// lança TypeError "Failed to fetch" — mensagem amigável
        const isFileOrNetwork = err instanceof TypeError || /^Failed to fetch/.test(err.message);
        const msg = isFileOrNetwork
            ? 'Não foi possível carregar os dados. Se você abriu o arquivo diretamente (file://), rode um servidor local: python3 -m http.server'
            : err.message;
        setState({ status: 'error', error: msg });
        throw err;
    }
}
