// Dados das emendas parlamentares - Deputados Federais da Baixada Santista
const emendasData = [
    // Paulo Alexandre Barbosa - PSDB/SP
    {
        id: 1,
        numeroEmenda: "EMD-2024-0001",
        deputado: "Paulo Alexandre Barbosa",
        partido: "PSDB/SP",
        valor: 2000000,
        area: "saude",
        projeto: "Aquisição de equipamentos hospitalares para unidades de saúde de Santos",
        descricaoCompleta: "Destinação de recursos para aquisição de equipamentos hospitalares modernos incluindo monitores cardíacos, desfibriladores e equipamentos de UTI para as unidades de saúde do município de Santos.",
        beneficiarios: "População de Santos - estimativa de 50.000 atendimentos/ano",
        ano: 2024,
        status: "em-execucao",
        dataAprovacao: "15/03/2024"
    },
    {
        id: 2,
        numeroEmenda: "EMD-2024-0002",
        deputado: "Paulo Alexandre Barbosa",
        partido: "PSDB/SP",
        valor: 1500000,
        area: "infraestrutura",
        projeto: "Reforma e modernização de vias públicas na região central de Santos",
        descricaoCompleta: "Projeto de recapeamento asfáltico, sinalização horizontal e vertical, e adequação de calçadas nas principais vias da região central de Santos.",
        beneficiarios: "Moradores e comerciantes da região central",
        ano: 2024,
        status: "planejamento",
        dataAprovacao: "20/04/2024"
    },
    {
        id: 3,
        numeroEmenda: "EMD-2023-0015",
        deputado: "Paulo Alexandre Barbosa",
        partido: "PSDB/SP",
        valor: 800000,
        area: "educacao",
        projeto: "Construção de quadra poliesportiva coberta em escola municipal",
        descricaoCompleta: "Construção de quadra poliesportiva coberta com vestiários, arquibancada e iluminação adequada para atividades esportivas e culturais.",
        beneficiarios: "Aproximadamente 800 alunos da rede municipal",
        ano: 2023,
        status: "concluido",
        dataAprovacao: "10/05/2023"
    },
    {
        id: 4,
        numeroEmenda: "EMD-2023-0022",
        deputado: "Paulo Alexandre Barbosa",
        partido: "PSDB/SP",
        valor: 1200000,
        area: "saude",
        projeto: "Ampliação de Unidade Básica de Saúde no Jardim Castelo",
        descricaoCompleta: "Ampliação e reforma da UBS Jardim Castelo incluindo novos consultórios médicos, sala de procedimentos e espaço para atendimento odontológico.",
        beneficiarios: "População do Jardim Castelo - 15.000 habitantes",
        ano: 2023,
        status: "concluido",
        dataAprovacao: "08/06/2023"
    },

    // Rosana Valle - PL/SP
    {
        id: 5,
        numeroEmenda: "EMD-2024-0003",
        deputado: "Rosana Valle",
        partido: "PL/SP",
        valor: 3000000,
        area: "saude",
        projeto: "Aquisição de ambulâncias e equipamentos médicos para atendimento de emergência",
        descricaoCompleta: "Aquisição de 5 ambulâncias tipo D (UTI móvel) equipadas com respiradores, monitores cardíacos e demais equipamentos para atendimento de emergência.",
        beneficiarios: "Toda a população de Santos - atendimento emergencial",
        ano: 2024,
        status: "em-execucao",
        dataAprovacao: "12/02/2024"
    },
    {
        id: 6,
        numeroEmenda: "EMD-2024-0004",
        deputado: "Rosana Valle",
        partido: "PL/SP",
        valor: 1800000,
        area: "educacao",
        projeto: "Reforma e adequação de escolas municipais com acessibilidade",
        descricaoCompleta: "Reforma de 8 escolas municipais incluindo rampas de acesso, banheiros adaptados, piso tátil e sinalização em braile para garantir acessibilidade plena.",
        beneficiarios: "3.200 alunos, incluindo 45 alunos com deficiência",
        ano: 2024,
        status: "em-execucao",
        dataAprovacao: "25/03/2024"
    },
    {
        id: 7,
        numeroEmenda: "EMD-2023-0018",
        deputado: "Rosana Valle",
        partido: "PL/SP",
        valor: 2500000,
        area: "infraestrutura",
        projeto: "Pavimentação e drenagem em vias públicas da Zona Noroeste",
        descricaoCompleta: "Pavimentação asfáltica de 12 ruas e implantação de sistema de drenagem pluvial na Zona Noroeste para combate a alagamentos.",
        beneficiarios: "Aproximadamente 8.000 moradores da Zona Noroeste",
        ano: 2023,
        status: "concluido",
        dataAprovacao: "18/04/2023"
    },
    {
        id: 8,
        numeroEmenda: "EMD-2024-0005",
        deputado: "Rosana Valle",
        partido: "PL/SP",
        valor: 1000000,
        area: "cultura",
        projeto: "Revitalização de espaços culturais e centro comunitário",
        descricaoCompleta: "Reforma e modernização do Centro Cultural da Zona Noroeste incluindo teatro, biblioteca, salas de oficinas artísticas e espaço de convivência.",
        beneficiarios: "Comunidade local - estimativa de 500 usuários/semana",
        ano: 2024,
        status: "planejamento",
        dataAprovacao: "05/05/2024"
    },
    {
        id: 9,
        numeroEmenda: "EMD-2023-0025",
        deputado: "Rosana Valle",
        partido: "PL/SP",
        valor: 2200000,
        area: "saude",
        projeto: "Modernização de equipamentos do Hospital Guilherme Álvaro",
        descricaoCompleta: "Aquisição de tomógrafo, equipamentos de raio-X digital e sistema de gestão hospitalar informatizado para o Hospital Guilherme Álvaro.",
        beneficiarios: "População de Santos e região - 30.000 atendimentos/ano",
        ano: 2023,
        status: "concluido",
        dataAprovacao: "22/07/2023"
    },

    // Delegado da Cunha - Podemos/SP
    {
        id: 10,
        numeroEmenda: "EMD-2024-0006",
        deputado: "Delegado da Cunha",
        partido: "Podemos/SP",
        valor: 1500000,
        area: "infraestrutura",
        projeto: "Implantação de sistema de videomonitoramento urbano",
        descricaoCompleta: "Instalação de 80 câmeras de videomonitoramento em pontos estratégicos da cidade conectadas a central de monitoramento da Guarda Municipal.",
        beneficiarios: "Toda a população - segurança pública",
        ano: 2024,
        status: "em-execucao",
        dataAprovacao: "18/02/2024"
    },
    {
        id: 11,
        numeroEmenda: "EMD-2024-0007",
        deputado: "Delegado da Cunha",
        partido: "Podemos/SP",
        valor: 900000,
        area: "educacao",
        projeto: "Equipamentos de informática e tecnologia para escolas públicas",
        descricaoCompleta: "Aquisição de 300 computadores, 15 lousas digitais, projetores e impressoras para modernização dos laboratórios de informática das escolas municipais.",
        beneficiarios: "2.500 alunos da rede municipal",
        ano: 2024,
        status: "planejamento",
        dataAprovacao: "10/04/2024"
    },
    {
        id: 12,
        numeroEmenda: "EMD-2024-0008",
        deputado: "Delegado da Cunha",
        partido: "Podemos/SP",
        valor: 1800000,
        area: "saude",
        projeto: "Aquisição de equipamentos médicos para unidades de pronto atendimento",
        descricaoCompleta: "Compra de equipamentos médicos incluindo aparelhos de ultrassom, eletrocardiógrafos, oxímetros e macas hospitalares para UPAs da cidade.",
        beneficiarios: "População de Santos - 40.000 atendimentos/ano nas UPAs",
        ano: 2024,
        status: "em-execucao",
        dataAprovacao: "28/03/2024"
    },
    {
        id: 13,
        numeroEmenda: "EMD-2023-0020",
        deputado: "Delegado da Cunha",
        partido: "Podemos/SP",
        valor: 750000,
        area: "infraestrutura",
        projeto: "Reforma de praças e áreas de lazer em bairros periféricos",
        descricaoCompleta: "Revitalização de 6 praças incluindo playground infantil, academia ao ar livre, iluminação LED e paisagismo.",
        beneficiarios: "12.000 moradores de bairros periféricos",
        ano: 2023,
        status: "concluido",
        dataAprovacao: "15/06/2023"
    },
    {
        id: 14,
        numeroEmenda: "EMD-2024-0009",
        deputado: "Delegado da Cunha",
        partido: "Podemos/SP",
        valor: 1100000,
        area: "cultura",
        projeto: "Reforma de biblioteca municipal e aquisição de acervo",
        descricaoCompleta: "Reforma estrutural da Biblioteca Municipal incluindo climatização, modernização do mobiliário e aquisição de 5.000 novos livros para o acervo.",
        beneficiarios: "Comunidade leitora - 800 usuários/mês",
        ano: 2024,
        status: "planejamento",
        dataAprovacao: "22/05/2024"
    }
];

