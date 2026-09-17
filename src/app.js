// src/app.js — Configuracao central do Express
// Responsabilidade: inicializar o Express, registrar middlewares globais,
// servir os arquivos estaticos do Front-end e montar as rotas da API.

const express = require('express');
const path = require('path');
const produtoRoutes = require('./routes/produtoRoutes');

const app = express();

// Middleware para interpretar o corpo das requisicoes como JSON
app.use(express.json());

// Servir os arquivos estaticos da pasta public/ (Front-end)
// Ao acessar http://localhost:3000 o Express entrega o index.html automaticamente
app.use(express.static(path.join(__dirname, '..', 'public')));

// Montagem das rotas de produtos no prefixo /produtos
app.use('/produtos', produtoRoutes);

module.exports = app;
