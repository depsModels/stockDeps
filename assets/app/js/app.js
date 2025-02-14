let produtosOriginais = [];
let paginaAtualEntradas = 1;
let paginaAtualSaidas = 1;
let paginaAtual = 1;
let entradasFiltradas = [];

// Performance tracking utilities
const performanceMetrics = {
  measurements: {},
  startMeasure(label) {
    this.measurements[label] = performance.now();
  },
  endMeasure(label) {
    if (this.measurements[label]) {
      const duration = performance.now() - this.measurements[label];
      console.log(`${label}: ${duration.toFixed(2)}ms`);
      delete this.measurements[label];
    }
  },
  clear() {
    this.measurements = {};
  }
};

// Cache for performance optimization
const cache = {
  produtos: new Map(),
  fornecedores: new Map(),
  clientes: new Map(),
  searchResults: new Map(),
  clear() {
    this.produtos.clear();
    this.fornecedores.clear();
    this.clientes.clear();
    this.searchResults.clear();
  }
};

// State variables
let produtos = [];
let clientes = [];
let fornecedores = [];
let entradas = [];
let saidas = [];
let categorias = [];

let produtosFiltrados = [];
let produtosOrdenados = [];

// Message display functions
function exibirMensagem(mensagem, tipo = "info") {
  const messageDiv = document.createElement("div");
  messageDiv.className = `alert alert-${tipo} message-popup`;
  messageDiv.innerHTML = mensagem;

  document.body.appendChild(messageDiv);

  // Add show class after a small delay to trigger animation
  setTimeout(() => {
    messageDiv.classList.add("show");
  }, 10);

  // Remove after timeout
  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}

function exibirMensagemTemporariaSucesso(msg) {
  exibirMensagem(msg, "success");
}

function exibirMensagemTemporariaAviso(msg) {
  exibirMensagem(msg, "warning");
}

function exibirMensagemTemporariaErro(msg) {
  exibirMensagem(msg, "danger");
}

// Initialize data loading
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await Promise.all([
            fetchProdutos(),
            fetchEntradas(),
            fetchSaidas(),
            fetchCategorias(),
            fetchClientes(),
            fetchFornecedores()
        ]);
        renderizarTabela();
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
});

function setupEventListeners() {
  const consultarEntradasBtn = document.getElementById("consultarEntradasBtn");
  const consultarSaidasBtn = document.getElementById("consultarSaidasBtn");

  if (consultarEntradasBtn) {
    consultarEntradasBtn.addEventListener("click", async () => {
      try {
        // Carregar dados necessários
        await Promise.all([
          fetchProdutos(),
          fetchFornecedores(),
          fetchEntradas(),
        ]);

        const entradasModal = new bootstrap.Modal(
          document.getElementById("entradasModal")
        );
        if (entradasModal) {
          entradasModal.show();
          mostrarPaginaEntradas(1);
        }
      } catch (error) {
        console.error("Erro ao abrir modal de entradas:", error);
        exibirMensagemTemporariaErro("Erro ao carregar dados de entradas");
      }
    });
  }

  if (consultarSaidasBtn) {
    consultarSaidasBtn.addEventListener("click", async () => {
      try {
        // Carregar dados necessários
        await Promise.all([fetchProdutos(), fetchClientes(), fetchSaidas()]);

        const saidasModal = new bootstrap.Modal(
          document.getElementById("saidasModal")
        );
        if (saidasModal) {
          saidasModal.show();
          mostrarPaginaSaidas(1);
        }
      } catch (error) {
        console.error("Erro ao abrir modal de saídas:", error);
        exibirMensagemTemporariaErro("Erro ao carregar dados de saídas");
      }
    });
  }
}

async function fetchProdutos() {
  performanceMetrics.startMeasure("fetchProdutos");
  try {
    const response = await fetch(`${window.location.origin + '/app'}/getProdutos`);
    produtosOriginais = (await response.json()) || [];
    produtos = [...produtosOriginais];

    // Index produtos for faster lookups
    cache.produtos.clear();
    produtos.forEach((p) => {
      cache.produtos.set(p.id, p);
      // Pre-process lowercase names for search
      p._nomeLower = p.nome.toLowerCase();
      p._codigoLower = p.codigo_produto.toLowerCase();
    });

    produtosFiltrados = [...produtos];
    produtosOrdenados = [...produtosFiltrados];

    const tbody = document.getElementById("corpoTabela");
    if (tbody) {
      mostrarPagina(paginaAtual);
      buscarProduto();
    }
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
    cache.clear();
  }
  performanceMetrics.endMeasure("fetchProdutos");
}

async function fetchFornecedores() {
  try {
    const response = await fetch(`${window.location.origin + '/app'}/getFornecedores`);
    fornecedores = (await response.json()) || [];
    cache.fornecedores.clear();
    fornecedores.forEach((f) => cache.fornecedores.set(f.id, f));
    preencherSugestoesFornecedores();
  } catch (error) {
    console.error("Erro ao carregar fornecedores:", error);
  }
}

async function fetchClientes() {
  try {
    const response = await fetch(`${window.location.origin + '/app'}/getClientes`);
    clientes = (await response.json()) || [];
    cache.clientes.clear();
    clientes.forEach((c) => cache.clientes.set(c.id, c));
  } catch (error) {
    console.error("Erro ao carregar clientes:", error);
  }
}

async function fetchCategorias() {
  const response = await fetch(`${window.location.origin + '/app'}/getCategorias`);
  categorias = await response.json();
  preencherCategorias(categorias, () => alterarTabelaPorCategoriaSelecionada());
  renderizarTabela(categorias);
}

