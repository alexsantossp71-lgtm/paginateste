// Dados de demonstração das emendas parlamentares
const emendasData = [
    {
        id: 1,
        deputado: "Maria Silva",
        partido: "PT/SP",
        valor: 2500000,
        area: "saude",
        projeto: "Modernização do Hospital Ana Costa com aquisição de equipamentos de UTI e reforma da ala de emergência",
        ano: 2024,
        status: "em-execucao"
    },
    {
        id: 2,
        deputado: "João Santos",
        partido: "PSDB/SP",
        valor: 1800000,
        area: "educacao",
        projeto: "Construção de nova creche no bairro Rádio Clube com capacidade para 200 crianças e infraestrutura completa",
        ano: 2024,
        status: "planejamento"
    },
    {
        id: 3,
        deputado: "Ana Paula Costa",
        partido: "PSOL/SP",
        valor: 3200000,
        area: "infraestrutura",
        projeto: "Revitalização da Av. Ana Costa incluindo nova pavimentação, ciclovias e paisagismo urbano",
        ano: 2023,
        status: "concluido"
    },
    {
        id: 4,
        deputado: "Carlos Eduardo Lima",
        partido: "PP/SP",
        valor: 950000,
        area: "cultura",
        projeto: "Restauração do Teatro Coliseu Santista e modernização do sistema de som e iluminação",
        ano: 2024,
        status: "em-execucao"
    },
    {
        id: 5,
        deputado: "Fernanda Oliveira",
        partido: "PDT/SP",
        valor: 1500000,
        area: "saude",
        projeto: "Ampliação da UBS do Jardim Castelo com novos consultórios e sala de vacinas climatizada",
        ano: 2024,
        status: "planejamento"
    },
    {
        id: 6,
        deputado: "Roberto Mendes",
        partido: "MDB/SP",
        valor: 2100000,
        area: "educacao",
        projeto: "Reforma completa de 5 escolas municipais com adequação à acessibilidade e novas salas de informática",
        ano: 2023,
        status: "concluido"
    },
    {
        id: 7,
        deputado: "Juliana Rodrigues",
        partido: "NOVO/SP",
        valor: 1750000,
        area: "infraestrutura",
        projeto: "Implementação de novo sistema de drenagem no bairro Aparecida para combate a enchentes",
        ano: 2024,
        status: "em-execucao"
    },
    {
        id: 8,
        deputado: "Paulo Henrique",
        partido: "PL/SP",
        valor: 850000,
        area: "cultura",
        projeto: "Criação de centro cultural no Morro da Penha com biblioteca comunitária e espaço multiuso",
        ano: 2024,
        status: "planejamento"
    },
    {
        id: 9,
        deputado: "Beatriz Almeida",
        partido: "PSB/SP",
        valor: 2800000,
        area: "saude",
        projeto: "Instalação de tomógrafo e ressonância magnética no Hospital Guilherme Álvaro",
        ano: 2023,
        status: "concluido"
    },
    {
        id: 10,
        deputado: "Ricardo Ferreira",
        partido: "CIDADANIA/SP",
        valor: 1200000,
        area: "infraestrutura",
        projeto: "Construção de novo viaduto no Canal 4 para melhorar o trânsito da região",
        ano: 2024,
        status: "em-execucao"
    },
    {
        id: 11,
        deputado: "Mariana Campos",
        partido: "REDE/SP",
        valor: 980000,
        area: "educacao",
        projeto: "Implantação de laboratórios de ciências em 8 escolas estaduais da cidade",
        ano: 2024,
        status: "planejamento"
    },
    {
        id: 12,
        deputado: "José Carlos Pinto",
        partido: "PV/SP",
        valor: 1650000,
        area: "cultura",
        projeto: "Revitalização do Aquário Municipal com novos tanques e centro de educação ambiental",
        ano: 2024,
        status: "em-execucao"
    }
];

// Ícones e labels das áreas
const areaConfig = {
    saude: {
        icon: '🏥',
        label: 'Saúde',
        color: '#ef4444'
    },
    educacao: {
        icon: '📚',
        label: 'Educação',
        color: '#3b82f6'
    },
    infraestrutura: {
        icon: '🏗️',
        label: 'Infraestrutura',
        color: '#f59e0b'
    },
    cultura: {
        icon: '🎭',
        label: 'Cultura',
        color: '#8b5cf6'
    }
};

// Estado da aplicação
let filteredEmendas = [...emendasData];
let currentFilter = 'all';
let searchTerm = '';

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
    initializeSearch();
    updateStats();
    renderEmendas();
});

// Configurar filtros
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
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

// Aplicar filtros e busca
function applyFilters() {
    filteredEmendas = emendasData.filter(emenda => {
        // Filtro por área
        const matchesFilter = currentFilter === 'all' || emenda.area === currentFilter;
        
        // Filtro por busca
        const matchesSearch = searchTerm === '' || 
            emenda.deputado.toLowerCase().includes(searchTerm) ||
            emenda.partido.toLowerCase().includes(searchTerm) ||
            areaConfig[emenda.area].label.toLowerCase().includes(searchTerm) ||
            emenda.projeto.toLowerCase().includes(searchTerm);
        
        return matchesFilter && matchesSearch;
    });
    
    renderEmendas();
}

// Renderizar emendas
function renderEmendas() {
    const grid = document.getElementById('emendasGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (filteredEmendas.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    grid.innerHTML = filteredEmendas.map((emenda, index) => {
        const area = areaConfig[emenda.area];
        const statusLabels = {
            'em-execucao': 'Em Execução',
            'concluido': 'Concluído',
            'planejamento': 'Planejamento'
        };
        
        return `
            <div class="emenda-card" style="animation-delay: ${index * 0.05}s">
                <div class="emenda-header">
                    <div class="deputado-info">
                        <h3>${emenda.deputado}</h3>
                        <span class="partido-tag">${emenda.partido}</span>
                    </div>
                    <div class="valor-badge">${formatarValor(emenda.valor)}</div>
                </div>
                
                <div class="emenda-body">
                    <div class="area-tag">
                        <span class="area-icon">${area.icon}</span>
                        <span>${area.label}</span>
                    </div>
                    <p class="projeto-desc">${emenda.projeto}</p>
                </div>
                
                <div class="emenda-footer">
                    <span class="ano-tag">Ano: ${emenda.ano}</span>
                    <span class="status-tag ${emenda.status}">${statusLabels[emenda.status]}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Atualizar estatísticas
function updateStats() {
    const totalEmendas = emendasData.length;
    const totalDeputados = new Set(emendasData.map(e => e.deputado)).size;
    const totalValor = emendasData.reduce((sum, e) => sum + e.valor, 0);
    
    // Animação dos números
    animateValue('totalEmendas', 0, totalEmendas, 1000);
    animateValue('totalDeputados', 0, totalDeputados, 1000);
    
    const valorElement = document.getElementById('totalValor');
    let currentValue = 0;
    const increment = totalValor / 60;
    const duration = 1500;
    const stepTime = duration / 60;
    
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= totalValor) {
            currentValue = totalValor;
            clearInterval(timer);
        }
        valorElement.textContent = formatarValor(currentValue);
    }, stepTime);
}

// Animar valores numéricos
function animateValue(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
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
