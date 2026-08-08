# Observatório de Emendas — Baixada Santista

Portal público e painel administrativo para acompanhar emendas destinadas aos nove municípios da Baixada Santista: Bertioga, Cubatão, Guarujá, Itanhaém, Mongaguá, Peruíbe, Praia Grande, Santos e São Vicente.

## Executar

Requer Node.js 18 ou superior.

```bash
cp .env.example .env # configure as variáveis
npm start
```

Acesse `http://localhost:3000`. O painel fica em `/admin.html`.

## Dados oficiais

O botão **Sincronizar agora** usa a API do Portal da Transparência. Cadastre uma chave de API e configure `CGU_API_KEY` apenas no ambiente do servidor. Sem a chave, o portal continua funcionando com os registros de demonstração e os cadastrados manualmente.

A importação mantém apenas registros cuja localidade informada corresponda a um município da Baixada Santista. Antes de produção, configure `ADMIN_EMAIL` e uma senha forte em `ADMIN_PASSWORD`; o valor padrão existe somente para demonstração local.

## Publicação no Render

O repositório inclui um `render.yaml` para criar um Web Service no Render. Ao criar o serviço, informe a `CGU_API_KEY` no painel de variáveis de ambiente e substitua `ADMIN_EMAIL` pelo e-mail administrativo desejado. O Render gera automaticamente uma senha inicial em `ADMIN_PASSWORD`; consulte ou substitua esse valor no painel antes do primeiro acesso.

> O plano gratuito do Render usa armazenamento efêmero: cadastros feitos pelo painel podem ser perdidos após um reinício/redeploy. Para produção, use um disco persistente ou migre a persistência para PostgreSQL.