async function fetchEntradas() {
  performanceMetrics.startMeasure("fetchEntradas");
  try {
    // Primeiro, carregar dados necessários
    await Promise.all([fetchProdutos(), fetchFornecedores()]);

    const response = await fetch(`${window.location.origin + '/app'}/getEntradas`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Dados brutos recebidos:", data);

    entradas = Array.isArray(data) ? data : [];
    entradasFiltradas = [...entradas];

    console.log("Entradas processadas:", {
      total: entradas.length,
      produtos: produtos.length,
      fornecedores: fornecedores.length,
    });

    // Agora que temos todos os dados, mostrar a página
    mostrarPaginaEntradas(1);
  } catch (error) {
    console.error("Erro ao carregar entradas:", error);
    entradas = [];
    entradasFiltradas = [];
    exibirMensagemTemporariaErro(
      "Erro ao carregar entradas. Por favor, tente novamente."
    );
  }
  performanceMetrics.endMeasure("fetchEntradas");
}

async function fetchSaidas() {
  performanceMetrics.startMeasure("fetchSaidas");
  try {
    const response = await fetch(`${window.location.origin + '/app'}/getSaidas`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    saidas = Array.isArray(data) ? data : [];
    saidasFiltradas = [...saidas];
    console.log("Saídas carregadas:", saidas.length);
  } catch (error) {
    console.error("Erro ao carregar saídas:", error);
    saidas = [];
    saidasFiltradas = [];
    exibirMensagemTemporariaErro(
      "Erro ao carregar saídas. Por favor, tente novamente."
    );
  }
  performanceMetrics.endMeasure("fetchSaidas");
}

function loadAllData() {
  Promise.all([
    fetchProdutos(),
    fetchCategorias(),
    fetchClientes(),
    fetchFornecedores(),
    fetchEntradas(),
    fetchSaidas(),
  ]).catch((error) => console.error("Erro ao carregar dados:", error));
}

function formatarData(dataISO) {
  const data = new Date(dataISO);
  return data.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function renderizarTabela() {
  const tbody = document.getElementById("corpoTabelaCategorias");
  tbody.innerHTML = "";

  categorias.forEach((categoria) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
            <td>${categoria.nome}</td>
            <td>${categoria.descricao}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="editarCategoria(${categoria.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="excluirCategoria(${categoria.id})">Excluir</button>
            </td>
        `;

    tbody.appendChild(tr);
  });
}

function buscarProduto() {
  const inputBuscarProduto = document.getElementById("buscarProduto");
  let debounceTimer;
  let lastQuery = "";

  inputBuscarProduto.addEventListener("input", function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      performanceMetrics.startMeasure("buscarProduto");
      const termoBusca = inputBuscarProduto.value.toLowerCase();

      // Skip if query hasn't changed
      if (termoBusca === lastQuery) {
        performanceMetrics.endMeasure("buscarProduto");
        return;
      }
      lastQuery = termoBusca;

      // Check cache first
      if (cache.searchResults.has(termoBusca)) {
        produtosFiltrados = cache.searchResults.get(termoBusca);
      } else {
        // Use pre-processed lowercase names
        produtosFiltrados = produtos.filter(
          (produto) =>
            produto._nomeLower.includes(termoBusca) ||
            produto._codigoLower.includes(termoBusca)
        );
        // Cache results
        cache.searchResults.set(termoBusca, produtosFiltrados);
      }

      produtosOrdenados = [...produtosFiltrados];
      paginaAtual = 1;
      mostrarPagina(paginaAtual);
      performanceMetrics.endMeasure("buscarProduto");
    }, 300);
  });
}

function removerAcentos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function buscarEntrada() {
  const inputBuscarEntrada = document.getElementById("buscarEntrada");
  let debounceTimer;
  let lastQuery = "";

  inputBuscarEntrada.addEventListener("input", function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      performanceMetrics.startMeasure("buscarEntrada");
      const termoBusca = removerAcentos(inputBuscarEntrada.value.toLowerCase());

      if (termoBusca === lastQuery) {
        performanceMetrics.endMeasure("buscarEntrada");
        return;
      }
      lastQuery = termoBusca;

      if (cache.searchResults.has("entrada_" + termoBusca)) {
        entradasFiltradas = cache.searchResults.get("entrada_" + termoBusca);
      } else {
        entradasFiltradas = entradas.filter((entrada) => {
          const produto = cache.produtos.get(entrada.idProdutos);
          const fornecedor = cache.fornecedores.get(entrada.idFornecedor);

          return (
            removerAcentos(produto?.nome?.toLowerCase() || "").includes(
              termoBusca
            ) ||
            removerAcentos(fornecedor?.nome?.toLowerCase() || "").includes(
              termoBusca
            )
          );
        });
        cache.searchResults.set("entrada_" + termoBusca, entradasFiltradas);
      }

      paginaAtualEntradas = 1;
      mostrarPaginaEntradas(paginaAtualEntradas);
      performanceMetrics.endMeasure("buscarEntrada");
    }, 300);
  });
}

function buscarSaida() {
  const inputBuscarSaida = document.getElementById("buscarSaida");
  inputBuscarSaida.addEventListener("input", function () {
    const termoBusca = removerAcentos(inputBuscarSaida.value.toLowerCase());

    saidasFiltradas = saidas.filter((saida) => {
      const produto = produtosOriginais.find((p) => p.id == saida.idProdutos);
      const cliente = Array.isArray(clientes)
        ? clientes.find((c) => c.id == saida.idClientes)?.nome ||
          "Cliente não encontrado"
        : "Cliente não cadastrado";

      return (
        removerAcentos(produto?.nome?.toLowerCase()).includes(termoBusca) ||
        removerAcentos(cliente.toLowerCase()).includes(termoBusca)
      );
    });

    paginaAtualSaidas = 1;
    mostrarPaginaSaidas(paginaAtualSaidas); // Atualiza a tabela com os resultados filtrados
  });
}

function mostrarPaginaEntradas(pagina) {
  performanceMetrics.startMeasure("mostrarPaginaEntradas");
  console.log("Iniciando mostrarPaginaEntradas:", { pagina });

  const inicio = (pagina - 1) * 10;
  const fim = inicio + 10;
  const tbody = document.getElementById("corpoTabelaEntradas");

  if (!tbody) {
    console.error("Elemento corpoTabelaEntradas não encontrado");
    return;
  }

  console.log("Estado atual:", {
    entradasFiltradas: entradasFiltradas,
    produtos: produtos,
    fornecedores: fornecedores,
    paginacao: {
      inicio,
      fim,
      total: entradasFiltradas.length,
    },
  });

  let html = "";
  if (!Array.isArray(entradasFiltradas) || entradasFiltradas.length === 0) {
    html =
      '<tr><td colspan="6" class="text-center">Nenhuma entrada encontrada.</td></tr>';
    console.log("Nenhuma entrada para exibir");
  } else {
    const entradasPagina = entradasFiltradas.slice(inicio, fim);
    console.log("Processando entradas da página:", entradasPagina);

    html = entradasPagina
      .map((entrada) => {
        try {
          const fornecedor = fornecedores.find(
            (f) => parseInt(f.id) === parseInt(entrada.idFornecedor)
          );
          const produto = produtos.find(
            (p) => parseInt(p.id) === parseInt(entrada.idProdutos)
          );

          console.log("Processando entrada:", {
            entrada,
            fornecedorEncontrado: fornecedor ? "sim" : "não",
            produtoEncontrado: produto ? "sim" : "não",
            idComparacao: {
              fornecedor: {
                entrada: parseInt(entrada.idFornecedores),
                encontrado: fornecedor ? parseInt(fornecedor.id) : "N/A",
              },
              produto: {
                entrada: parseInt(entrada.idProdutos),
                encontrado: produto ? parseInt(produto.id) : "N/A",
              },
            },
          });

          // Garantir que os valores sejam números
          const quantidade = parseInt(entrada.quantidade) || 0;
          const preco = parseFloat(entrada.preco) || 0;

          return `<tr>
                    <td>${fornecedor?.nome || "Fornecedor não encontrado"}</td>
                    <td>${produto?.nome || "Produto não encontrado"}</td>
                    <td>${quantidade}</td>
                    <td>${formatarPrecoParaExibicao(preco)}</td>
                    <td>${formatarData(entrada.created_at)}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="editarEntrada(${
                          entrada.id
                        })">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="excluirEntrada(${
                          entrada.id
                        })">Excluir</button>
                    </td>
                </tr>`;
        } catch (error) {
          console.error("Erro ao processar entrada:", error, entrada);
          return `<tr><td colspan="6" class="text-center text-danger">Erro ao processar entrada</td></tr>`;
        }
      })
      .join("");
  }

  tbody.innerHTML = html;
  configurarPaginacao(
    entradasFiltradas.length,
    mostrarPaginaEntradas,
    "#paginacaoEntradas",
    pagina
  );
  performanceMetrics.endMeasure("mostrarPaginaEntradas");
}

function filtrarEntradasPorData() {
  performanceMetrics.startMeasure("filtrarEntradasPorData");
  const dataInicial = document.getElementById("dataInicialEntrada").value;
  const dataFinal = document.getElementById("dataFinalEntrada").value;

  const cacheKey = `data_${dataInicial}_${dataFinal}`;
  if (cache.searchResults.has(cacheKey)) {
    entradasFiltradas = cache.searchResults.get(cacheKey);
  } else {
    if (!dataInicial && !dataFinal) {
      entradasFiltradas = [...entradas];
    } else {
      const dataInicialObj = dataInicial ? new Date(dataInicial) : null;
      const dataFinalObj = dataFinal ? new Date(dataFinal) : null;

      entradasFiltradas = entradas.filter((entrada) => {
        if (!entrada._date) {
          entrada._date = new Date(entrada.created_at.split(" ")[0]);
        }
        return (
          (!dataInicialObj || entrada._date >= dataInicialObj) &&
          (!dataFinalObj || entrada._date <= dataFinalObj)
        );
      });
    }
    cache.searchResults.set(cacheKey, entradasFiltradas);
  }

  if (entradasFiltradas.length === 0) {
    mostrarMensagemNenhumaEntrada();
  } else {
    mostrarPaginaEntradas(1);
  }
  performanceMetrics.endMeasure("filtrarEntradasPorData");
}

function mostrarMensagemNenhumaEntrada() {
  // Seleciona a tabela de entradas e limpa seu conteúdo
  const tabela = document.querySelector("#tabelaEntradas tbody");
  tabela.innerHTML = `<tr><td colspan="6" class="text-center">Nenhuma entrada encontrada para a data selecionada.</td></tr>`;
}

function filtrarSaidasPorData() {
  const dataFiltro = document.querySelector("#filtroDataSaida").value; // Pega a data do filtro
  if (!dataFiltro) return; // Não faz nada se o campo de data estiver vazio

  // Filtra as saídas com a data selecionada
  saidasFiltradas = saidas.filter((saida) => {
    // Extrai a parte da data de created_at (formato YYYY-MM-DD)
    const dataSaida = saida.created_at.split(" ")[0]; // Pega a data sem a hora (ex: 2024-12-22)

    // Compara as datas no formato YYYY-MM-DD
    return dataSaida === dataFiltro;
  });

  // Verifica se há saídas filtradas, caso contrário exibe uma mensagem
  if (saidasFiltradas.length === 0) {
    mostrarMensagemNenhumaSaida();
  } else {
    // Exibe a primeira página das saídas filtradas
    mostrarPaginaSaidas(1);
  }
}

function mostrarMensagemNenhumaSaida() {
  // Seleciona a tabela de saídas e limpa seu conteúdo
  const tabela = document.querySelector("#tabelaSaidas tbody");
  tabela.innerHTML = `<tr><td colspan="6" class="text-center">Nenhuma saída encontrada para a data selecionada.</td></tr>`;
}

function configurarPaginacao(
  totalItens,
  callback,
  seletorPaginacao,
  paginaAtual
) {
  const totalPaginas = Math.ceil(totalItens / 10);
  const paginacaoContainer = document.querySelector(seletorPaginacao);
  paginacaoContainer.innerHTML = ""; // Limpa a navegação

  if (totalPaginas <= 1) return; // Se há apenas uma página, não exibe paginação

  const paginaInicial = Math.max(
    1,
    paginaAtual - Math.floor(5 / 2)
  );
  const paginaFinal = Math.min(
    totalPaginas,
    paginaInicial + 5 - 1
  );

  // Botão "Anterior"
  const botaoAnterior = document.createElement("li");
  botaoAnterior.classList.add("page-item");
  if (paginaAtual > 1) {
    botaoAnterior.innerHTML = `<a class="page-link" href="#" onclick="${
      callback.name
    }(${paginaAtual - 1})">&laquo;</a>`;
  } else {
    botaoAnterior.classList.add("disabled");
    botaoAnterior.innerHTML = `<span class="page-link">&laquo;</span>`;
  }
  paginacaoContainer.appendChild(botaoAnterior);

  // Botões de páginas
  for (let i = paginaInicial; i <= paginaFinal; i++) {
    const botaoPagina = document.createElement("li");
    botaoPagina.classList.add("page-item");
    if (i === paginaAtual) botaoPagina.classList.add("active");

    botaoPagina.innerHTML = `<a class="page-link" href="#" onclick="${callback.name}(${i})">${i}</a>`;
    paginacaoContainer.appendChild(botaoPagina);
  }

  // Botão "Próximo"
  const botaoProximo = document.createElement("li");
  botaoProximo.classList.add("page-item");
  if (paginaAtual < totalPaginas) {
    botaoProximo.innerHTML = `<a class="page-link" href="#" onclick="${
      callback.name
    }(${paginaAtual + 1})">&raquo;</a>`;
  } else {
    botaoProximo.classList.add("disabled");
    botaoProximo.innerHTML = `<span class="page-link">&raquo;</span>`;
  }
  paginacaoContainer.appendChild(botaoProximo);
}

