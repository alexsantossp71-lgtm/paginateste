# Crítica / Avaliação do projeto `paginateste`

**Projeto:** Dashboard de Emendas Parlamentares — Baixada Santista
**Stack:** HTML + CSS + JavaScript vanilla (sem build, sem framework)
**Data:** 2026-08-08

---

## 1. Visão geral

É um dashboard escuro ("dark mode") com sidebar, KPIs, dois gráficos de barras horizontais, filtros por área, busca textual e uma tabela clicável que abre um modal de detalhamento. Visualmente é coerente, com tipografia monoespaçada (IBM Plex Mono) para números e Inter para texto. A estrutura de código é legível e separa dados/estado/renderização de forma razoável para um protótipo.

Como **protótipo/demo**, cumpre o papel. Como **produto**, tem problemas sérios — alguns são bugs que já quebram o layout hoje. Abaixo, do mais grave ao mais cosmetic.

---

## 2. Bugs concretos (quebram agora)

### 2.1 CSS inválido — bloco órfão fora de `@media` 🔴
No final de `style.css` existe:

```css
.data-table td { ... }

margin-left: 200px;      /* ← sem seletor, CSS inválido */
}

.charts-grid {
    grid-template-columns: 1fr;   /* ← aplica GLOBALMENTE, não só em tela pequena */
}
}
```

Faltou a abertura `@media (max-width: 1024px) {` (ou similar). Consequências:
- `margin-left: 200px;` é descartado pelo parser (regra inválida).
- O `.charts-grid { grid-template-columns: 1fr; }` **não está dentro de media query**, então os dois gráficos sempre empilham em uma coluna, mesmo em telas largas — derrota o `repeat(auto-fit, minmax(400px, 1fr))` definido acima.
- Há chaves `}` sobrando, o que pode desalinhar o parsing das regras seguintes.

**Correção:** envolver o bloco num `@media (max-width: 1024px) { ... }` e remover a `margin-left: 200px;` órfã (provavelmente pertencia ao `.main-content` num breakpoint intermediário).

### 2.2 O nome do repo é `paginateste` — mas **não há paginação** 🔴
`grep` por `pagin/perPage/offset/page-size` retorna **zero** ocorrências. A tabela renderiza o array inteiro de uma vez. Para 14 registros tudo bem; para o volume real de emendas parlamentares (centenas/milhares), a tabela vai travar e a busca vai varrer tudo a cada keystroke. O nome do projeto promete um recurso que não existe.

### 2.3 Arquivo lixo `1.html`
Contém só `1.` (2 bytes). Provavelmente um teste descartado. Deletar.

### 2.4 Typos nos dados
Em `script.js`:
- `id: 1` → `"equip amentos de UTI"` (espaço no meio de "equipamentos")
- `id: 4` → `"atend imento odontológico"` (espaço no meio de "atendimento")

São dados mock, mas aparecem no modal de detalhe — ficam visíveis ao usuário.

---

## 3. Arquitetura / funcionalidade

### 3.1 KPIs ignoram os filtros
`updateKPIs()` lê de `emendasData` (dataset completo), não de `filteredEmendas`. Filtrar por "Saúde" ou buscar "Rosana" muda a tabela, mas os 4 cartões no topo continuam mostrando os totais globais. Isso confunde — ou o usuário espera que os KPIs reflitam o filtro, ou então os filtros deveriam deixar claro que atuam só na tabela. Hoje é silenciosamente inconsistente.

### 3.2 Gráficos também ignoram filtros
Mesma questão: `renderDeputadoChart()`/`renderAreaChart()` sempre leem `emendasData`. Filtros e gráficos são mundos separados.

### 3.3 `statusLabels` duplicado
O objeto de tradução de status aparece idêntico em `renderTable()` e `openModal()`. Deveria ser uma constante única (`const statusLabels = {...}`) junto com `areaConfig`. Hoje, mudar um rótulo exige editar dois lugares — fácil esquecer.

### 3.4 Tendências dos KPIs são "hardcoded" e podem mentir
`"+2 este ano"`, `"+15% vs 2023"`, `"3 ativos"`, `"Projetos ativos"` são literais no HTML, não derivam dos dados. Com 14 emendas e 3 deputados, "DEPUTADOS → 3 ativos" até bate por coincidência, mas "TOTAL EMENDAS → +2 este ano" não tem base em comparação ano-a-ano real. Em um dashboard de governo, números hardcoded que não casam com os dados abaixo minam a credibilidade.

### 3.5 Sem ordenação de colunas
A tabela não é ordenável por coluna (valor, ano, deputado...). Em uma lista de emendas, ordenar por valor decrescente é expectativa básica.

