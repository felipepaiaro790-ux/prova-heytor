// src/controllers/produtoController.js
const produtoModel = require('../models/produtoModel');
const produtoView = require('../views/produtoView'); // Importando a View

module.exports = {
  criarProduto(req, res) {
    try {
      const { nome, preco, quantity } = req.body;
      
      // Validação do campo (400)
      if (!nome || !preco || !quantity) {
        return res.status(400).json(produtoView.renderizarErro("Dados insuficientes."));
      }

      const novoProduto = produtoModel.create({ nome, preco, quantity });
      return res.status(201).json(produtoView.renderizar(novoProduto));
    } catch (error) {
      return res.status(500).json(produtoView.renderizarErro("Erro interno do servidor."));
    }
  },

  listarProdutos(req, res) {
    try {
      const produtos = produtoModel.findAll();
      return res.status(200).json(produtoView.renderizarMuitos(produtos));
    } catch (error) {
      return res.status(500).json(produtoView.renderizarErro("Erro interno do servidor."));
    }
  },

  buscarProdutoPorId(req, res) {
    try {
      const { id } = req.params;
      const produto = produtoModel.findById(id);

      if (!produto) {
        return res.status(404).json(produtoView.renderizarErro("Produto nao encontrado."));
      }

      return res.status(200).json(produtoView.renderizar(produto));
    } catch (error) {
      return res.status(500).json(produtoView.renderizarErro("Erro interno do servidor."));
    }
  },

  atualizarProduto(req, res) {
    try {
      const { id } = req.params;
      const { nome, preco, quantity } = req.body;

      const produtoExistente = produtoModel.findById(id);
      if (!produtoExistente) {
        return res.status(404).json(produtoView.renderizarErro("Produto nao encontrado."));
      }

      if (!nome || !preco || !quantity) {
        return res.status(400).json(produtoView.renderizarErro("Dados invalidos."));
      }

      const produtoAtualizado = produtoModel.update(id, { nome, preco, quantity });
      return res.status(200).json(produtoView.renderizar(produtoAtualizado));
    } catch (error) {
      return res.status(500).json(produtoView.renderizarErro("Erro interno do servidor."));
    }
  },

  deletarProduto(req, res) {
    try {
      const { id } = req.params;
      const deletado = produtoModel.delete(id);

      if (!deletado) {
        return res.status(404).json(produtoView.renderizarErro("Produto nao encontrado."));
      }

      return res.status(200).json({ mensagem: "Produto removido com sucesso." });
    } catch (error) {
      return res.status(500).json(produtoView.renderizarErro("Erro interno do servidor."));
    }
  }
};