function loadAllData() {
  Promise.all([
    fetchProdutos(),
    fetchCategorias(),
    fetchClientes(),
    fetchFornecedores(),
    fetchEntradas(),
    fetchSaidas(),
  ]).catch((error) => console.error("Erro ao carregar dados:", error));
}

function formatarData(dataISO) {
  const data = new Date(dataISO);
  return data.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function renderizarTabela() {
  const tbody = document.getElementById("corpoTabelaCategorias");
  tbody.innerHTML = "";

  categorias.forEach((categoria) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
            <td>${categoria.nome}</td>
            <td>${categoria.descricao}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="editarCategoria(${categoria.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="excluirCategoria(${categoria.id})">Excluir</button>
            </td>
        `;

    tbody.appendChild(tr);
  });
}

function buscarProduto() {
  const inputBuscarProduto = document.getElementById("buscarProduto");
  let debounceTimer;
  let lastQuery = "";

  inputBuscarProduto.addEventListener("input", function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      performanceMetrics.startMeasure("buscarProduto");
      const termoBusca = inputBuscarProduto.value.toLowerCase();

      // Skip if query hasn't changed
      if (termoBusca === lastQuery) {
        performanceMetrics.endMeasure("buscarProduto");
        return;
      }
      lastQuery = termoBusca;

      // Check cache first
      if (cache.searchResults.has(termoBusca)) {
        produtosFiltrados = cache.searchResults.get(termoBusca);
      } else {
        // Use pre-processed lowercase names
        produtosFiltrados = produtos.filter(
          (produto) =>
            produto._nomeLower.includes(termoBusca) ||
            produto._codigoLower.includes(termoBusca)
        );
        // Cache results
        cache.searchResults.set(termoBusca, produtosFiltrados);
      }

      produtosOrdenados = [...produtosFiltrados];
      paginaAtual = 1;
      mostrarPagina(paginaAtual);
      performanceMetrics.endMeasure("buscarProduto");
    }, 300);
  });
}

function removerAcentos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function buscarEntrada() {
  const inputBuscarEntrada = document.getElementById("buscarEntrada");
  let debounceTimer;
  let lastQuery = "";

  inputBuscarEntrada.addEventListener("input", function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      performanceMetrics.startMeasure("buscarEntrada");
      const termoBusca = removerAcentos(inputBuscarEntrada.value.toLowerCase());

      if (termoBusca === lastQuery) {
        performanceMetrics.endMeasure("buscarEntrada");
        return;
      }
      lastQuery = termoBusca;

      if (cache.searchResults.has("entrada_" + termoBusca)) {
        entradasFiltradas = cache.searchResults.get("entrada_" + termoBusca);
      } else {
        entradasFiltradas = entradas.filter((entrada) => {
          const produto = cache.produtos.get(entrada.idProdutos);
          const fornecedor = cache.fornecedores.get(entrada.idFornecedor);

          return (
            removerAcentos(produto?.nome?.toLowerCase() || "").includes(
              termoBusca
            ) ||
            removerAcentos(fornecedor?.nome?.toLowerCase() || "").includes(
              termoBusca
            )
          );
        });
        cache.searchResults.set("entrada_" + termoBusca, entradasFiltradas);
      }

      paginaAtualEntradas = 1;
      mostrarPaginaEntradas(paginaAtualEntradas);
      performanceMetrics.endMeasure("buscarEntrada");
    }, 300);
  });
}

function buscarSaida() {
  const inputBuscarSaida = document.getElementById("buscarSaida");
  inputBuscarSaida.addEventListener("input", function () {
    const termoBusca = removerAcentos(inputBuscarSaida.value.toLowerCase());

    saidasFiltradas = saidas.filter((saida) => {
      const produto = produtosOriginais.find((p) => p.id == saida.idProdutos);
      const cliente = Array.isArray(clientes)
        ? clientes.find((c) => c.id == saida.idClientes)?.nome ||
          "Cliente não encontrado"
        : "Cliente não cadastrado";

      return (
        removerAcentos(produto?.nome?.toLowerCase()).includes(termoBusca) ||
        removerAcentos(cliente.toLowerCase()).includes(termoBusca)
      );
    });

    paginaAtualSaidas = 1;
    mostrarPaginaSaidas(paginaAtualSaidas); // Atualiza a tabela com os resultados filtrados
  });
}

function mostrarPagina(pagina) {
  performanceMetrics.startMeasure("mostrarPagina");
  const tbody = document.getElementById("corpoTabela");
  if (!tbody) {
    console.error("Elemento tbody não encontrado");
    return;
  }

  const inicio = (pagina - 1) * 10;
  const fim = inicio + 10;
  const produtosPagina = produtosOrdenados.slice(inicio, fim);

  let html;
  if (produtosPagina.length === 0) {
    html =
      '<tr><td colspan="8" class="text-center">Nenhum produto encontrado.</td></tr>';
  } else {
    html = produtosPagina
      .map((produto) => {
        const status = produto.quantidade > 0 ? "Disponível" : "Indisponível";
        return `<tr>
                <td>${produto.codigo_produto || ""}</td>
                <td>${produto.nome || ""}</td>
                <td>${produto.descricao || ""}</td>
                <td>${formatarPrecoParaExibicao(produto.preco)}</td>
                <td>${produto.quantidade || 0}</td>
                <td>${produto.unidade_medida || ""}</td>
                <td>${status}</td>
                <td class="text-center">
                    <div class="btn-group" role="group">
                        ${createButtonGroup(produto)}
                    </div>
                </td>
            </tr>`;
      })
      .join("");
  }

  tbody.innerHTML = html;
  atualizarPaginacao(produtosOrdenados.length, pagina);
  performanceMetrics.endMeasure("mostrarPagina");
}

function atualizarPaginacao(totalProdutos, paginaAtual) {
  const totalPaginas = Math.ceil(totalProdutos / 10);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = ""; // Limpa o container de paginação

  const paginaInicial = Math.max(
    1,
    paginaAtual - Math.floor(5 / 2)
  );
  const paginaFinal = Math.min(
    totalPaginas,
    paginaInicial + 5 - 1
  );

  // Botão "Anterior"
  if (paginaAtual > 1) {
    const liPrev = document.createElement("li");
    liPrev.classList.add("page-item");
    const aPrev = document.createElement("a");
    aPrev.classList.add("page-link");
    aPrev.textContent = "Anterior";
    aPrev.onclick = () => mostrarPagina(paginaAtual - 1, produtos);
    liPrev.appendChild(aPrev);
    pagination.appendChild(liPrev);
  }

  // Botões das páginas
  for (let i = paginaInicial; i <= paginaFinal; i++) {
    const li = document.createElement("li");
    li.classList.add("page-item");
    if (i === paginaAtual) {
      li.classList.add("active"); // Adiciona a classe ativa na página atual
    }

    const a = document.createElement("a");
    a.classList.add("page-link");
    a.textContent = i;
    a.onclick = () => {
      mostrarPagina(i, produtos); // Navega para a página correspondente
    };
    li.appendChild(a);
    pagination.appendChild(li);
  }

  // Botão "Próximo"
  if (paginaAtual < totalPaginas) {
    const liNext = document.createElement("li");
    liNext.classList.add("page-item");
    const aNext = document.createElement("a");
    aNext.classList.add("page-link");
    aNext.textContent = "Próximo";
    aNext.onclick = () => mostrarPagina(paginaAtual + 1, produtos);
    liNext.appendChild(aNext);
    pagination.appendChild(liNext);
  }
}

function alterarTabelaPorCategoriaSelecionada() {
  const categoriaSelecionada = document.getElementById("categoria").value;
  const categoriaSelecionadaNumero = Number(categoriaSelecionada);

  if (categoriaSelecionada && !isNaN(categoriaSelecionadaNumero)) {
    produtosFiltrados = produtosOriginais.filter(
      (produto) => Number(produto.idCategoria) === categoriaSelecionadaNumero
    );
  } else {
    produtosFiltrados = [...produtosOriginais]; // Reseta para todos os produtos
  }

  // Reiniciar a ordenação com os produtos filtrados
  produtosOrdenados = [...produtosFiltrados];
  paginaAtual = 1; // Reinicia na primeira página
  mostrarPagina(paginaAtual); // Mostra a tabela atualizada
}

function ordenarProdutos(produtos) {
  // Lógica de ordenação (dependendo da necessidade)
  return produtos; // Retorna os produtos ordenados
}

function preencherCategorias(categorias, callbackMostrarProdutos) {
  const selectElement = document.getElementById("categoria");
  const selectElementModal = document.getElementById(
    "categoriaProdutoAdicionar"
  );
  const selectElementEditar = document.getElementById("categoriaProdutoEditar");

  // Limpar as opções existentes nos selects antes de adicionar novas
  selectElement.innerHTML = "";
  selectElementModal.innerHTML = "";
  selectElementEditar.innerHTML = "";

  // Adicionar a opção "Todas" no select principal
  const optionAll = document.createElement("option");
  optionAll.value = ""; // Valor vazio para identificar a exibição de todos os produtos
  optionAll.textContent = "Todas";
  selectElement.appendChild(optionAll);

  // Adicionar o placeholder "Selecione a categoria" no modal select
  const placeholderModal = document.createElement("option");
  placeholderModal.value = ""; // Valor vazio para validação
  placeholderModal.textContent = "Selecione a categoria";
  placeholderModal.disabled = true;
  placeholderModal.selected = true;
  selectElementModal.appendChild(placeholderModal);

  // Preenche as opções de categorias no select principal e no modal
  categorias.forEach((categoria) => {
    // Para o select principal
    const optionPrincipal = document.createElement("option");
    optionPrincipal.value = categoria.id;
    optionPrincipal.textContent = categoria.nome;
    selectElement.appendChild(optionPrincipal);

    // Para o select do modal
    const optionModal = document.createElement("option");
    optionModal.value = categoria.id;
    optionModal.textContent = categoria.nome;
    selectElementModal.appendChild(optionModal);

    const optionEditar = document.createElement("option");
    optionEditar.value = categoria.id;
    optionEditar.textContent = categoria.nome;
    selectElementEditar.appendChild(optionEditar);
  });
}

function preencherFornecedores(fornecedores) {
  const input = document.getElementById("fornecedor");
  const lista = document.getElementById("fornecedor-lista");

  input.addEventListener("input", () => {
    const query = input.value.toLowerCase().trim();
    lista.innerHTML = "";

    if (query === "") {
      lista.style.display = "none";
      return;
    }

    const fornecedoresFiltrados = fornecedores.filter((fornecedor) =>
      fornecedor.nome.toLowerCase().includes(query)
    );

    if (fornecedoresFiltrados.length > 0) {
      lista.style.display = "block";
      fornecedoresFiltrados.forEach((fornecedor) => {
        const item = document.createElement("div");
        item.classList.add("list-group-item", "list-group-item-action");
        item.textContent = fornecedor.nome;
        item.addEventListener("click", () => {
          input.value = fornecedor.nome;
          lista.style.display = "none";
        });
        lista.appendChild(item);
      });
    } else {
      lista.style.display = "none";
    }
  });

  input.addEventListener("blur", () => {
    setTimeout(() => {
      lista.style.display = "none";
    }, 200);
  });

  input.addEventListener("focus", () => {
    if (input.value.trim() !== "") {
      lista.style.display = "block";
    }
  });
}

function preencherClientes(clientes) {
  const input = document.getElementById("cliente");
  const lista = document.getElementById("clientes-lista");

  input.addEventListener("input", () => {
    const query = input.value.toLowerCase();
    lista.innerHTML = "";

    if (query === "") {
      lista.style.display = "none";
      return;
    }

    const clientesFiltrados = clientes.filter((cliente) =>
      cliente.nome.toLowerCase().includes(query)
    );

    if (clientesFiltrados.length > 0) {
      lista.style.display = "block";
      clientesFiltrados.forEach((cliente) => {
        const item = document.createElement("div");
        item.classList.add("list-group-item", "list-group-item-action");
        item.textContent = cliente.nome;
        item.addEventListener("click", () => {
          input.value = cliente.nome;
          lista.style.display = "none";
        });
        lista.appendChild(item);
      });
    } else {
      lista.style.display = "none";
    }
  });

  input.addEventListener("blur", () => {
    setTimeout(() => {
      lista.style.display = "none";
    }, 200);
  });

  input.addEventListener("focus", () => {
    if (input.value.trim() !== "") {
      lista.style.display = "block";
    }
  });
}

function createButtonGroup(produto) {
  if (!produto || !produto.id) return "";
  return `
        <div class="btn-group" role="group">
            <button type="button" class="btn btn-primary btn-sm" onclick="editarProduto(${produto.id})">
                <i class="bi bi-pencil"></i> Editar
            </button>
            <button type="button" class="btn btn-danger btn-sm" onclick="excluirProduto(${produto.id})">
                <i class="bi bi-trash"></i> Excluir
            </button>
            <button type="button" class="btn btn-success btn-sm" onclick="abrirModalEntrada(${produto.id})">
                <i class="bi bi-box-arrow-in-down"></i> Entrada
            </button>
            <button type="button" class="btn btn-warning btn-sm" onclick="abrirModalSaida(${produto.id})">
                <i class="bi bi-box-arrow-up"></i> Saída
            </button>
        </div>
    `;
}

function editarProduto(id) {
  console.log('Editando produto:', id);
  const produto = produtos.find(p => p.id === id);
  if (!produto) {
    console.error('Produto não encontrado');
    return;
  }
  
  console.log('Dados do produto:', produto);

  // Preencher campos básicos
  document.getElementById('idProdutoUpdate').value = produto.id;
  document.getElementById('codigoProdutoEditar').value = produto.codigo_produto || '';
  document.getElementById('nomeProduto').value = produto.nome || '';
  document.getElementById('descricaoProduto').value = produto.descricao || '';
  
  // Formatar e preencher o preço
  const precoInput = document.getElementById('precoProduto');
  if (precoInput) {
    const precoFormatado = formatarPrecoParaExibicao(produto.preco);
    console.log('Preço original:', produto.preco);
    console.log('Preço formatado:', precoFormatado);
    precoInput.value = precoFormatado;
  }

  // Preencher categoria
  const selectCategoria = document.getElementById('categoriaProdutoEditar');
  if (selectCategoria) {
    selectCategoria.value = produto.idCategoria || '';
    console.log('Categoria selecionada:', produto.idCategoria);
  }

  // Preencher unidade
  const selectUnidade = document.getElementById('unidadeProdutoEditar');
  if (selectUnidade) {
    selectUnidade.value = produto.unidade_medida || 'UN';
    console.log('Unidade selecionada:', produto.unidade_medida);
  }

  // Mostrar imagem atual
  const preview = document.getElementById('previewImagemEditar');
  if (preview) {
    if (produto.imagem) {
      preview.src = produto.imagem;
      preview.style.display = 'block';
    } else {
      preview.style.display = 'none';
    }
  }

  // Mostrar modal
  const modal = new bootstrap.Modal(document.getElementById('modalEditar'));
  modal.show();
}

function excluirProduto(id) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) {
    console.error('Produto não encontrado');
    return;
  }

  document.getElementById('idProdutoExcluir').value = id;
  const modalExcluir = new bootstrap.Modal(
    document.getElementById('modalExcluir')
  );
  modalExcluir.show();
}

function abrirModalEntrada(id) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) {
    console.error('Produto não encontrado');
    return;
  }

  document.getElementById('produtoId').value = id;
  const precoInput = document.getElementById('precoEntrada');
  if (precoInput) {
    precoInput.value = formatarPrecoParaInput(0);
  }

  const modalEntrada = new bootstrap.Modal(
    document.getElementById('modalEntrada')
  );
  modalEntrada.show();
}

function abrirModalSaida(id) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) {
    console.error('Produto não encontrado');
    return;
  }

  const produtoIdInput = document.getElementById('produtoId2');
  const precoInput = document.getElementById('precoSaida');

  if (produtoIdInput) {
    produtoIdInput.value = id;
  }

  if (precoInput) {
    precoInput.value = formatarPrecoParaInput(produto.preco);
  }

  const modalSaida = new bootstrap.Modal(document.getElementById('modalSaida'));
  modalSaida.show();
}

// Funções de formatação de preço
function formatarPreco(input) {
  let valor = input.value.replace(/\D/g, '');
  valor = (valor / 100).toFixed(2);
  input.value = formatarPrecoParaExibicao(valor);
}

function formatarPrecoParaExibicao(valor) {
  if (!valor) return 'R$ 0,00';
  
  // Converter para número
  const numero = typeof valor === 'string' ? parseFloat(valor) : valor;
  
  // Formatar com R$ e duas casas decimais
  return `R$ ${numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatarPrecoParaInput(valor) {
  if (!valor) return '0,00';

  // Converter para número
  const numero = typeof valor === 'string' ? parseFloat(valor) : valor;
  
  // Formatar com duas casas decimais
  return numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function converterPrecoParaNumero(precoStr) {
  if (!precoStr) return 0;
  return parseFloat(precoStr.replace(/[^\d,]/g, '').replace(',', '.'));
}

// Adicionar formatação de preço para todos os inputs de preço
document.addEventListener('DOMContentLoaded', function() {
  const precoInputs = document.querySelectorAll('input[data-tipo="preco"]');
  precoInputs.forEach((input) => {
    input.addEventListener('input', function(e) {
      formatarPreco(e.target);
    });
  });
});

function previewImagemEditar(input) {
  const preview = document.getElementById('previewImagemEditar');
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.src = e.target.result;
      preview.style.display = 'block';
    };

    reader.readAsDataURL(input.files[0]);
  }
}

function buscarSaida() {
  const termo = document.getElementById('buscarSaida').value.toLowerCase();

  saidasFiltradas = saidas.filter((saida) => {
    const cliente = clientes.find((c) => c.id === saida.idClientes);
    const produto = produtosOriginais.find((p) => p.id === saida.idProdutos);

    return (
      (cliente && cliente.nome.toLowerCase().includes(termo)) ||
      (produto && produto.nome.toLowerCase().includes(termo)) ||
      saida.quantidade.toString().includes(termo) ||
      saida.preco.toString().includes(termo)
    );
  });

  mostrarPaginaSaidas(1);
}

function filtrarSaidasPorData() {
  const dataFiltro = document.getElementById('dataFiltroSaida').value;

  if (!dataFiltro) {
    saidasFiltradas = [...saidas];
  } else {
    const dataFiltroObj = new Date(dataFiltro);
    dataFiltroObj.setHours(0, 0, 0, 0);

    saidasFiltradas = saidas.filter((saida) => {
      const dataSaida = new Date(saida.created_at);
      dataSaida.setHours(0, 0, 0, 0);
      return dataSaida.getTime() === dataFiltroObj.getTime();
    });
  }

  mostrarPaginaSaidas(1);
}

function editarProduto(id) {
  console.log('Editando produto:', id);
  const produto = produtos.find(p => p.id === id);
  if (!produto) {
    console.error('Produto não encontrado');
    return;
  }
  
  console.log('Dados do produto:', produto);

  // Preencher campos básicos
  document.getElementById('idProdutoUpdate').value = produto.id;
  document.getElementById('codigoProdutoEditar').value = produto.codigo_produto || '';
  document.getElementById('nomeProduto').value = produto.nome || '';
  document.getElementById('descricaoProduto').value = produto.descricao || '';
  
  // Formatar e preencher o preço
  const precoInput = document.getElementById('precoProduto');
  if (precoInput) {
    const precoFormatado = formatarPrecoParaExibicao(produto.preco);
    console.log('Preço original:', produto.preco);
    console.log('Preço formatado:', precoFormatado);
    precoInput.value = precoFormatado;
  }

  // Preencher categoria
  const selectCategoria = document.getElementById('categoriaProdutoEditar');
  if (selectCategoria) {
    selectCategoria.value = produto.idCategoria || '';
    console.log('Categoria selecionada:', produto.idCategoria);
  }

  // Preencher unidade
  const selectUnidade = document.getElementById('unidadeProdutoEditar');
  if (selectUnidade) {
    selectUnidade.value = produto.unidade_medida || 'UN';
    console.log('Unidade selecionada:', produto.unidade_medida);
  }

  // Mostrar imagem atual
  const preview = document.getElementById('previewImagemEditar');
  if (preview) {
    if (produto.imagem) {
      preview.src = produto.imagem;
      preview.style.display = 'block';
    } else {
      preview.style.display = 'none';
    }
  }

  // Mostrar modal
  const modal = new bootstrap.Modal(document.getElementById('modalEditar'));
  modal.show();
}

function excluirProduto(id) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) {
    console.error('Produto não encontrado');
    return;
  }

  document.getElementById('idProdutoExcluir').value = id;
  const modalExcluir = new bootstrap.Modal(
    document.getElementById('modalExcluir')
  );
  modalExcluir.show();
}

function abrirModalEntrada(id) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) {
    console.error('Produto não encontrado');
    return;
  }

  document.getElementById('produtoId').value = id;
  const precoInput = document.getElementById('precoEntrada');
  if (precoInput) {
    precoInput.value = formatarPrecoParaInput(0);
  }

  const modalEntrada = new bootstrap.Modal(
    document.getElementById('modalEntrada')
  );
  modalEntrada.show();
}