### 3.6 Sem debounce na busca
`'input'` dispara `applyFilters()` a cada tecla. Com mais dados, vale um debounce de ~200ms.

### 3.7 Listeners recriados a cada render
`renderTable()` faz `document.querySelectorAll('.table-row-clickable').forEach(... addEventListener ...)` depois de reescrever `innerHTML`. Funciona (os elementos velhos são descartados), mas é ineficiente e frágil. Melhor: **event delegation** no `<tbody>` único, lendo `data-emenda-id` do `e.target.closest('tr')`.

---

## 4. Acessibilidade (a11y)

Esta é a área mais fraca:

- **Linhas da tabela não são acessíveis por teclado.** São `<tr>` com `click` mas sem `tabindex`, `role="button"` ou handler de `Enter`/`Space`. Usuário de teclado/leitor de tela não consegue abrir o modal.
- **Modal sem foco-trap.** Abre, mas o foco não se move para dentro nem volta ao elemento que o abriu ao fechar. `Tab` escapa para trás do overlay.
- **Botão de fechar do modal** é `×` em texto, sem `aria-label="Fechar"`.
- **Sidebar some no mobile** (`transform: translateX(-100%)`) mas **não existe botão de menu/hambúrguer** para reabri-la. Em ≤768px a navegação fica inacessível.
- **Tabela em mobile** não tem wrapper com scroll horizontal nem vira cards — 8 colunas em 375px de largura espreme tudo.
- **Contraste:** `--text-muted: #6a6a6a` sobre `--bg-secondary: #121212` fica em torno de 3.6:1 — abaixo do 4.5:1 do WCAG AA para texto pequeno. Rótulos de KPI e `record-count` usam essa cor.
- **Ícones são emojis** (📊🏥📚). Emojis dependem da fonte do sistema, variam de plataforma e não têm texto alternativo. Para um produto sério, ícones SVG com `aria-hidden` + label de texto são mais consistentes.
- Sem `lang` no `<html>`? Tem (`pt-BR`), isso está bom. Sem `skip-link`, sem `aria-live` para o contador de registros ao filtrar.

---

## 5. Segurança / robustez

- **`innerHTML` com interpolação de dados.** Hoje o dataset é hardcoded, então não há XSS prático. Mas o padrão está plantado: se um dia os dados vierem de uma API (nomes de deputados/projetos são strings livremente editáveis no mundo real), qualquer campo vira vetor de XSS. Já `openModal` mistura `innerHTML` (status) com `textContent` (demais) — sinal de que a escolha não foi consciente. **Recomendar `textContent` em tudo** e construir elementos via DOM, ou ao menos uma função de escape.
- Sem CSP, sem SRI nos fonts do Google. Aceitável para demo, não para produção.

---

## 6. Visual / UX

- **Gráficos monocromáticos:** todas as barras usam `--accent-primary` (verde). Não há cor por deputado nem por área, nem legenda. Distinguir "Paulo" de "Rosana" só pelo rótulo. Cor codificada por categoria ajudaria muito.
- **Barras proporcionais ao máximo, não ao total.** A barra maior sempre enche 100%, então o leitor não percebe a magnitude relativa ao conjunto — só quem está em primeiro. Mostrar `% do total` (ou valor absoluto com eixo) é mais honesto.
- **Sem estados de loading/erro** (hoje não há fetch, então ok — mas ao plugar dados reais vai faltar).
- **`Última atualização: Hoje`** é literal. Hardcoded.
- O modal usa `display: flex` via JS inline; poderia ser uma classe `.is-open`, mais limpo e animável.

---

## 7. Organização do projeto

- Sem `README.md`, sem descrição de como rodar (basta abrir `index.html`, mas deveria estar escrito).
- Sem `.gitignore` (não há necessidade real aqui, mas é bom hábito).
- Os três arquivos soltos na raiz (`index.html`, `script.js`, `style.css`) funcionam para este tamanho; se crescer, separar `data/`, `js/`, `css/`.
- Commit único (`42057e5`) com mensagem genérica. Histórico não ajuda a entender a evolução.

---

## 8. Prioridades de correção (sugerido)