// Configuração de áreas
const areaConfig = {
    saude: { label: 'Saúde', icon: '🏥' },
    educacao: { label: 'Educação', icon: '📚' },
    infraestrutura: { label: 'Infraestrutura', icon: '🏗️' },
    cultura: { label: 'Cultura', icon: '🎭' }
};

// Rótulos de status (centralizado — usado pela tabela e pelo modal)
const statusLabels = {
    'em-execucao': 'Em Execução',
    'concluido': 'Concluído',
    'planejamento': 'Planejamento'
};

// Ordem de status para ordenação (em andamento primeiro)
const statusOrder = {
    'em-execucao': 0,
    'planejamento': 1,
    'concluido': 2
};

// Colunas numéricas (ordenação por valor, não por texto)
const numericColumns = new Set(['valor', 'ano']);

// Estado da aplicação
const PER_PAGE = 8;
let filteredEmendas = [...emendasData];
let currentFilter = 'all';
let searchTerm = '';
let currentPage = 1;
let sortColumn = null;
let sortDir = 'asc';
let lastFocusedBeforeModal = null;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
    initializeSearch();
    initializeSorting();
    initializeRowInteraction();
    initializeModal();
    initializeSidebar();
    applyFilters();
});

// ---------- Filtros ----------
function initializeFilters() {
    const filterChips = document.querySelectorAll('.chip');

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentFilter = chip.dataset.filter;
            applyFilters();
        });
    });
}