function abrirModalSaida(id) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) {
    console.error('Produto não encontrado');
    return;
  }

  const produtoIdInput = document.getElementById('produtoId2');
  const precoInput = document.getElementById('precoSaida');

  if (produtoIdInput) {
    produtoIdInput.value = id;
  }

  if (precoInput) {
    precoInput.value = formatarPrecoParaInput(produto.preco);
  }

  const modalSaida = new bootstrap.Modal(document.getElementById('modalSaida'));
  modalSaida.show();
}

// Funções de gerenciamento de categorias
function editarCategoria(id) {
  const categoria = categorias.find((c) => c.id === id);
  if (!categoria) {
    console.error("Categoria não encontrada");
    return;
  }

  // Preencher campos do formulário
  document.getElementById("idCategoriaEditar").value = id;
  document.getElementById("nomeCategoriaEditar").value = categoria.nome;
  document.getElementById("descricaoCategoriaEditar").value =
    categoria.descricao || "";

  // Abre o modal de edição
  const modalEditarCategoria = new bootstrap.Modal(
    document.getElementById("modalEditarCategoria")
  );
  modalEditarCategoria.show();
}

function excluirCategoria(id) {
  const categoria = categorias.find((c) => c.id === id);
  if (!categoria) {
    console.error("Categoria não encontrada");
    return;
  }

  // Preenche o ID no campo oculto
  document.getElementById("idCategoriaExcluir").value = id;

  // Abre o modal de exclusão
  const modalExcluirCategoria = new bootstrap.Modal(
    document.getElementById("modalExcluirCategoria")
  );
  modalExcluirCategoria.show();
}