| # | Item | Severidade | Esforço |
|---|------|-----------|---------|
| 1 | Corrigir CSS órfão / restaurar `@media` do breakpoint intermediário | 🔴 Alta | 5 min |
| 2 | Implementar paginação (nome do projeto exige) | 🔴 Alta | ~1 h |
| 3 | Deletar `1.html` | 🟡 Média | 1 min |
| 4 | Corrigir typos nos dados (`equip amentos`, `atend imento`) | 🟡 Média | 1 min |
| 5 | KPIs + gráficos reagirem aos filtros (ou documentar que são fixos) | 🟡 Média | 30 min |
| 6 | Extrair `statusLabels` para constante única | 🟢 Baixa | 5 min |
| 7 | Tabela: ordenação por coluna + event delegation | 🟡 Média | 45 min |
| 8 | Acessibilidade: linhas clicáveis via teclado, foco-trap do modal, `aria-label` no fechar, botão de menu mobile, contraste do `--text-muted` | 🟡 Média | 1–2 h |
| 9 | Trocar `innerHTML` por `textContent`/DOM | 🟡 Média | 30 min |
| 10 | Tabela responsiva em mobile (scroll horizontal ou cards) | 🟡 Média | 30 min |
| 11 | Cores por categoria nos gráficos + legenda | 🟢 Baixa | 30 min |
| 12 | Debounce na busca | 🟢 Baixa | 10 min |
| 13 | Tendências dos KPIs derivadas dos dados (ou remover) | 🟢 Baixa | 20 min |
| 14 | Adicionar `README.md` | 🟢 Baixa | 10 min |

---

## 9. Resumo

> Visual limpo e código legível para um protótipo, mas **há um bug de CSS que já empilha os gráficos em uma coluna em qualquer tela**, o **nome do projeto (`paginateste`) promete paginação que não existe**, e a **acessibilidade está bem aquém do mínimo** (linhas não navegáveis por teclado, modal sem foco-trap, sidebar sumindo no mobile sem botão para reabrir, contraste abaixo de WCAG AA). KPIs e gráficos ignoram os filtros, criando inconsistência silenciosa. O padrão de `innerHTML` com dados é uma bomba(relógio) de XSS assim que os dados saírem do hardcoded. Nada disso é difícil de consertar — a lista acima é toda factível em menos de um dia.

---

## 10. Correções aplicadas (2026-08-08)

Todas as 14 prioridades da seção 8 foram tratadas:

| # | Item | Status | Detalhe |
|---|------|--------|---------|
| 1 | CSS órfão / `@media` intermediário | ✅ | Recriado `@media (max-width: 1024px)` com `.main-content` e `.charts-grid`; removida a `margin-left: 200px;` órfã e as chaves soltas |
| 2 | Paginação | ✅ | Implementada (`PER_PAGE=8`) com controles anterior/próxima, numeração com elipse, info "Mostrando X–Y de Z" e `aria-current` |
| 3 | Deletar `1.html` | ✅ | Removido |
| 4 | Typos nos dados | ✅ | `equip amentos`→`equipamentos`, `atend imento`→`atendimento` |
| 5 | KPIs + gráficos reativos aos filtros | ✅ | `updateKPIs(filteredEmendas)` e `renderCharts(filteredEmendas)` chamados a cada filtro/busca |
| 6 | `statusLabels` como constante única | ✅ | Extraído para o topo; `statusOrder` adicionado para ordenação |
| 7 | Ordenação por coluna + event delegation | ✅ | Cabeçalhos `th.sortable` com `data-sort`, `aria-sort`, indicadores ↑/↓, comparador numérico/texto/status; listener único no `<tbody>` |
| 8 | Acessibilidade | ✅ | Linhas `tabindex=0`/`role=button`/`aria-label` + Enter/Space abre modal; modal com `role=dialog`/`aria-modal`/`aria-labelledby`, **foco-trap** de Tab e **retorno de foco** ao fechar; botão fechar com `aria-label`; botão **menu mobile** (☰) + backdrop para reabrir a sidebar; `--text-muted` de `#6a6a6a`→`#8b8b8b` (WCAG AA); skip-link; ícones com `aria-hidden` |
| 9 | `innerHTML` → `textContent`/DOM | ✅ | Linhas criadas via `document.createElement` + `textContent`; modal via DOM; gráficos usam `escapeHtml()` para os nomes |
| 10 | Tabela responsiva em mobile | ✅ | Wrapper `.table-scroll` com `overflow-x:auto`; modal-grid vira 1 coluna no mobile |
| 11 | Cores por categoria nos gráficos | ✅ | Variáveis `--cat-*` + classes `.chart-bar-fill.cat-*` (área) e `.dep-N` (deputado) |
| 12 | Debounce na busca | ✅ | `debounce(fn, 200)` no evento `input` |
| 13 | Tendências dos KPIs derivadas | ✅ | "N em {ano recente}", "{X} áreas", "Média: R$ …", "N concluídas" — todas calculadas dos dados filtrados |
| 14 | `README.md` | ⬜ | Não incluído nesta rodada (opcional) |

