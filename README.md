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