// Funções de gerenciamento de entradas e saídas
function excluirEntrada(id) {
  const entrada = entradas.find((e) => e.id === id);
  if (!entrada) {
    console.error("Entrada não encontrada");
    return;
  }

  document.getElementById("idEntradaExcluir").value = id;
  const modalExcluirEntrada = new bootstrap.Modal(
    document.getElementById("modalExcluirEntrada")
  );
  modalExcluirEntrada.show();
}

function excluirSaida(id) {
  const saida = saidas.find((s) => s.id === id);
  if (!saida) {
    console.error("Saída não encontrada");
    return;
  }

  document.getElementById("idSaidaExcluir").value = id;
  const modalExcluirSaida = new bootstrap.Modal(
    document.getElementById("modalExcluirSaida")
  );
  modalExcluirSaida.show();
}

// Event listeners para os formulários
document.addEventListener("DOMContentLoaded", function () {
  // Form de edição de categoria
  const formEditarCategoria = document.getElementById("categoria-editar");
  if (formEditarCategoria) {
    formEditarCategoria.addEventListener("submit", async function (e) {
      e.preventDefault();
      const formData = new FormData(this);

      try {
        const response = await $.ajax({
          type: "POST",
          url: `${window.location.origin + '/app'}/categoria-update`,
          data: formData,
          processData: false,
          contentType: false,
          dataType: "json",
        });

        // Fecha o modal
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("modalEditarCategoria")
        );
        if (modal) modal.hide();

        // Atualiza as categorias
        await fetchCategorias();
        preencherCategorias(categorias);

        exibirMensagemTemporariaSucesso("Categoria atualizada com sucesso!");
      } catch (error) {
        console.error("Erro ao editar categoria:", error);
        exibirMensagemTemporariaErro("Erro ao atualizar categoria");
      }
    });
  }

  // Form de exclusão de categoria
  const formExcluirCategoria = document.getElementById("categoria-excluir");
  if (formExcluirCategoria) {
    formExcluirCategoria.addEventListener("submit", async function (e) {
      e.preventDefault();
      const id = document.getElementById("idCategoriaExcluir").value;

      try {
        const response = await $.ajax({
          type: "POST",
          url: `${window.location.origin + '/app'}/categoria-delete`,
          data: { id: id },
          dataType: "json",
        });

        if (!response.ok) {
          throw new Error("Erro na requisição");
        }

        const data = await response.json();

        if (data.type === "error") {
          throw new Error(data.message || "Erro ao excluir categoria");
        }

        // Fecha o modal
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("modalExcluirCategoria")
        );
        if (modal) modal.hide();

        // Atualiza as categorias
        await fetchCategorias();
        preencherCategorias(categorias);

        exibirMensagemTemporariaSucesso("Categoria excluída com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir categoria:", error);
        exibirMensagemTemporariaErro("Erro ao excluir categoria");
      }
    });
  }

  // Form de exclusão de entrada
  const formExcluirEntrada = document.getElementById("entrada-excluir");
  if (formExcluirEntrada) {
    formExcluirEntrada.addEventListener("submit", async function (e) {
      e.preventDefault();
      const id = document.getElementById("idEntradaExcluir").value;

      try {
        const response = await $.ajax({
          type: "POST",
          url: `${window.location.origin + '/app'}/estoque-ed`,
          data: { id: id },
          dataType: "json",
        });

        if (response.type === "success") {
          // Fecha apenas o modal de exclusão
          const modalExcluir = bootstrap.Modal.getInstance(
            document.getElementById("modalExcluirEntrada")
          );
          if (modalExcluir) modalExcluir.hide();

          // Atualiza os dados
          await atualizarDadosEntrada();

          exibirMensagemTemporariaSucesso(response.message);
        } else {
          exibirMensagemTemporariaErro(
            response.message || "Erro ao excluir entrada"
          );
        }
      } catch (error) {
        console.error("Erro ao excluir entrada:", error);
        exibirMensagemTemporariaErro("Erro ao excluir entrada");
      }
    });
  }

  // Form de edição de entrada
  const formEditarEntrada = document.getElementById("entrada-editar");
  if (formEditarEntrada) {
    formEditarEntrada.addEventListener("submit", async function (e) {
      e.preventDefault();
      const formData = new FormData(this);

      try {
        const response = await $.ajax({
          type: "POST",
          url: `${window.location.origin + '/app'}/estoque-eu`,
          data: formData,
          processData: false,
          contentType: false,
          dataType: "json",
        });

        // Fecha apenas o modal de edição
        const modalEditar = bootstrap.Modal.getInstance(
          document.getElementById("modalEditarEntrada")
        );
        if (modalEditar) modalEditar.hide();

        // Atualiza os dados
        await atualizarDadosEntrada();

        exibirMensagemTemporariaSucesso("Entrada atualizada com sucesso!");
      } catch (error) {
        console.error("Erro ao editar entrada:", error);
        exibirMensagemTemporariaErro("Erro ao editar entrada");
      }
    });
  }

  // Form de exclusão de saída
  const formExcluirSaida = document.getElementById("saida-excluir");
  if (formExcluirSaida) {
    formExcluirSaida.addEventListener("submit", async function (e) {
      e.preventDefault();
      const id = document.getElementById("idSaidaExcluir").value;

      try {
        const response = await $.ajax({
          type: "POST",
          url: `${window.location.origin + '/app'}/estoque-sd`,
          data: { id: id },
          dataType: "json",
        });

        if (response.type === "success") {
          // Fecha apenas o modal de exclusão
          const modalExcluir = bootstrap.Modal.getInstance(
            document.getElementById("modalExcluirSaida")
          );
          if (modalExcluir) modalExcluir.hide();

          // Atualiza os dados
          await atualizarDadosSaida();

          exibirMensagemTemporariaSucesso(response.message);
        } else {
          exibirMensagemTemporariaErro(
            response.message || "Erro ao excluir saída"
          );
        }
      } catch (error) {
        console.error("Erro ao excluir saída:", error);
        exibirMensagemTemporariaErro("Erro ao excluir saída");
      }
    });
  }

  // Form de edição de saída
  const formEditarSaida = document.getElementById("saida-editar");
  if (formEditarSaida) {
    formEditarSaida.addEventListener("submit", async function (e) {
      e.preventDefault();
      const formData = new FormData(this);

      try {
        const response = await $.ajax({
          type: "POST",
          url: `${window.location.origin + '/app'}/estoque-su`,
          data: formData,
          processData: false,
          contentType: false,
          dataType: "json",
        });

        // Fecha apenas o modal de edição
        const modalEditar = bootstrap.Modal.getInstance(
          document.getElementById("modalEditarSaida")
        );
        if (modalEditar) modalEditar.hide();

        // Atualiza os dados
        await atualizarDadosSaida();

        exibirMensagemTemporariaSucesso("Saída atualizada com sucesso!");
      } catch (error) {
        console.error("Erro ao editar saída:", error);
        exibirMensagemTemporariaErro("Erro ao editar saída");
      }
    });
  }
});

