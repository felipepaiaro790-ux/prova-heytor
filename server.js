// server.js — Entrypoint da aplicacao
// Responsabilidade: importar o app configurado e iniciar o servidor HTTP na porta definida.

const app = require('./src/app');

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
