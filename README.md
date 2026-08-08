# Dashboard de Emendas Parlamentares — Baixada Santista

Dashboard estático para monitoramento de emendas parlamentares dos deputados
federais da Baixada Santista destinadas a Santos/SP.

![Stack](https://img.shields.io/badge/stack-HTML%2FCSS%2FJS%20vanilla-00ff88)
![Status](https://img.shields.io/badge/status-corrigido-00ff88)

## ✨ Funcionalidades

- **KPIs** (total de emendas, deputados, valor total, em execução) com tendências
  derivadas dos dados e reativas aos filtros.
- **Gráficos de barras** com distribuição por deputado e por área, com cores
  por categoria.
- **Tabela detalhada** com:
  - ordenação por coluna (clicando no cabeçalho),
  - **paginação** (8 registros por página),
  - busca textual com debounce,
  - filtro por área (chips),
  - linhas clicáveis que abrem um **modal de detalhamento**.
- **Acessibilidade:** navegação por teclado, foco-trap no modal, botão de menu
  mobile, skip-link, contraste WCAG AA.
- **Dark mode** com tipografia monoespaçada (IBM Plex Mono / Inter).

## 🚀 Como rodar

Não há build nem dependências. Há três opções:

### 1. Abrir direto

Abra `index.html` no navegador.

### 2. Servidor estático (recomendado)

```bash
# Python 3
python3 -m http.server 8000
# depois acesse http://localhost:8000

# ou Node
npx serve
```

### 3. Live preview

O projeto pode ser servido por qualquer servidor de arquivos estáticos.

## 📁 Estrutura

```
.
├── index.html      # marcação (sidebar, KPIs, gráficos, filtros, tabela, modal)
├── style.css       # estilos (dark mode, responsivo, modal, paginação)
├── script.js       # dados, estado, renderização, filtros, paginação, modal
└── CRITICA.md      # avaliação crítica + status das correções aplicadas
```

Os dados das emendas estão hardcoded em `script.js` (array `emendasData`).
Para usar dados de uma API, basta substituir a fonte mantendo o mesmo formato.

## 🔧 Tecnologias

- HTML5 semântico
- CSS3 (custom properties, grid, media queries)
- JavaScript vanilla (sem frameworks, sem build)
- Fontes Google (IBM Plex Mono, Inter)

## 📋 Decisões de projeto

- **Sem dependências externas** além das fontes do Google — abre direto no
  navegador ou em qualquer servidor estático.
- **Renderização via DOM/`textContent`** (não `innerHTML` com dados) para
  evitar XSS quando os dados passarem a vir de uma API.
- **Acessibilidade nativa**: elementos focáveis via teclado, ARIA onde
  necessário, contraste dentro do WCAG AA.

## 📝 Histórico

Veja `CRITICA.md` para a avaliação completa do projeto e a lista de correções
aplicadas (CSS quebrado, paginação inexistente, acessibilidade, reatividade
dos filtros, etc.).

## 📄 Licença

Projeto de exemplo/demonstração.
