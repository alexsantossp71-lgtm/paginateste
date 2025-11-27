// Dados das emendas parlamentares - Deputados Federais da Baixada Santista
const emendasData = [
    // Paulo Alexandre Barbosa - PSDB/SP
    {
        id: 1,
        deputado: "Paulo Alexandre Barbosa",
        partido: "PSDB/SP",
        valor: 2000000,
        area: "saude",
        projeto: "Aquisição de equipamentos hospitalares para unidades de saúde de Santos",
        ano: 2024,
        status: "em-execucao"
    },
    {
        id: 2,
        deputado: "Paulo Alexandre Barbosa",
        partido: "PSDB/SP",
        valor: 1500000,
        area: "infraestrutura",
        projeto: "Reforma e modernização de vias públicas na região central de Santos",
        ano: 2024,
        status: "planejamento"
    },
    {
        id: 3,
        deputado: "Paulo Alexandre Barbosa",
        partido: "PSDB/SP",
        valor: 800000,
        area: "educacao",
        projeto: "Construção de quadra poliesportiva coberta em escola municipal",
        ano: 2023,
        status: "concluido"
    },
    {
        id: 4,
        deputado: "Paulo Alexandre Barbosa",
        partido: "PSDB/SP",
        valor: 1200000,
        area: "saude",
        projeto: "Ampliação de Unidade Básica de Saúde no Jardim Castelo",
        ano: 2023,
        status: "concluido"
    },

    // Rosana Valle - PL/SP
    {
        id: 5,
        deputado: "Rosana Valle",
        partido: "PL/SP",
        valor: 3000000,
        area: "saude",
        projeto: "Aquisição de ambulâncias e equipamentos médicos para atendimento de emergência",
        ano: 2024,
        status: "em-execucao"
    },
    {
        id: 6,
        deputado: "Rosana Valle",
        partido: "PL/SP",
        valor: 1800000,
        area: "educacao",
        projeto: "Reforma e adequação de escolas municipais com acessibilidade",
        ano: 2024,
        status: "em-execucao"
    },
    {
        id: 7,
        deputado: "Rosana Valle",
        partido: "PL/SP",
        valor: 2500000,
        area: "infraestrutura",
        projeto: "Pavimentação e drenagem em vias públicas da Zona Noroeste",
        ano: 2023,
        status: "concluido"
    },
    {
        id: 8,
        deputado: "Rosana Valle",
        partido: "PL/SP",
        valor: 1000000,
        area: "cultura",
        projeto: "Revitalização de espaços culturais e centro comunitário",
        ano: 2024,
        status: "planejamento"
    },
    {
        id: 9,
        deputado: "Rosana Valle",
        partido: "PL/SP",
        valor: 2200000,
        area: "saude",
        projeto: "Modernização de equipamentos do Hospital Guilherme Álvaro",
        ano: 2023,
        status: "concluido"
    },

    // Delegado da Cunha - Podemos/SP
    {
        id: 10,
        deputado: "Delegado da Cunha",
        partido: "Podemos/SP",
        valor: 1500000,
        area: "infraestrutura",
        projeto: "Implantação de sistema de videomonitoramento urbano",
        ano: 2024,
        status: "em-execucao"
    },
    {
        id: 11,
        deputado: "Delegado da Cunha",
        partido: "Podemos/SP",
        valor: 900000,
        area: "educacao",
        projeto: "Equipamentos de informática e tecnologia para escolas públicas",
        ano: 2024,
        status: "planejamento"
    },
    {
        id: 12,
        deputado: "Delegado da Cunha",
        partido: "Podemos/SP",
        valor: 1800000,
        area: "saude",
        projeto: "Aquisição de equipamentos médicos para unidades de pronto atendimento",
        ano: 2024,
        status: "em-execucao"
    },
    {
        id: 13,
        deputado: "Delegado da Cunha",
        partido: "Podemos/SP",
        valor: 750000,
        area: "infraestrutura",
        projeto: "Reforma de praças e áreas de lazer em bairros periféricos",
        ano: 2023,
        status: "concluido"
    },
    {
        id: 14,
        deputado: "Delegado da Cunha",
        partido: "Podemos/SP",
        valor: 1100000,
        area: "cultura",
        projeto: "Reforma de biblioteca municipal e aquisição de acervo",
        ano: 2024,
        status: "planejamento"
    }
];

// Configuração de áreas
const areaConfig = {
    saude: { label: 'Saúde', icon: '🏥' },
    educacao: { label: 'Educação', icon: '📚' },
    infraestrutura: { label: 'Infraestrutura', icon: '🏗️' },
    cultura: { label: 'Cultura', icon: '🎭' }
};

// Estado da aplicação
let filteredEmendas = [...emendasData];
let currentFilter = 'all';
let searchTerm = '';

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
    initializeSearch();
    updateKPIs();
    renderCharts();
    renderTable();
});