// Funções para calcular quantidade do produto
function calcularQuantidadeProduto(produto) {
  if (!produto) return 0;

  let quantidadeTotal = 0;

  // Soma todas as entradas do produto
  entradas.forEach((entrada) => {
    if (entrada.produto_id === produto.id && entrada.quantidade) {
      quantidadeTotal += parseFloat(entrada.quantidade) || 0;
    }
  });

  // Subtrai todas as saídas do produto
  saidas.forEach((saida) => {
    if (saida.produto_id === produto.id && saida.quantidade) {
      quantidadeTotal -= parseFloat(saida.quantidade) || 0;
    }
  });

  return parseFloat(quantidadeTotal.toFixed(2));
}

// Funções para atualizar dados
async function atualizarDadosEntrada() {
  try {
    // Busca dados atualizados
    const [entradasResponse, produtosResponse] = await Promise.all([
      fetch(`${window.location.origin + '/app'}/getEntradas`),
      fetch(`${window.location.origin + '/app'}/getProdutos`),
    ]);

    if (!entradasResponse.ok || !produtosResponse.ok) {
      throw new Error("Erro ao buscar dados");
    }

    // Atualiza os dados globais
    entradas = await entradasResponse.json();
    produtos = await produtosResponse.json();

    // Atualiza quantidades dos produtos
    produtos.forEach((produto) => {
      produto.quantidade = calcularQuantidadeProduto(produto);
    });

    // Atualiza a lista filtrada
    entradasFiltradas = [...entradas];

    // Atualiza as visualizações
    mostrarPaginaEntradas(1);
    mostrarPagina(paginaAtual);
  } catch (error) {
    console.error("Erro ao atualizar dados de entrada:", error);
    exibirMensagemTemporariaErro("Erro ao atualizar dados");
  }
}

async function atualizarDadosSaida() {
  try {
    // Busca dados atualizados
    const [saidasResponse, produtosResponse] = await Promise.all([
      fetch(`${window.location.origin + '/app'}/getSaidas`),
      fetch(`${window.location.origin + '/app'}/getProdutos`),
    ]);

    if (!saidasResponse.ok || !produtosResponse.ok) {
      throw new Error("Erro ao buscar dados");
    }

    // Atualiza os dados globais
    saidas = await saidasResponse.json();
    produtos = await produtosResponse.json();

    // Atualiza quantidades dos produtos
    produtos.forEach((produto) => {
      produto.quantidade = calcularQuantidadeProduto(produto);
    });

    // Atualiza a lista filtrada
    saidasFiltradas = [...saidas];

    // Atualiza as visualizações
    mostrarPaginaSaidas(1);
    mostrarPagina(paginaAtual);
  } catch (error) {
    console.error("Erro ao atualizar dados de saída:", error);
    exibirMensagemTemporariaErro("Erro ao atualizar dados");
  }
}

