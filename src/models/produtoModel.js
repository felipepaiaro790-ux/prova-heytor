// src/models/produtoModel.js — Camada de dados (Model)
// Responsabilidade: gerenciar o banco de dados simulado em memoria (Array)
// e expor metodos de acesso/manipulacao dos dados.
// Nao conhece req/res — apenas opera sobre os dados puros.

const { randomUUID } = require('crypto');

// Banco de dados simulado em memoria
let produtos = [];

const produtoModel = {
  /**
   * Retorna todos os produtos cadastrados.
   * @returns {Array} lista de produtos
   */
  findAll() {
    return produtos;
  },

  /**
   * Busca um produto pelo ID.
   * @param {string} id — UUID do produto
   * @returns {Object|undefined} produto encontrado ou undefined
   */
  findById(id) {
    return produtos.find((produto) => produto.id === id);
  },

  /**
   * Cria um novo produto com ID gerado automaticamente via crypto.randomUUID().
   * @param {string} nome
   * @param {number} preco
   * @param {number} quantidade
   * @returns {Object} produto criado
   */
  create({ nome, preco, quantidade }) {
    const novoProduto = {
      id: randomUUID(),
      nome,
      preco,
      quantidade,
    };
    produtos.push(novoProduto);
    return novoProduto;
  },

  /**
   * Atualiza os dados de um produto existente pelo ID.
   * @param {string} id
   * @param {string} nome
   * @param {number} preco
   * @param {number} quantidade
   * @returns {Object|null} produto atualizado ou null se nao encontrado
   */
  update(id, { nome, preco, quantidade }) {
    const indice = produtos.findIndex((produto) => produto.id === id);
    if (indice === -1) return null;

    produtos[indice] = { ...produtos[indice], nome, preco, quantidade };
    return produtos[indice];
  },

  /**
   * Remove um produto pelo ID.
   * @param {string} id
   * @returns {Object|null} produto removido ou null se nao encontrado
   */
  delete(id) {
    const indice = produtos.findIndex((produto) => produto.id === id);
    if (indice === -1) return null;

    const [produtoRemovido] = produtos.splice(indice, 1);
    return produtoRemovido;
  },
};

module.exports = produtoModel;
