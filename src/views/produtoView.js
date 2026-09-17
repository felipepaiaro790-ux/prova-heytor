// src/views/produtoView.js
module.exports = {
    renderizar(produto) {
      return {
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        quantidade: produto.quantidade,
        emEstoque: produto.quantidade > 0
      };
    },
    renderizarMuitos(produtos) {
      return produtos.map(produto => this.renderizar(produto));
    },
    renderizarErro(mensagem) {
      return {
        erro: true,
        mensagem: mensaje,
        timestamp: new Date().toISOString()
      };
    }
  };
  