// Form de exclusão de produto
const formExcluirProduto = document.getElementById("produto-excluir");
if (formExcluirProduto) {
  formExcluirProduto.addEventListener("submit", async function (e) {
    e.preventDefault();
    const id = document.getElementById("idProdutoExcluir").value;

    try {
      // Primeiro exclui todas as entradas e saídas relacionadas
      const entradasDoProduto = entradas.filter((e) => e.produto_id === id);
      const saidasDoProduto = saidas.filter((s) => s.produto_id === id);

      // Exclui entradas
      for (const entrada of entradasDoProduto) {
        await fetch(`${window.location.origin + '/app'}/estoque-ed`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `id=${entrada.id}`,
        });
      }

      // Exclui saídas
      for (const saida of saidasDoProduto) {
        await fetch(`${window.location.origin + '/app'}/estoque-sd`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `id=${saida.id}`,
        });
      }

      // Agora exclui o produto
      const response = await fetch(`${window.location.origin + '/app'}/produto-delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `id=${id}`,
      });

      if (!response.ok) {
        throw new Error("Erro na requisição");
      }

      const data = await response.json();

      if (data.type === "error") {
        throw new Error(data.message || "Erro ao excluir produto");
      }

      // Fecha o modal de exclusão
      const modalExcluir = bootstrap.Modal.getInstance(
        document.getElementById("modalExcluirProduto")
      );
      if (modalExcluir) modalExcluir.hide();

      // Atualiza todos os dados relacionados
      await Promise.all([fetchProdutos(), fetchEntradas(), fetchSaidas()]);

      // Atualiza as listas filtradas
      produtosFiltrados = [...produtos];
      entradasFiltradas = [...entradas];
      saidasFiltradas = [...saidas];

      // Atualiza todas as visualizações
      mostrarPagina(paginaAtual);
      mostrarPaginaEntradas(1);
      mostrarPaginaSaidas(1);

      exibirMensagemTemporariaSucesso(
        "Produto e seus registros excluídos com sucesso!"
      );
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      exibirMensagemTemporariaErro(error.message || "Erro ao excluir produto");
    }
  });
}

// Funções para mostrar páginas

// Função para remover backdrops manualmente
function removerBackdrops() {
  const backdrops = document.querySelectorAll(".modal-backdrop");
  backdrops.forEach((backdrop) => backdrop.remove());
  document.body.classList.remove("modal-open");
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
}

// Função para fechar todos os modais
function fecharTodosModais() {
  const modais = [
    "entradasModal",
    "saidasModal",
    "modalEditarEntrada",
    "modalEditarSaida",
    "modalExcluirEntrada",
    "modalExcluirSaida",
    "modalCadastrarEntrada",
    "modalCadastrarSaida",
  ];

  modais.forEach((id) => {
    const modal = bootstrap.Modal.getInstance(
      document.getElementById(id)
    );
    if (modal) {
      modal.hide();
    }
  });

  // Remove qualquer backdrop que possa ter ficado
  setTimeout(removerBackdrops, 150);
}

// Adiciona listeners para todos os modais
document.addEventListener("DOMContentLoaded", function () {
  const modais = [
    "entradasModal",
    "saidasModal",
    "modalEditarEntrada",
    "modalEditarSaida",
    "modalExcluirEntrada",
    "modalExcluirSaida",
    "modalCadastrarEntrada",
    "modalCadastrarSaida",
  ];

  modais.forEach((id) => {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.addEventListener("hidden.bs.modal", function () {
        setTimeout(removerBackdrops, 150);
      });

      elemento.addEventListener("show.bs.modal", function () {
        // Remove qualquer backdrop existente antes de mostrar o novo modal
        removerBackdrops();
      });
    }
  });
});

// Função para preencher a lista de fornecedores no datalist
function preencherSugestoesFornecedores() {
  const datalist = document.getElementById('listaFornecedores');
  if (!datalist) return;

  // Limpar lista atual
  datalist.innerHTML = '';

  // Adicionar cada fornecedor como uma opção
  fornecedores.forEach(fornecedor => {
    const option = document.createElement('option');
    option.value = fornecedor.nome;
    option.dataset.id = fornecedor.id;
    datalist.appendChild(option);
  });
}

// Adicionar evento para quando um fornecedor é selecionado
document.addEventListener('DOMContentLoaded', function() {
  const inputFornecedor = document.getElementById('entradaFornecedor');
  if (inputFornecedor) {
    inputFornecedor.addEventListener('input', function(e) {
      const fornecedor = fornecedores.find(f => f.nome === this.value);
      if (fornecedor) {
        // Se encontrou o fornecedor, pode armazenar o ID em um campo hidden
        const idFornecedorInput = inputFornecedor.parentNode.querySelector('#idFornecedor') || document.createElement('input');
        idFornecedorInput.type = 'hidden';
        idFornecedorInput.id = 'idFornecedor';
        idFornecedorInput.name = 'idFornecedor';
        idFornecedorInput.value = fornecedor.id;
        this.parentNode.appendChild(idFornecedorInput);
      }
    });
  }
});

// Atualizar a função fetchFornecedores para preencher as sugestões após carregar
async function fetchFornecedores() {
  try {
    const response = await fetch(`${window.location.origin + '/app'}/getFornecedores`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Dados brutos dos fornecedores:', data);
    
    fornecedores = Array.isArray(data) ? data : [];
    fornecedoresFiltrados = [...fornecedores];
    
    // Preencher as sugestões após carregar os fornecedores
    preencherSugestoesFornecedores();
    
    console.log('Fornecedores processados:', {
      total: fornecedores.length,
      primeiro: fornecedores[0],
      estrutura: fornecedores.length > 0 ? {
        id: typeof fornecedores[0].id,
        nome: typeof fornecedores[0].nome
      } : 'Sem fornecedores'
    });
  } catch (error) {
    console.error('Erro ao carregar fornecedores:', error);
    fornecedores = [];
    fornecedoresFiltrados = [];
  }
}

// Atualizar a função editarEntrada para preencher o fornecedor
function editarEntrada(id) {
  const entrada = entradas.find(e => e.id === id);
  if (!entrada) return;

  const fornecedor = fornecedores.find(f => parseInt(f.id) === parseInt(entrada.idFornecedores));
  const produto = produtos.find(p => parseInt(p.id) === parseInt(entrada.idProdutos));

  document.getElementById('idEntradaEditar').value = entrada.id;
  document.getElementById('entradaFornecedor').value = fornecedor ? fornecedor.nome : '';
  document.getElementById('entradaProduto').value = produto ? produto.nome : '';
  document.getElementById('entradaQuantidade').value = entrada.quantidade;
  document.getElementById('entradaPreco').value = formatarPrecoParaInput(entrada.preco);

  // Adicionar o ID do fornecedor em um campo hidden
  const idFornecedorInput = document.getElementById('idFornecedor') || document.createElement('input');
  idFornecedorInput.type = 'hidden';
  idFornecedorInput.id = 'idFornecedor';
  idFornecedorInput.name = 'idFornecedor';
  idFornecedorInput.value = entrada.idFornecedores;
  document.getElementById('entradaFornecedor').parentNode.appendChild(idFornecedorInput);

  const modalEditarEntrada = new bootstrap.Modal(document.getElementById('modalEditarEntrada'));
  modalEditarEntrada.show();
}

// Função para mostrar sugestões de fornecedores
function mostrarSugestoesFornecedores(input) {
  const termo = input.value.toLowerCase();
  const sugestoesDiv = input.parentNode.querySelector('.sugestoes-fornecedores');
  
  // Filtrar fornecedores baseado no termo de busca
  const sugestoesFiltradas = fornecedores.filter(f => 
    f.nome.toLowerCase().includes(termo)
  );
  
  // Limpar sugestões anteriores
  sugestoesDiv.innerHTML = '';
  
  if (sugestoesFiltradas.length > 0 && termo.length > 0) {
    // Criar elementos para cada sugestão
    sugestoesFiltradas.forEach(fornecedor => {
      const div = document.createElement('div');
      div.className = 'sugestao-item p-2 cursor-pointer hover-bg-light';
      div.style.cursor = 'pointer';
      div.style.padding = '8px';
      div.innerHTML = fornecedor.nome;
      
      // Adicionar hover effect
      div.addEventListener('mouseover', () => {
        div.style.backgroundColor = '#f8f9fa';
      });
      div.addEventListener('mouseout', () => {
        div.style.backgroundColor = 'white';
      });
      
      // Ao clicar na sugestão
      div.addEventListener('click', () => {
        input.value = fornecedor.nome;
        const idFornecedorInput = input.parentNode.querySelector('#idFornecedor');
        if (idFornecedorInput) {
          idFornecedorInput.value = fornecedor.id;
        }
        sugestoesDiv.style.display = 'none';
      });
      
      sugestoesDiv.appendChild(div);
    });
    
    // Mostrar o dropdown
    sugestoesDiv.style.display = 'block';
  } else {
    sugestoesDiv.style.display = 'none';
  }
}

// Configurar eventos para os inputs de fornecedor
document.addEventListener('DOMContentLoaded', function() {
  const inputsFornecedor = document.querySelectorAll('#entradaFornecedor');
  
  inputsFornecedor.forEach(input => {
    // Ao digitar no input
    input.addEventListener('input', () => {
      mostrarSugestoesFornecedores(input);
    });
    
    // Ao focar no input
    input.addEventListener('focus', () => {
      if (input.value.length > 0) {
        mostrarSugestoesFornecedores(input);
      }
    });
    
    // Fechar sugestões ao clicar fora
    document.addEventListener('click', (e) => {
      if (!input.parentNode.contains(e.target)) {
        const sugestoesDiv = input.parentNode.querySelector('.sugestoes-fornecedores');
        if (sugestoesDiv) {
          sugestoesDiv.style.display = 'none';
        }
      }
    });
  });
});

function buscarEntrada() {
  const termo = document.getElementById('buscarEntrada').value.toLowerCase();
  
  entradasFiltradas = entradas.filter(entrada => {
    const fornecedor = fornecedores.find(f => f.id === entrada.idFornecedores);
    const produto = produtos.find(p => p.id === entrada.idProdutos);
    
    return (fornecedor && fornecedor.nome.toLowerCase().includes(termo)) ||
           (produto && produto.nome.toLowerCase().includes(termo)) ||
           entrada.quantidade.toString().includes(termo) ||
           entrada.preco.toString().includes(termo);
  });
  
  mostrarPaginaEntradas(1);
}

function filtrarEntradasPorData() {
  const dataFiltro = document.getElementById('dataFiltroEntrada').value;
  
  if (!dataFiltro) {
    entradasFiltradas = [...entradas];
  } else {
    const dataFiltroObj = new Date(dataFiltro);
    dataFiltroObj.setHours(0, 0, 0, 0);
    
    entradasFiltradas = entradas.filter(entrada => {
      const dataEntrada = new Date(entrada.created_at);
      dataEntrada.setHours(0, 0, 0, 0);
      return dataEntrada.getTime() === dataFiltroObj.getTime();
    });
  }
  
  mostrarPaginaEntradas(1);
}

function editarProduto(id) {
  console.log('Editando produto:', id);
  const produto = produtos.find(p => p.id === id);
  if (!produto) {
    console.error('Produto não encontrado');
    return;
  }
  
  console.log('Dados do produto:', produto);

  // Preencher campos do formulário
  document.getElementById('idProdutoUpdate').value = produto.id;
  document.getElementById('codigoProdutoEditar').value = produto.codigo_produto || '';
  document.getElementById('nomeProduto').value = produto.nome || '';
  document.getElementById('descricaoProduto').value = produto.descricao || '';
  
  // Formatar e preencher o preço
  const precoInput = document.getElementById('precoProduto');
  if (precoInput) {
    const precoFormatado = formatarPrecoParaExibicao(produto.preco);
    console.log('Preço original:', produto.preco);
    console.log('Preço formatado:', precoFormatado);
    precoInput.value = precoFormatado;
  }

  // Preencher categoria
  const selectCategoria = document.getElementById('categoriaProdutoEditar');
  if (selectCategoria) {
    selectCategoria.value = produto.idCategoria || '';
    console.log('Categoria selecionada:', produto.idCategoria);
  }
  
  // Preencher unidade de medida
  const selectUnidade = document.getElementById('unidadeProdutoEditar');
  if (selectUnidade) {
    selectUnidade.value = produto.unidade_medida || 'UN';
    console.log('Unidade selecionada:', produto.unidade_medida);
  }
  
  // Mostrar imagem atual do produto
  const preview = document.getElementById('previewImagemEditar');
  if (preview) {
    if (produto.imagem) {
      preview.src = produto.imagem;
      preview.style.display = 'block';
    } else {
      preview.style.display = 'none';
    }
  }

  const modal = new bootstrap.Modal(document.getElementById('modalEditar'));
  modal.show();
}

function excluirSaida(id) {
  const saida = saidas.find(s => s.id === id);
  if (!saida) return;

  document.getElementById('idSaidaExcluir').value = id;
  
  // Armazenar informações da saída para atualização do estoque
  const saidaExcluir = document.getElementById('saidaExcluir');
  if (saidaExcluir) {
    saidaExcluir.dataset.produtoId = saida.idProdutos;
    saidaExcluir.dataset.quantidade = saida.quantidade;
  }

  const modalExcluirSaida = new bootstrap.Modal(document.getElementById('modalExcluirSaida'));
  modalExcluirSaida.show();
}

function confirmarExclusaoSaida() {
  const id = document.getElementById('idSaidaExcluir').value;
  const saidaExcluir = document.getElementById('saidaExcluir');
  const produtoId = saidaExcluir?.dataset.produtoId;
  const quantidade = saidaExcluir?.dataset.quantidade;

  $.ajax({
    url: `${window.location.origin + '/app'}/estoque-sd`,
    type: 'POST',
    data: {
      idSaidaExcluir: id,
      idProdutos: produtoId,
      quantidade: quantidade
    },
    success: function(response) {
      try {
        if (typeof response === 'string') {
          response = JSON.parse(response);
        }
        
        if (response.type === 'success') {
          const modalExcluirSaida = bootstrap.Modal.getInstance(document.getElementById('modalExcluirSaida'));
          if (modalExcluirSaida) {
            modalExcluirSaida.hide();
          }

          // Atualizar dados
          fetchSaidas().then(() => {
            saidasFiltradas = [...saidas];
            mostrarPaginaSaidas(1);
          });
          
          fetchProdutos().then(() => {
            produtos = response.produtos;
            produtosFiltrados = [...produtos];
            mostrarPagina(1);
          });

          exibirMensagemTemporariaSucesso(response.message);
        } else {
          exibirMensagemTemporariaErro(response.message);
        }
      } catch (e) {
        console.error('Erro ao processar resposta:', e);
        exibirMensagemTemporariaErro("Erro ao processar a resposta do servidor");
      }
    },
    error: function(xhr, status, error) {
      console.error("Erro ao excluir saída:", error);
      exibirMensagemTemporariaErro("Erro ao excluir saída");
    }
  });
}

// Função para mostrar a página de saídas
function mostrarPaginaSaidas(pagina) {
    const inicio = (pagina - 1) * 10;
    const fim = inicio + 10;
    const tbody = document.getElementById('corpoTabelaSaidas');

    if (!tbody) {
        console.error('Elemento corpoTabelaSaidas não encontrado');
        return;
    }

    let html = '';
    if (!Array.isArray(saidasFiltradas) || saidasFiltradas.length === 0) {
        html = '<tr><td colspan="6" class="text-center">Nenhuma saída encontrada.</td></tr>';
    } else {
        html = saidasFiltradas.slice(inicio, fim).map(saida => {
            try {
                const cliente = clientes.find(c => parseInt(c.id) === parseInt(saida.idClientes));
                const produto = produtos.find(p => parseInt(p.id) === parseInt(saida.idProdutos));

                return `<tr>
                    <td>${cliente?.nome || 'Cliente não encontrado'}</td>
                    <td>${produto?.nome || 'Produto não encontrado'}</td>
                    <td>${saida.quantidade}</td>
                    <td>${formatarPrecoParaExibicao(saida.preco)}</td>
                    <td>${formatarData(saida.created_at)}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="editarSaida(${saida.id})">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="excluirSaida(${saida.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>`;
            } catch (error) {
                console.error('Erro ao processar saída:', error, saida);
                return '<tr><td colspan="6" class="text-center text-danger">Erro ao processar saída</td></tr>';
            }
        }).join('');
    }

    tbody.innerHTML = html;

    // Configurar paginação
    configurarPaginacao(saidasFiltradas.length, mostrarPaginaSaidas, '#paginacaoSaidas', pagina);
}