// ---------- Busca com debounce ----------
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce((e) => {
        searchTerm = e.target.value.toLowerCase();
        applyFilters();
    }, 200));
}

function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

// ---------- Ordenação por coluna ----------
function initializeSorting() {
    const sortableHeaders = document.querySelectorAll('.data-table th.sortable');
    sortableHeaders.forEach(th => {
        th.setAttribute('tabindex', '0');
        th.setAttribute('role', 'button');

        const toggleSort = () => {
            const column = th.dataset.sort;
            if (sortColumn === column) {
                sortDir = sortDir === 'asc' ? 'desc' : 'asc';
            } else {
                sortColumn = column;
                sortDir = 'asc';
            }
            updateSortIndicators();
            applyFilters();
        };

        th.addEventListener('click', toggleSort);
        th.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleSort();
            }
        });
    });
}

function updateSortIndicators() {
    document.querySelectorAll('.data-table th.sortable').forEach(th => {
        th.classList.remove('sort-asc', 'sort-desc');
        const ariaLabel = th.dataset.sort;
        if (th.dataset.sort === sortColumn) {
            th.classList.add(sortDir === 'asc' ? 'sort-asc' : 'sort-desc');
            th.setAttribute('aria-sort', sortDir === 'asc' ? 'ascending' : 'descending');
        } else {
            th.removeAttribute('aria-sort');
        }
        // Mantém o rótulo legível para leitores de tela
        void ariaLabel;
    });
}

// ---------- Aplicar filtros + ordenação ----------
function applyFilters() {
    filteredEmendas = emendasData.filter(emenda => {
        const matchesFilter = currentFilter === 'all' || emenda.area === currentFilter;
        const matchesSearch = searchTerm === '' ||
            emenda.deputado.toLowerCase().includes(searchTerm) ||
            emenda.partido.toLowerCase().includes(searchTerm) ||
            emenda.projeto.toLowerCase().includes(searchTerm) ||
            emenda.numeroEmenda.toLowerCase().includes(searchTerm) ||
            areaConfig[emenda.area].label.toLowerCase().includes(searchTerm);

        return matchesFilter && matchesSearch;
    });

    if (sortColumn) {
        filteredEmendas.sort(getComparator(sortColumn, sortDir));
    }

    currentPage = 1;
    updateKPIs(filteredEmendas);
    renderCharts(filteredEmendas);
    renderTable();
}

