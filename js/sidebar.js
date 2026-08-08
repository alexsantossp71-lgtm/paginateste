// js/sidebar.js — menu lateral mobile (toggle + backdrop).
import { $, $all } from './dom.js';

export function initSidebar() {
    const toggle = $('#menuToggle');
    const backdrop = $('#sidebarBackdrop');
    if (!toggle) return;

    const open = () => {
        document.body.classList.add('sidebar-open');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Fechar menu');
    };
    const close = () => {
        document.body.classList.remove('sidebar-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menu');
    };

    toggle.addEventListener('click', () => {
        if (document.body.classList.contains('sidebar-open')) close();
        else open();
    });
    backdrop?.addEventListener('click', close);
    $all('.nav-item').forEach((a) => a.addEventListener('click', close));
}