// Função para editar saída
function editarSaida(id) {
    console.log('Editando saída:', id);
    const saida = saidas.find(s => s.id === id);
    if (!saida) {
        console.error('Saída não encontrada');
        return;
    }
    
    console.log('Dados da saída:', saida);

    // Preencher campos do formulário
    document.getElementById('idEditarSaida').value = id;
    
    // Buscar e preencher informações do produto
    const produto = produtos.find(p => p.id === saida.idProdutos);
    if (produto) {
        document.getElementById('saidaProduto').value = produto.nome;
    }
    
    // Preencher quantidade
    document.getElementById('saidaQuantidade').value = saida.quantidade;
    
    // Preencher preços
    const precoAtual = document.getElementById('saidaPrecoAtual');
    const precoNovo = document.getElementById('saidaPreco');

    if (precoAtual) {
        precoAtual.value = formatarPrecoParaExibicao(saida.preco);
    }
    
    if (precoNovo) {
        precoNovo.value = formatarPrecoParaExibicao(saida.preco);
    }

    // Mostrar modal
    const modalEditarSaida = new bootstrap.Modal(document.getElementById('modalEditarSaida'));
    modalEditarSaida.show();
}

// Função para buscar saídas
function buscarSaida() {
    const termo = document.getElementById('buscarSaida').value.toLowerCase();
    
    saidasFiltradas = saidas.filter(saida => {
        const cliente = clientes.find(c => c.id === saida.idClientes);
        const produto = produtos.find(p => p.id === saida.idProdutos);
        
        return (cliente && cliente.nome.toLowerCase().includes(termo)) ||
               (produto && produto.nome.toLowerCase().includes(termo)) ||
               saida.quantidade.toString().includes(termo) ||
               saida.preco.toString().includes(termo);
    });
    
    mostrarPaginaSaidas(1);
}

// Função para filtrar saídas por data
function filtrarSaidasPorData() {
    const dataFiltro = document.getElementById('dataFiltroSaida').value;
    
    if (!dataFiltro) {
        saidasFiltradas = [...saidas];
    } else {
        const dataFiltroObj = new Date(dataFiltro);
        dataFiltroObj.setHours(0, 0, 0, 0);
        
        saidasFiltradas = saidas.filter(saida => {
            const dataSaida = new Date(saida.created_at);
            dataSaida.setHours(0, 0, 0, 0);
            return dataSaida.getTime() === dataFiltroObj.getTime();
        });
    }
    
    mostrarPaginaSaidas(1);
}

function editarSaida(id) {
    console.log('Editando saída:', id);
    const saida = saidas.find(s => s.id === id);
    if (!saida) {
        console.error('Saída não encontrada');
        return;
    }
    
    console.log('Dados da saída:', saida);

    // Preencher campos do formulário
    document.getElementById('idEditarSaida').value = id;
    
    // Buscar e preencher informações do produto
    const produto = produtos.find(p => p.id === saida.idProdutos);
    if (produto) {
        document.getElementById('saidaProduto').value = produto.nome;
    }
    
    // Preencher quantidade e preço
    document.getElementById('saidaQuantidade').value = saida.quantidade;
    
    // Formatar e preencher o preço
    const precoInput = document.getElementById('saidaPreco');
    if (precoInput) {
        const precoFormatado = formatarPrecoParaExibicao(saida.preco);
        console.log('Preço original:', saida.preco);
        console.log('Preço formatado:', precoFormatado);
        precoInput.value = precoFormatado;
    }

    // Mostrar modal
    const modalEditarSaida = new bootstrap.Modal(document.getElementById('modalEditarSaida'));
    modalEditarSaida.show();
}