function getComparator(column, dir) {
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
        } else if (numericColumns.has(column)) {
            return (va - vb) * factor;
        }

        return String(va).localeCompare(String(vb), 'pt-BR') * factor;
    };
}

// ---------- KPIs (reativos aos filtros) ----------
function updateKPIs(data) {
    const totalEmendas = data.length;
    const totalDeputados = new Set(data.map(e => e.deputado)).size;
    const totalValor = data.reduce((sum, e) => sum + e.valor, 0);
    const totalExecucao = data.filter(e => e.status === 'em-execucao').length;

    document.getElementById('totalEmendas').textContent = totalEmendas;
    document.getElementById('totalDeputados').textContent = totalDeputados;
    document.getElementById('totalValor').textContent = formatarValor(totalValor);
    document.getElementById('totalExecucao').textContent = totalExecucao;

    // Tendências derivadas dos dados (não hardcoded)
    const trendEmendas = document.getElementById('trendEmendas');
    const trendDeputados = document.getElementById('trendDeputados');
    const trendValor = document.getElementById('trendValor');
    const trendExecucao = document.getElementById('trendExecucao');

    if (data.length === 0) {
        trendEmendas.textContent = '-';
        trendDeputados.textContent = '-';
        trendValor.textContent = '-';
        trendExecucao.textContent = '-';
        return;
    }

    const anos = [...new Set(data.map(e => e.ano))].sort();
    const anoRecente = anos[anos.length - 1];
    const qtdAnoRecente = data.filter(e => e.ano === anoRecente).length;
    trendEmendas.textContent = `${qtdAnoRecente} em ${anoRecente}`;

    const areasDistintas = new Set(data.map(e => e.area)).size;
    trendDeputados.textContent = `${areasDistintas} ${areasDistintas === 1 ? 'área' : 'áreas'}`;

    const media = totalValor / totalEmendas;
    trendValor.textContent = `Média: ${formatarValor(media)}`;

    const concluidos = data.filter(e => e.status === 'concluido').length;
    trendExecucao.textContent = `${concluidos} concluíd${concluidos === 1 ? 'a' : 'as'}`;
}

// ---------- Gráficos (reativos aos filtros) ----------
function renderCharts(data) {
    renderDeputadoChart(data);
    renderAreaChart(data);
}

function renderDeputadoChart(data) {
    const container = document.getElementById('deputadoChart');
    const deputadoStats = {};

    data.forEach(emenda => {
        deputadoStats[emenda.deputado] = (deputadoStats[emenda.deputado] || 0) + emenda.valor;
    });

    const entries = Object.entries(deputadoStats).sort((a, b) => b[1] - a[1]);

    if (entries.length === 0) {
        container.textContent = 'Sem dados para exibir.';
        return;
    }

    const maxValor = Math.max(...entries.map(e => e[1]));
    container.innerHTML = entries.map(([deputado, valor], index) => {
        const percentage = (valor / maxValor) * 100;
        const nome = deputado.split(' ').slice(0, 2).join(' ');
        return `
            <div class="chart-bar">
                <div class="chart-bar-label">
                    <span class="chart-bar-name">${escapeHtml(nome)}</span>
                    <span class="chart-bar-value">${formatarValor(valor)}</span>
                </div>
                <div class="chart-bar-track">
                    <div class="chart-bar-fill dep-${index % 4}" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    }).join('');
}

function renderAreaChart(data) {
    const container = document.getElementById('areaChart');
    const areaStats = {};

    data.forEach(emenda => {
        areaStats[emenda.area] = (areaStats[emenda.area] || 0) + emenda.valor;
    });

    const entries = Object.entries(areaStats).sort((a, b) => b[1] - a[1]);

    if (entries.length === 0) {
        container.textContent = 'Sem dados para exibir.';
        return;
    }

    const maxValor = Math.max(...entries.map(e => e[1]));
    container.innerHTML = entries.map(([area, valor]) => {
        const percentage = (valor / maxValor) * 100;
        return `
            <div class="chart-bar">
                <div class="chart-bar-label">
                    <span class="chart-bar-name">${areaConfig[area].icon} ${areaConfig[area].label}</span>
                    <span class="chart-bar-value">${formatarValor(valor)}</span>
                </div>
                <div class="chart-bar-track">
                    <div class="chart-bar-fill cat-${area}" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    }).join('');
}

