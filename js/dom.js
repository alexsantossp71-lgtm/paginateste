// js/dom.js — utilidades de construção de DOM.
// Renderização via DOM/textContent (não innerHTML com dados) para evitar XSS.
import { formatarValor, formatarDataISO } from './logic.js';

const SVGNS = 'http://www.w3.org/2000/svg';

/** Cria um elemento HTML com atributos e filhos. */
export function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    applyAttrs(node, attrs);
    appendChildren(node, children);
    return node;
}

/** Cria um elemento SVG (namespace correto — necessário para <svg>/<use>/<circle>). */
export function svg(tag, attrs = {}, children = []) {
    const node = document.createElementNS(SVGNS, tag);
    applyAttrs(node, attrs);
    appendChildren(node, children);
    return node;
}

function applyAttrs(node, attrs) {
    for (const [k, v] of Object.entries(attrs)) {
        if (v == null || v === false) continue;
        if (k === 'class') node.setAttribute('class', v);
        else if (k === 'text') node.textContent = v;
        else if (k === 'dataset') Object.entries(v).forEach(([dk, dv]) => { node.dataset[dk] = dv; });
        else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
        else if (v === true) node.setAttribute(k, '');
        else node.setAttribute(k, v);
    }
}

function appendChildren(node, children) {
    const list = Array.isArray(children) ? children : [children];
    list.forEach((c) => {
        if (c == null || c === false) return;
        node.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
    });
}

/** Ícone do sprite SVG (use #icon-<name>). */
export function icon(name, size = 16) {
    const use = svg('use', { href: `#icon-${name}` });
    return svg('svg', {
        class: `icon icon-${name}`,
        width: String(size), height: String(size), viewBox: '0 0 24 24',
        fill: 'none', stroke: 'currentColor', 'stroke-width': '2',
        'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true',
    }, [use]);
}

export function clear(node) { node.replaceChildren(); return node; }
export function $(sel, root = document) { return root.querySelector(sel); }
export function $all(sel, root = document) { return [...root.querySelectorAll(sel)]; }

export { formatarValor, formatarDataISO };
