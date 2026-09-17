// src/routes/produtoRoutes.js — Definicao dos endpoints HTTP
// Responsabilidade: mapear os verbos HTTP e caminhos para os metodos do Controller.
// Nao contem logica de negocio — apenas delega ao Controller. 

const { Router } = require('express');
const produtoController = require('../controllers/produtoController'); 

const router = Router(); 

// POST /produtos — cria um novo produto (o prefixo /produtos ja vem do app.js)
router.post('/', produtoController.criarProduto); 

// GET /produtos — lista todos os produtos
router.get('/', produtoController.listarProdutos); 

// GET /produtos/:id — busca um produto pelo ID (com a barra obrigatoria antes de :id)
router.get('/:id', produtoController.buscarProdutoPorId); 

// PUT /produtos/:id — atualiza um produto pelo ID
router.put('/:id', produtoController.atualizarProduto); 

// DELETE /produtos/:id — remove um produto pelo ID
router.delete('/:id', produtoController.deletarProduto); 

module.exports = router;