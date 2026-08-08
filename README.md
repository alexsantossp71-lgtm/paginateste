# Observatório de Emendas — Baixada Santista

[![Node.js 18+](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Dados abertos](https://img.shields.io/badge/dados-Portal%20da%20Transpar%C3%AAncia-005ca9)](https://portaldatransparencia.gov.br/)

Portal público para acompanhar emendas parlamentares destinadas aos nove municípios da Baixada Santista, com painel de gestão e integração preparada para os dados abertos do Portal da Transparência.

> **Status:** versão inicial funcional. Os dados exibidos inicialmente são demonstrativos; a sincronização oficial é ativada ao configurar uma chave da CGU.

## O que o projeto entrega

- Dashboard público com indicadores, gráficos, busca e filtros;
- Recorte por Bertioga, Cubatão, Guarujá, Itanhaém, Mongaguá, Peruíbe, Praia Grande, Santos e São Vicente;
- Consulta por ano, área, parlamentar e município;
- Detalhamento de cada emenda;
- Área administrativa protegida para cadastrar e excluir registros;
- Sincronização preparada para a API do Portal da Transparência;
- Verificações automatizadas de sintaxe e endpoints fundamentais.

## Tecnologias

| Camada | Solução |
| --- | --- |
| Interface | HTML, CSS e JavaScript puro |
| API | Node.js, módulo `http` nativo |
| Persistência inicial | JSON local (`data/emendas.json`) |
| Fonte oficial | API de Dados Abertos do Portal da Transparência |
| Deploy | Render (Blueprint incluído) |

## Executar localmente

**Pré-requisito:** Node.js 18 ou superior.

```bash
git clone https://github.com/alexsantossp71-lgtm/paginateste.git
cd paginateste
git checkout arena/019fdec0-paginateste
cp .env.example .env
npm start
```

Abra `http://localhost:3000`. O painel administrativo está em `http://localhost:3000/admin.html`.

## Variáveis de ambiente

| Variável | Obrigatória | Finalidade |
| --- | --- | --- |
| `PORT` | Não | Porta do servidor; padrão `3000` |
| `ADMIN_EMAIL` | Sim, em produção | E-mail do administrador |
| `ADMIN_PASSWORD` | Sim, em produção | Senha do administrador |
| `CGU_API_KEY` | Para sincronizar | Chave da API do Portal da Transparência |
| `DATA_FILE` | Não | Caminho alternativo do arquivo de dados |

Nunca envie `.env` ou chaves de API ao repositório.

## Qualidade

```bash
npm run check  # valida a sintaxe
npm test       # testa os endpoints fundamentais
```

## Publicação no Render

O arquivo [`render.yaml`](render.yaml) permite criar o serviço como um Blueprint no Render:

1. Crie um **Blueprint** no [Render](https://dashboard.render.com);
2. Conecte este repositório e escolha a branch `arena/019fdec0-paginateste`;
3. Configure `ADMIN_EMAIL`, `ADMIN_PASSWORD` e `CGU_API_KEY` no painel de ambiente;
4. Faça o deploy.

> O plano gratuito do Render possui armazenamento efêmero. Para produção, migre `data/emendas.json` para PostgreSQL ou use armazenamento persistente.

## Contribuição e segurança

Leia [CONTRIBUTING.md](CONTRIBUTING.md) antes de colaborar e [SECURITY.md](SECURITY.md) para relatar problemas de segurança.
