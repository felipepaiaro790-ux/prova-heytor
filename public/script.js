// public/script.js — Logica do Front-end
// Responsabilidade: consumir todos os endpoints da API REST de Produtos,
// renderizar a lista dinamicamente e fornecer feedback visual via toasts.

// =============================================
// CONFIGURACAO
// =============================================
const API_URL = "/produtos";

// =============================================
// REFERENCIAS AO DOM
// =============================================
const produtoForm        = document.getElementById("produtoForm");
const produtoIdInput     = document.getElementById("produtoId");
const nomeInput          = document.getElementById("nome");
const precoInput         = document.getElementById("preco");
const quantidadeInput    = document.getElementById("quantidade");
const submitBtn          = document.getElementById("submitBtn");
const submitBtnText      = document.getElementById("submitBtnText");
const cancelBtn          = document.getElementById("cancelBtn");
const formTitle          = document.getElementById("formTitle");
const tableBody          = document.getElementById("produtosTableBody");
const tableWrapper       = document.getElementById("tableWrapper");
const emptyState         = document.getElementById("emptyState");
const totalBadge         = document.getElementById("totalBadge");
const toastContainer     = document.getElementById("toastContainer");

// =============================================
// TOAST — notificacoes visuais
// =============================================

/**
 * Exibe um toast no canto superior direito.
 * @param {string} message - Texto a exibir
 * @param {'success'|'error'|'info'} type - Tipo visual
 */
function showToast(message, type = "success") {
  const icons = {
    success: `<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`,
    error:   `<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>`,
    info:    `<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01"/></svg>`,
  };

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `${icons[type] || ""}<span>${message}</span>`;
  toastContainer.appendChild(toast);

  // Remove o toast apos 3.5 segundos com animacao de saida
  setTimeout(() => {
    toast.classList.add("hide");
    toast.addEventListener("animationend", () => toast.remove());
  }, 3500);
}

// =============================================
// ESTADO DO BOTAO — spinner durante requisicao
// =============================================

function setLoading(isLoading) {
  if (isLoading) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="btn-spinner"></span><span>Aguarde...</span>`;
  } else {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      <span id="submitBtnText">${produtoIdInput.value ? "Salvar Alteracoes" : "Cadastrar Produto"}</span>`;
  }
}

// =============================================
// RENDERIZACAO DA LISTA
// =============================================

/**
 * Formata um numero para moeda BRL.
 * @param {number} value
 * @returns {string}
 */
