// src/controllers/produtoController.js — Camada de controle (Controller)
// Responsabilidade: receber as requisicoes HTTP, validar os dados de entrada,
// acionar o Model e devolver a resposta HTTP adequada (status + JSON).
// Toda logica de validacao e tratamento de erros esta centralizada aqui.

const produtoModel = require('../models/produtoModel');

/**
 * Valida os campos obrigatorios de um produto.
 * Retorna uma string com a mensagem de erro ou null se os dados forem validos.
 * @param {*} nome
 * @param {*} preco
 * @param {*} quantidade
 * @returns {string|null}
 */
function validarCampos(nome, preco, quantidade) {
  if (!nome || typeof nome !== 'string' || nome.trim() === '') {
    return "'nome' e obrigatorio e deve ser uma string nao vazia.";
  }
  if (preco === undefined || preco === null || typeof preco !== 'number' || preco <= 0) {
    return "'preco' e obrigatorio e deve ser um numero positivo.";
  }
  if (
    quantidade === undefined ||
    quantidade === null ||
    typeof quantidade !== 'number' ||
    !Number.isInteger(quantidade) ||
    quantidade <= 0
  ) {
    return "'quantidade' e obrigatorio e deve ser um numero inteiro positivo.";
  }
  return null;
}

const produtoController = {
  /**
   * POST /produtos
   * Cria um novo produto. Retorna 201 em caso de sucesso.
   */
  criarProduto(req, res) {
    try {
      const { nome, preco, quantidade } = req.body;

      // Validacao dos campos de entrada
      const erroValidacao = validarCampos(nome, preco, quantidade);
      if (erroValidacao) {
        return res.status(400).json({ erro: erroValidacao });
      }

      const novoProduto = produtoModel.create({ nome: nome.trim(), preco, quantidade });
      return res.status(201).json(novoProduto);
    } catch (erro) {
      return res.status(500).json({ erro: 'Erro interno do servidor ao criar o produto.' });
    }
  },

  /**
   * GET /produtos
   * Lista todos os produtos cadastrados. Retorna 200.
   */
  listarProdutos(req, res) {
    try {
      const produtos = produtoModel.findAll();
      return res.status(200).json(produtos);
    } catch (erro) {
      return res.status(500).json({ erro: 'Erro interno do servidor ao listar os produtos.' });
    }
  },

  /**
   * GET /produtos/:id
   * Busca um produto pelo ID. Retorna 200 ou 404.
   */
  buscarProdutoPorId(req, res) {
    try {
      const { id } = req.params;
      const produto = produtoModel.findById(id);

      if (!produto) {
        return res.status(404).json({ erro: `Produto com ID '${id}' nao encontrado.` });
      }

      return res.status(200).json(produto);
    } catch (erro) {
      return res.status(500).json({ erro: 'Erro interno do servidor ao buscar o produto.' });
    }
  },

  /**
   * PUT /produtos/:id
   * Atualiza um produto pelo ID. Retorna 200 ou 404.
   */
  atualizarProduto(req, res) {
    try {
      const { id } = req.params;
      const { nome, preco, quantidade } = req.body;

      // Validacao dos campos de entrada
      const erroValidacao = validarCampos(nome, preco, quantidade);
      if (erroValidacao) {
        return res.status(400).json({ erro: erroValidacao });
      }

      const produtoAtualizado = produtoModel.update(id, { nome: nome.trim(), preco, quantidade });

      if (!produtoAtualizado) {
        return res.status(404).json({ erro: `Produto com ID '${id}' nao encontrado.` });
      }

      return res.status(200).json(produtoAtualizado);
    } catch (erro) {
      return res.status(500).json({ erro: 'Erro interno do servidor ao atualizar o produto.' });
    }
  },

  /**
   * DELETE /produtos/:id
   * Remove um produto pelo ID. Retorna 200 ou 404.
   */
  deletarProduto(req, res) {
    try {
      const { id } = req.params;
      const produtoRemovido = produtoModel.delete(id);

      if (!produtoRemovido) {
        return res.status(404).json({ erro: `Produto com ID '${id}' nao encontrado.` });
      }

      return res.status(200).json({
        mensagem: `Produto '${produtoRemovido.nome}' removido com sucesso.`,
        produto: produtoRemovido,
      });
    } catch (erro) {
      return res.status(500).json({ erro: 'Erro interno do servidor ao deletar o produto.' });
    }
  },
};

module.exports = produtoController;