// ---------- Tabela + paginação ----------
function renderTable() {
    const tableBody = document.getElementById('tableBody');
    const emptyState = document.getElementById('emptyState');
    const recordCount = document.getElementById('recordCount');

    recordCount.textContent = `${filteredEmendas.length} ${filteredEmendas.length === 1 ? 'registro' : 'registros'}`;

    if (filteredEmendas.length === 0) {
        tableBody.textContent = '';
        emptyState.style.display = 'block';
        renderPagination();
        return;
    }

    emptyState.style.display = 'none';

    const totalPages = Math.ceil(filteredEmendas.length / PER_PAGE);
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * PER_PAGE;
    const end = start + PER_PAGE;
    const pageData = filteredEmendas.slice(start, end);

    tableBody.textContent = '';
    pageData.forEach(emenda => {
        tableBody.appendChild(createRow(emenda));
    });

    renderPagination();
}

// Cria uma linha da tabela via DOM (evita XSS por innerHTML com dados)
function createRow(emenda) {
    const tr = document.createElement('tr');
    tr.classList.add('table-row-clickable');
    tr.setAttribute('tabindex', '0');
    tr.setAttribute('role', 'button');
    tr.dataset.emendaId = emenda.id;
    tr.setAttribute('aria-label',
        `Emenda ${emenda.numeroEmenda}, ${emenda.deputado}, ${areaConfig[emenda.area].label}, ${formatarValor(emenda.valor)}, ${statusLabels[emenda.status]}`);

    tr.appendChild(createCell('div', 'table-numero', emenda.numeroEmenda));
    tr.appendChild(createCell('div', 'table-deputado', emenda.deputado));
    tr.appendChild(createCell('div', 'table-partido', emenda.partido));
    tr.appendChild(createCell('div', 'table-projeto', emenda.projeto));
    tr.appendChild(createCell('div', 'table-area', `${areaConfig[emenda.area].icon} ${areaConfig[emenda.area].label}`));
    tr.appendChild(createCell('div', 'table-valor', formatarValor(emenda.valor)));

    const tdAno = document.createElement('td');
    tdAno.textContent = emenda.ano;
    tr.appendChild(tdAno);

    // Badge de status
    const tdStatus = document.createElement('td');
    const statusBadge = document.createElement('span');
    statusBadge.className = `table-status status-${emenda.status}`;
    statusBadge.textContent = statusLabels[emenda.status];
    tdStatus.appendChild(statusBadge);
    tr.appendChild(tdStatus);

    return tr;
}

function createCell(tag, className, text) {
    const td = document.createElement('td');
    const inner = document.createElement(tag);
    inner.className = className;
    inner.textContent = text;
    td.appendChild(inner);
    return td;
}

// ---------- Interação das linhas (event delegation + teclado) ----------
function initializeRowInteraction() {
    const tableBody = document.getElementById('tableBody');

    tableBody.addEventListener('click', (e) => {
        const row = e.target.closest('tr[data-emenda-id]');
        if (row) openModal(parseInt(row.dataset.emendaId, 10));
    });

    tableBody.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const row = e.target.closest('tr[data-emenda-id]');
        if (row) {
            e.preventDefault();
            openModal(parseInt(row.dataset.emendaId, 10));
        }
    });
}