// Configurar filtros
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

// Configurar busca
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value.toLowerCase();
        applyFilters();
    });
}

// Aplicar filtros
function applyFilters() {
    filteredEmendas = emendasData.filter(emenda => {
        const matchesFilter = currentFilter === 'all' || emenda.area === currentFilter;
        const matchesSearch = searchTerm === '' ||
            emenda.deputado.toLowerCase().includes(searchTerm) ||
            emenda.partido.toLowerCase().includes(searchTerm) ||
            emenda.projeto.toLowerCase().includes(searchTerm) ||
            areaConfig[emenda.area].label.toLowerCase().includes(searchTerm);

        return matchesFilter && matchesSearch;
    });

    renderTable();
}

// Atualizar KPIs
function updateKPIs() {
    const totalEmendas = emendasData.length;
    const totalDeputados = new Set(emendasData.map(e => e.deputado)).size;
    const totalValor = emendasData.reduce((sum, e) => sum + e.valor, 0);
    const totalExecucao = emendasData.filter(e => e.status === 'em-execucao').length;

    document.getElementById('totalEmendas').textContent = totalEmendas;
    document.getElementById('totalDeputados').textContent = totalDeputados;
    document.getElementById('totalValor').textContent = formatarValor(totalValor);
    document.getElementById('totalExecucao').textContent = totalExecucao;
}

// Renderizar gráficos
function renderCharts() {
    renderDeputadoChart();
    renderAreaChart();
}

// Gráfico de distribuição por deputado
function renderDeputadoChart() {
    const deputadoStats = {};

    emendasData.forEach(emenda => {
        if (!deputadoStats[emenda.deputado]) {
            deputadoStats[emenda.deputado] = 0;
        }
        deputadoStats[emenda.deputado] += emenda.valor;
    });

    const maxValor = Math.max(...Object.values(deputadoStats));
    const chartHtml = Object.entries(deputadoStats)
        .sort((a, b) => b[1] - a[1])
        .map(([deputado, valor]) => {
            const percentage = (valor / maxValor) * 100;
            const nome = deputado.split(' ').slice(0, 2).join(' ');
            return `
                <div class="chart-bar">
                    <div class="chart-bar-label">
                        <span class="chart-bar-name">${nome}</span>
                        <span class="chart-bar-value">${formatarValor(valor)}</span>
                    </div>
                    <div class="chart-bar-track">
                        <div class="chart-bar-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        }).join('');

    document.getElementById('deputadoChart').innerHTML = chartHtml;
}

// Gráfico de distribuição por área
function renderAreaChart() {
    const areaStats = {};

    emendasData.forEach(emenda => {
        if (!areaStats[emenda.area]) {
            areaStats[emenda.area] = 0;
        }
        areaStats[emenda.area] += emenda.valor;
    });

    const maxValor = Math.max(...Object.values(areaStats));
    const chartHtml = Object.entries(areaStats)
        .sort((a, b) => b[1] - a[1])
        .map(([area, valor]) => {
            const percentage = (valor / maxValor) * 100;
            return `
                <div class="chart-bar">
                    <div class="chart-bar-label">
                        <span class="chart-bar-name">${areaConfig[area].icon} ${areaConfig[area].label}</span>
                        <span class="chart-bar-value">${formatarValor(valor)}</span>
                    </div>
                    <div class="chart-bar-track">
                        <div class="chart-bar-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        }).join('');

    document.getElementById('areaChart').innerHTML = chartHtml;
}

// Renderizar tabela
function renderTable() {
    const tableBody = document.getElementById('tableBody');
    const emptyState = document.getElementById('emptyState');
    const recordCount = document.getElementById('recordCount');

    recordCount.textContent = `${filteredEmendas.length} registros`;

    if (filteredEmendas.length === 0) {
        tableBody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    const tableHtml = filteredEmendas.map(emenda => {
        const statusClass = `status-${emenda.status}`;
        const statusLabels = {
            'em-execucao': 'Em Execução',
            'concluido': 'Concluído',
            'planejamento': 'Planejamento'
        };

        return `
            <tr>
                <td>
                    <div class="table-deputado">${emenda.deputado}</div>
                </td>
                <td>
                    <div class="table-partido">${emenda.partido}</div>
                </td>
                <td>
                    <div class="table-projeto">${emenda.projeto}</div>
                </td>
                <td>
                    <div class="table-area">${areaConfig[emenda.area].icon} ${areaConfig[emenda.area].label}</div>
                </td>
                <td>
                    <div class="table-valor">${formatarValor(emenda.valor)}</div>
                </td>
                <td>${emenda.ano}</td>
                <td>
                    <span class="table-status ${statusClass}">${statusLabels[emenda.status]}</span>
                </td>
            </tr>
        `;
    }).join('');

    tableBody.innerHTML = tableHtml;
}

// Formatar valores monetários
function formatarValor(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(valor);
}
