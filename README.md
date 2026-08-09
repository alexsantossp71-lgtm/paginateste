# Dashboard de Emendas Parlamentares — Santos/SP

Dashboard para monitoramento de emendas parlamentares dos deputados federais da
Baixada Santista destinadas a Santos/SP — incluindo **execução financeira**,
filtros reativos, gráficos SVG, paginação, estado na URL, exportação e temas
claro/escuro.

![Stack](https://img.shields.io/badge/stack-HTML%2FCSS%2FJS%20(modules)-00ff88)
![Tests](https://img.shields.io/badge/testes-node--test-00ff88)

## ✨ Funcionalidades

- **Dados externos** carregados via `fetch` (`data/emendas.json`) com **validação**,
  estados de **loading/erro** e indicação de **fonte e data**.
- **KPIs** reativos aos filtros: total de emendas, deputados, valor total, em
  execução e **taxa de execução financeira** (% pago sobre o total).
- **Execução financeira** por emenda (empenhado / liquidado / pago + %), com
  barra de progresso na tabela e no modal.
- **3 gráficos SVG** interativos e acessíveis: barras por deputado, **donut** por
  área e **linha** de evolução anual — clicáveis para filtrar, com `% do total`
  e tooltips.
- **Tabela** com ordenação por coluna, **paginação**, busca com debounce e
  linhas acessíveis por teclado.
- **Filtros**: área (chips), status, ano e deputado (selects) + busca textual.
- **Modal** de detalhe com navegação **‹/›**, foco-trap, `inert` no fundo e
  restauração de foco.
- **Estado na URL** (filtros, página, ordenação) — compartilhável e restaurável.
- **Exportação CSV** da lista filtrada + **Imprimir / Salvar como PDF**.
- **Acessibilidade**: navegação por teclado, ARIA, contraste WCAG AA,
  `prefers-reduced-motion`, skip-link, menu mobile.
- **Temas claro/escuro** com persistência (respeita `prefers-color-scheme`).

## 🚀 Como rodar

Os dados são carregados via `fetch`, então é necessário um servidor estático
(não funciona via `file://`).

```bash
# Python 3
python3 -m http.server 8000
# acesse http://localhost:8000

# ou Node
npx serve
```

> Abriu via `file://`? O app mostra um erro amigável com o comando do servidor.

## 🛠️ Desenvolvimento

```bash
npm run test     # testes da lógica pura (node:test, zero dependências)
npm run lint     # ESLint (requer npm install)
npm run serve    # atalho para o servidor estático
```

## 📁 Estrutura

```
.
├── index.html              # marcação + sprite de ícones SVG
├── style.css               # temas, gráficos, responsivo, impressão
├── data/
│   └── emendas.json        # dados + metadados (fonte, data da captura)
├── js/
│   ├── main.js             # orquestra carga, estado e render
│   ├── state.js            # store centralizado (pub/sub)
│   ├── data.js             # fetch + validação + loading/erro
│   ├── logic.js            # funções puras (filtro, ordenação, KPIs, CSV, URL)
│   ├── dom.js              # helpers de DOM/SVG
│   ├── kpis.js             # render dos KPIs
│   ├── filters.js          # chips, selects, busca, sincronização
│   ├── charts.js           # barras, donut, linha (SVG)
│   ├── table.js            # tabela + paginação + ordenação
│   ├── modal.js            # modal + navegação + foco
│   ├── export.js           # CSV + impressão
│   ├── theme.js            # tema claro/escuro
│   └── sidebar.js          # menu mobile
├── test/
│   └── logic.test.mjs      # testes da lógica (node:test)
├── eslint.config.js        # config flat do ESLint
├── .github/workflows/ci.yml # CI (testes + lint)
└── CRITICA.md              # avaliação + histórico de correções
```

## 🏗️ Arquitetura

- **Camada de domínio pura** (`logic.js`): filtragem, ordenação, paginação,
  KPIs, execução financeira, agrupamentos, CSV e serialização de URL — sem
  depender de DOM, o que permite testá-las diretamente em Node.
- **Store centralizado** (`state.js`) com pub/sub: os módulos de UI reagem a
  mudanças de estado.
- **Render via DOM/`textContent`** (não `innerHTML` com dados) para evitar XSS
  quando os dados passarem a vir de uma API real.
- **Sem build**: módulos ES nativos (`<script type="module">`) servidos direto.

## 🔌 Trocar por uma API real

Substitua o `fetch` em `js/data.js` pelo endpoint desejado, mantendo o formato
`{ meta: {...}, emendas: [...] }`. A validação em `logic.js` (`validateData`)
garante que campos inválidos não quebrem a renderização.

## 📄 Licença

Projeto de exemplo/demonstração.