// ---------- Paginação ----------
function renderPagination() {
    const paginationControls = document.getElementById('paginationControls');
    const paginationInfo = document.getElementById('paginationInfo');

    const total = filteredEmendas.length;
    const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

    paginationControls.textContent = '';

    if (total === 0) {
        paginationInfo.textContent = 'Nenhum registro';
        return;
    }

    const start = (currentPage - 1) * PER_PAGE + 1;
    const end = Math.min(currentPage * PER_PAGE, total);
    paginationInfo.textContent = `Mostrando ${start}–${end} de ${total} registros`;

    // Botão anterior
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.textContent = '‹';
    prevBtn.setAttribute('aria-label', 'Página anterior');
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => { currentPage--; renderTable(); });
    paginationControls.appendChild(prevBtn);

    // Numeração de páginas (com elipse quando muitas)
    const pages = getPageList(currentPage, totalPages);
    pages.forEach(p => {
        if (p === '...') {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '…';
            ellipsis.style.color = 'var(--text-muted)';
            ellipsis.style.padding = '0 0.25rem';
            paginationControls.appendChild(ellipsis);
            return;
        }
        const btn = document.createElement('button');
        btn.className = 'page-btn' + (p === currentPage ? ' active' : '');
        btn.textContent = p;
        btn.setAttribute('aria-label', `Página ${p}`);
        btn.setAttribute('aria-current', p === currentPage ? 'page' : 'false');
        if (p === currentPage) btn.disabled = true;
        btn.addEventListener('click', () => { currentPage = p; renderTable(); });
        paginationControls.appendChild(btn);
    });

    // Botão próxima
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.textContent = '›';
    nextBtn.setAttribute('aria-label', 'Próxima página');
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => { currentPage++; renderTable(); });
    paginationControls.appendChild(nextBtn);
}

// Lista de páginas a exibir (com elipses)
function getPageList(current, total) {
    const pages = [];
    if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i);
        return pages;
    }
    pages.push(1);
    if (current > 3) pages.push('...');
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
}

// ---------- Modal ----------
function initializeModal() {
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');

    modalClose.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // ESC fecha modal; Tab fica preso dentro do modal
    document.addEventListener('keydown', (e) => {
        const isOpen = modalOverlay.getAttribute('aria-hidden') === 'false';
        if (!isOpen) return;
        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'Tab') {
            trapTab(e, modalOverlay);
        }
    });
}

function openModal(emendaId) {
    const emenda = emendasData.find(e => e.id === emendaId);
    if (!emenda) return;

    const statusClass = `status-${emenda.status}`;

    document.getElementById('modalNumero').textContent = emenda.numeroEmenda;
    document.getElementById('modalDeputado').textContent = emenda.deputado;
    document.getElementById('modalPartido').textContent = emenda.partido;
    document.getElementById('modalArea').textContent = `${areaConfig[emenda.area].icon} ${areaConfig[emenda.area].label}`;

    // Status construído via DOM (sem innerHTML com dados externos)
    const statusContainer = document.getElementById('modalStatus');
    statusContainer.textContent = '';
    const statusBadge = document.createElement('span');
    statusBadge.className = `table-status ${statusClass}`;
    statusBadge.textContent = statusLabels[emenda.status];
    statusContainer.appendChild(statusBadge);

    document.getElementById('modalValor').textContent = formatarValor(emenda.valor);
    document.getElementById('modalAno').textContent = emenda.ano;
    document.getElementById('modalDataAprovacao').textContent = emenda.dataAprovacao;
    document.getElementById('modalProjeto').textContent = emenda.projeto;
    document.getElementById('modalDescricao').textContent = emenda.descricaoCompleta;
    document.getElementById('modalBeneficiarios').textContent = emenda.beneficiarios;

    const modalOverlay = document.getElementById('modalOverlay');
    lastFocusedBeforeModal = document.activeElement;
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Move o foco para dentro do modal
    setTimeout(() => document.getElementById('modalClose').focus(), 0);
}

function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay.getAttribute('aria-hidden') === 'true') return;

    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Devolve o foco ao elemento que abriu o modal
    if (lastFocusedBeforeModal && typeof lastFocusedBeforeModal.focus === 'function') {
        lastFocusedBeforeModal.focus();
    }
}

// Mantém o Tab dentro do modal (foco-trap)
function trapTab(e, container) {
    const focusables = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
}

// ---------- Sidebar (menu mobile) ----------
function initializeSidebar() {
    const menuToggle = document.getElementById('menuToggle');
    const backdrop = document.getElementById('sidebarBackdrop');

    const openSidebar = () => {
        document.body.classList.add('sidebar-open');
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', 'Fechar menu');
    };

    const closeSidebar = () => {
        document.body.classList.remove('sidebar-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
    };

    menuToggle.addEventListener('click', () => {
        if (document.body.classList.contains('sidebar-open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    backdrop.addEventListener('click', closeSidebar);

    // Fecha a sidebar ao escolher um item (mobile)
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => closeSidebar());
    });
}

// ---------- Utilidades ----------
function formatarValor(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(valor);
}

// Escapa texto para uso seguro em templates de HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}