function formatarPreco(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/**
 * Renderiza toda a lista de produtos na tabela.
 * @param {Array} produtos
 */
function renderizarProdutos(produtos) {
  tableBody.innerHTML = "";

  const temProdutos = produtos.length > 0;
  tableWrapper.classList.toggle("hidden", !temProdutos);
  emptyState.classList.toggle("hidden", temProdutos);
  emptyState.classList.toggle("flex", !temProdutos);

  totalBadge.textContent = `${produtos.length} ${produtos.length === 1 ? "produto" : "produtos"}`;

  produtos.forEach((produto) => {
    const tr = document.createElement("tr");
    tr.id = `row-${produto.id}`;
    tr.innerHTML = `
      <td class="px-6 py-4 font-medium text-gray-800">${produto.nome}</td>
      <td class="px-6 py-4 text-gray-600">${formatarPreco(produto.preco)}</td>
      <td class="px-6 py-4 text-gray-600">${produto.quantidade} un.</td>
      <td class="px-6 py-4 text-right">
        <div class="flex items-center justify-end gap-2">
          <button class="btn-edit" onclick="iniciarEdicao('${produto.id}', '${produto.nome}', ${produto.preco}, ${produto.quantidade})">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.5-6.5a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z"/>
            </svg>
            Editar
          </button>
          <button class="btn-delete" onclick="deletarProduto('${produto.id}', '${produto.nome}')">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/>
            </svg>
            Excluir
          </button>
        </div>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

// =============================================
// API CALLS — GET, POST, PUT, DELETE
// =============================================

/** Busca todos os produtos e re-renderiza a lista */
async function carregarProdutos() {
  try {
    const res = await fetch(API_URL);
    const produtos = await res.json();
    renderizarProdutos(produtos);
  } catch (err) {
    showToast("Erro ao conectar com a API. Verifique se o servidor esta rodando.", "error");
  }
}

/** Cria um novo produto via POST */
async function criarProduto(dados) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  return res;
}

/** Atualiza um produto existente via PUT */
async function atualizarProduto(id, dados) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  return res;
}

/** Remove um produto via DELETE */
async function deletarProduto(id, nome) {
  const confirmar = confirm(`Tem certeza que deseja excluir o produto "${nome}"?`);
  if (!confirmar) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (res.ok) {
      showToast(`Produto "${nome}" excluido com sucesso!`, "success");
      await carregarProdutos();
    } else {
      const data = await res.json();
      showToast(data.erro || "Erro ao excluir produto.", "error");
    }
  } catch (err) {
    showToast("Erro inesperado ao excluir produto.", "error");
  }
}

// =============================================
// MODO EDICAO — preenche o formulario
// =============================================

/**
 * Preenche o formulario com os dados do produto a editar.
 * Destaca a linha na tabela com a classe editing-row.
 */
function iniciarEdicao(id, nome, preco, quantidade) {
  // Preenche os campos
  produtoIdInput.value  = id;
  nomeInput.value       = nome;
  precoInput.value      = preco;
  quantidadeInput.value = quantidade;

  // Atualiza UI do formulario
  formTitle.textContent = "Editar Produto";
  submitBtnText.textContent = "Salvar Alteracoes";
  cancelBtn.classList.remove("hidden");

  // Destaca a linha sendo editada
  document.querySelectorAll("tr.editing-row").forEach((r) => r.classList.remove("editing-row"));
  const row = document.getElementById(`row-${id}`);
  if (row) row.classList.add("editing-row");

  // Rola ate o topo suavemente
  window.scrollTo({ top: 0, behavior: "smooth" });
  nomeInput.focus();
}

/** Cancela o modo edicao e reseta o formulario */
function cancelarEdicao() {
  produtoForm.reset();
  produtoIdInput.value = "";
  formTitle.textContent = "Cadastrar Novo Produto";
  submitBtnText.textContent = "Cadastrar Produto";
  cancelBtn.classList.add("hidden");
  document.querySelectorAll("tr.editing-row").forEach((r) => r.classList.remove("editing-row"));
}

// =============================================
// SUBMIT DO FORMULARIO
// =============================================

produtoForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id         = produtoIdInput.value;
  const nome       = nomeInput.value.trim();
  const preco      = parseFloat(precoInput.value);
  const quantidade = parseInt(quantidadeInput.value, 10);

  // Validacao basica no front antes de enviar
  if (!nome) {
    showToast("O campo 'Nome' e obrigatorio.", "error");
    nomeInput.focus();
    return;
  }
  if (!preco || preco <= 0) {
    showToast("O 'Preco' deve ser um numero positivo.", "error");
    precoInput.focus();
    return;
  }
  if (!quantidade || quantidade <= 0 || !Number.isInteger(quantidade)) {
    showToast("A 'Quantidade' deve ser um inteiro positivo.", "error");
    quantidadeInput.focus();
    return;
  }

  const dados = { nome, preco, quantidade };
  setLoading(true);

  try {
    if (id) {
      // Modo edicao — PUT
      const res = await atualizarProduto(id, dados);
      const data = await res.json();
      if (res.ok) {
        showToast(`Produto "${data.nome}" atualizado com sucesso!`, "success");
        cancelarEdicao();
        await carregarProdutos();
      } else {
        showToast(data.erro || "Erro ao atualizar produto.", "error");
      }
    } else {
      // Modo criacao — POST
      const res = await criarProduto(dados);
      const data = await res.json();
      if (res.status === 201) {
        showToast(`Produto "${data.nome}" cadastrado com sucesso!`, "success");
        produtoForm.reset();
        await carregarProdutos();
      } else {
        showToast(data.erro || "Erro ao cadastrar produto.", "error");
      }
    }
  } catch (err) {
    showToast("Erro inesperado. Verifique o servidor.", "error");
  } finally {
    setLoading(false);
  }
});

// =============================================
// EVENTO DO BOTAO CANCELAR
// =============================================
cancelBtn.addEventListener("click", cancelarEdicao);

// =============================================
// INICIALIZACAO — carrega a lista ao abrir a pagina
// =============================================
carregarProdutos();