**Validação:** sintaxe JS verificada (`node --check`), chaves do CSS balanceadas, e um teste de runtime em jsdom confirmou KPIs reativos, paginação, ordenação, filtros, busca com debounce, abertura/fecho do modal e atributos de acessibilidade — todos passando.

**Pontos de atenção restantes (não bloqueantes):**
- Ícones ainda são emojis (dependem da fonte do sistema); para consistência total, trocar por SVGs.
- Sem fetch/estado de loading/erro (ainda não há dados externos).
- Histórico do Git segue com commit único.

---

## 11. Evolução de protótipo para produto (2026-08-08, 2ª rodada)

Aplicados **todos** os pontos de melhoria listados na seção 9. O projeto foi
reescrito em módulos ES com separação de dados, lógica pura e UI.

### Dados e fontes
- ✅ Dados movidos para `data/emendas.json` (separados do código) e carregados via **`fetch`**.
- ✅ **Metadados** com fonte e data da captura exibidos no topo ("Fonte: … · Atualizado: …") — não mais hardcoded.
- ✅ **Validação de schema** (`validateData`/`validateEmenda`) rejeita dados inválidos antes de renderizar.
- ✅ Escopo corrigido: "Santos/SP" no lugar de "Baixada Santista" (os dados são só de Santos).
- ⚠️ A fonte real (Portal da Transparência / Câmara) ainda é demonstração — o `fetch` em `js/data.js` é o ponto único para trocar por uma API.

### Funcionalidades de produto
- ✅ **Execução financeira**: campos empenhado/liquidado/pago + `% executado` por emenda, com barra de progresso na tabela, no modal e KPI de **taxa de execução**.
- ✅ **Exportar CSV** da lista filtrada (com BOM UTF-8) e **Imprimir / Salvar como PDF** (`@media print`).
- ✅ **Evolução temporal**: novo gráfico de **linha** (valor por ano).
- ✅ **Filtros por status, ano e deputado** (selects), além de área (chips) e busca.
- ✅ **Navegação ‹/›** entre emendas no modal (teclado: ←/→).
- ✅ **Estado na URL** (`history.replaceState`): filtros, página e ordenação compartilháveis/restauráveis.
- ✅ Links mortos da sidebar marcados como **"em breve"** (`aria-disabled`, `tabindex="-1"`).

### Gráficos
- ✅ **Interatividade**: tooltips (`title`) e **clique/teclado para filtrar** em barras, donut e legenda.
- ✅ **Acessibilidade**: `role="img"` + `aria-label` com resumo textual em cada gráfico.
- ✅ **Variedade**: barras, **donut** (área) e **linha** (evolução).
- ✅ **Proporção honesta**: rótulos mostram **`% do total`** (não só relativo ao máximo).
- ✅ Cor por categoria/deputado **+ legenda com rótulos** (não só cor).

### Escala/performance
- ✅ **Memoização** do conjunto filtrado/ordenado (evita recálculo a cada render).
- ✅ `font-display=swap` via `preconnect` (fontes do Google não bloqueiam tanto).

### Acessibilidade
- ✅ **Ícones em SVG** (sprite + `<use>`) substituindo emojis — consistentes em qualquer plataforma.
- ✅ **`inert`** no conteúdo atrás do modal (fora do AT e da tab order).
- ✅ **`prefers-reduced-motion`** respeitado (transições/animações desativadas).

### Arquitetura/qualidade
- ✅ **Modularização em ES modules** (`js/` — 13 módulos: domínio, store, dados, UI).
- ✅ **Estado centralizado** com pub/sub (`state.js`).
- ✅ **Lógica pura isolada** (`logic.js`) e **testada** — 26 testes em `node:test` (zero deps).
- ✅ **ESLint** (flat config) + **CI no GitHub Actions** (testes + lint).
- ⚠️ **TypeScript não adotado** deliberadamente: exigiria um passo de build, quebrando a natureza "sem build" do projeto. Em vez disso, a lógica pura recebeu **JSDoc com tipos** (cheque de tipos no editor sem build).

### UX/visual
- ✅ **Toggle claro/escuro** com persistência (`localStorage`) e respeito a `prefers-color-scheme`.
- ✅ **Stylesheet de impressão** (`@media print`) — oculta sidebar/filtros/paginação.
- ✅ **Estados de loading/erro** com botão "Tentar novamente".

### Validação
- `node --test`: **26/26** testes da lógica pura passando (zero dependências).
- **ESLint**: 0 erros, 0 avisos.
- **Smoke test de runtime** (jsdom + fetch polyfill): **41/41** verificações ponta-a-ponta — KPIs, execução financeira, tabela paginada, 3 gráficos SVG, filtros reativos, ordenação, modal com ‹/› e `inert`, estado na URL, export CSV e empty state.
