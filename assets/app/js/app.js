const BASE_URL = '/stockDeps/app';
const ITENS_POR_PAGINA = 8;
const MAX_BOTOES_PAGINACAO = 5;

// Variáveis de estado global
let produtos = [];
let clientes = [];
let fornecedores = [];
let entradas = [];
let saidas = [];
let categorias = [];

// Variáveis de paginação
let paginaAtual = 1;
let paginaAtualEntradas = 1;
let paginaAtualSaidas = 1;

// Dados para filtros
let entradasFiltradas = [];
let saidasFiltradas = [];
let produtosFiltrados = [];
let produtosOrdenados = [];
let produtosOriginais = [];
let entradasOriginais = [];
let saidasOriginais = [];

/**
 * Carrega produtos da API e inicializa tabela
 */
async function fetchProdutos() {
  try {
    const response = await fetch(`${BASE_URL}/getProdutos`);
    produtosOriginais = await response.json();
    produtosFiltrados = [...produtosOriginais];
    produtosOrdenados = [...produtosFiltrados];
    buscarProduto();
    mostrarPagina(paginaAtual);
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
  }
}

/**
 * Carrega categorias da API e inicializa componentes
 */
async function fetchCategorias() {
  try {
    const response = await fetch(`${BASE_URL}/getCategorias`);
    categorias = await response.json();
    preencherCategorias(categorias, alterarTabelaPorCategoriaSelecionada);
    renderizarTabela();
  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
  }
}

/**
 * Carrega clientes da API
 */
async function fetchClientes() {
  try {
    const response = await fetch(`${BASE_URL}/getClientes`);
    clientes = await response.json();
    preencherClientes(clientes);
  } catch (error) {
    console.error('Erro ao carregar clientes:', error);
  }
}

/**
 * Carrega fornecedores da API
 */
async function fetchFornecedores() {
  try {
    const response = await fetch(`${BASE_URL}/getFornecedores`);
    fornecedores = await response.json();
    preencherFornecedores(fornecedores);
  } catch (error) {
    console.error('Erro ao carregar fornecedores:', error);
  }
}

/**
 * Carrega entradas da API e inicializa tabela
 */
async function fetchEntradas() {
  try {
    const response = await fetch(`${BASE_URL}/getEntradas`);
    entradas = await response.json();
    entradasOriginais = [...entradas];
    entradasFiltradas = [...entradas];
    mostrarPaginaEntradas(paginaAtualEntradas);
    buscarEntrada();
    filtrarEntradasPorData();
  } catch (error) {
    console.error('Erro ao carregar entradas:', error);
  }
}

/**
 * Carrega saídas da API e inicializa tabela
 */
async function fetchSaidas() {
  try {
    const response = await fetch(`${BASE_URL}/getSaidas`);
    saidas = await response.json();
    saidasOriginais = [...saidas];
    saidasFiltradas = [...saidas];
    mostrarPaginaSaidas(paginaAtualSaidas);
    buscarSaida();
    filtrarSaidasPorData();
  } catch (error) {
    console.error('Erro ao carregar saídas:', error);
  }
}

/**
 * Carrega todos os dados necessários
 */
function loadAllData() {
  fetchProdutos();
  fetchCategorias();
  fetchClientes();
  fetchFornecedores();
  fetchEntradas();
  fetchSaidas();
}

/**
 * Formata data ISO para formato brasileiro
 * @param {string} dataISO - Data em formato ISO
 * @returns {string} Data formatada
 */
function formatarData(dataISO) {
  const data = new Date(dataISO);
  return data.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/**
 * Renderiza tabela de categorias
 */
function renderizarTabela() {
  const tbody = document.getElementById("corpoTabelaCategorias");
  if (!tbody) return;
  
  tbody.innerHTML = "";

  categorias.forEach((categoria) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${categoria.nome}</td>
      <td>${categoria.descricao}</td>
      <td class="text-center">
        <div class="d-flex justify-content-center align-items-center gap-2">
          <button class="btn btn-primary btn-sm action-btn" onclick="editarCategoria(${categoria.id})" data-bs-toggle="tooltip" title="Editar categoria">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-danger btn-sm action-btn" onclick="excluirCategoria(${categoria.id})" data-bs-toggle="tooltip" title="Excluir categoria">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Inicializa os tooltips
  const tooltips = document.querySelectorAll('#tabelaCategorias [data-bs-toggle="tooltip"]');
  tooltips.forEach(tooltip => {
    new bootstrap.Tooltip(tooltip);
  });
}

/**
 * Configura a busca de produtos
 */
function buscarProduto() {
  const inputBuscarProduto = document.getElementById("buscarProduto");
  if (!inputBuscarProduto) return;
  
  inputBuscarProduto.addEventListener("input", function () {
    const termoBusca = inputBuscarProduto.value.toLowerCase();

    produtosFiltrados = produtosOriginais.filter(
      (produto) =>
        produto.nome.toLowerCase().includes(termoBusca) ||
        produto.codigo_produto.toLowerCase().includes(termoBusca)
    );

    produtosOrdenados = [...produtosFiltrados];
    paginaAtual = 1;
    mostrarPagina(paginaAtual);
  });
}

/**
 * Remove acentos de uma string
 * @param {string} str - String original
 * @returns {string} String sem acentos
 */
function removerAcentos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Configura a busca de entradas
 */
function buscarEntrada() {
  const inputBuscarEntrada = document.getElementById("buscarEntrada");
  if (!inputBuscarEntrada) return;
  
  inputBuscarEntrada.addEventListener("input", function () {
    const termoBusca = removerAcentos(inputBuscarEntrada.value.toLowerCase());

    entradasFiltradas = entradas.filter((entrada) => {
      const produto = produtosOriginais.find((p) => p.id == entrada.idProdutos);
      const fornecedor = fornecedores.find((f) => f.id == entrada.idFornecedor);
      
      return (
        removerAcentos((produto?.nome || "").toLowerCase()).includes(termoBusca) ||
        removerAcentos((fornecedor?.nome || "").toLowerCase()).includes(termoBusca)
      );
    });

    paginaAtualEntradas = 1;
    mostrarPaginaEntradas(paginaAtualEntradas);
  });
}

/**
 * Configura a busca de saídas
 */
function buscarSaida() {
  const inputBuscarSaida = document.getElementById("buscarSaida");
  if (!inputBuscarSaida) return;
  
  inputBuscarSaida.addEventListener("input", function () {
    const termoBusca = removerAcentos(inputBuscarSaida.value.toLowerCase());

    saidasFiltradas = saidas.filter((saida) => {
      const produto = produtosOriginais.find((p) => p.id == saida.idProdutos);
      const cliente = Array.isArray(clientes)
        ? clientes.find((c) => c.id == saida.idClientes)?.nome || "Cliente não encontrado"
        : "Cliente não cadastrado";

      return (
        removerAcentos((produto?.nome || "").toLowerCase()).includes(termoBusca) ||
        removerAcentos(cliente.toLowerCase()).includes(termoBusca)
      );
    });

    paginaAtualSaidas = 1;
    mostrarPaginaSaidas(paginaAtualSaidas);
  });
}

/**
 * Mostra uma página específica de entradas
 * @param {number} pagina - Número da página
 * @param {Array} entradasParam - Opcional: dados para sobrescrever entradasFiltradas
 */
function mostrarPaginaEntradas(pagina, entradasParam) {
  const entradasAExibir = entradasParam || entradasFiltradas;
  const tabela = document.getElementById("corpoTabelaEntradas");
  
  if (!tabela) return;
  
  const inicio = (pagina - 1) * ITENS_POR_PAGINA;
  const fim = inicio + ITENS_POR_PAGINA;
  
  // Ordenar entradas da mais recente para a mais antiga
  const entradasOrdenadas = [...entradasAExibir].sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  );
  
  const entradasPagina = entradasOrdenadas.slice(inicio, fim);
  tabela.innerHTML = "";

  // Exibir mensagem se não houver entradas
  const mensagemNenhumaEntrada = document.getElementById("mensagemNenhumaEntrada");
  if (mensagemNenhumaEntrada) {
    mensagemNenhumaEntrada.style.display = entradasPagina.length === 0 ? "block" : "none";
  }
  
  if (entradasPagina.length === 0) return;

  // Preencher tabela
  entradasPagina.forEach((entrada) => {
    const produto = produtosOriginais.find((p) => p.id == entrada.idProdutos);
    const fornecedor = fornecedores ? fornecedores.find((f) => f.id == entrada.idFornecedor) : null;
    
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${produto?.nome || "Produto não encontrado"}</td>
      <td>${fornecedor?.nome || entrada.fornecedor || "Fornecedor não encontrado"}</td>
      <td>${entrada.quantidade}</td>
      <td>R$ ${parseFloat(entrada.preco).toFixed(2)}</td>
      <td>${formatarData(entrada.created_at)}</td>
      <td class="text-center">
        <div class="d-flex gap-2 justify-content-center">
          <button class="btn btn-primary btn-sm action-btn" onclick="editarEntrada(${entrada.id})" data-bs-toggle="tooltip" title="Editar entrada">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-danger btn-sm action-btn" onclick="excluirEntrada(${entrada.id})" data-bs-toggle="tooltip" title="Excluir entrada">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    `;
    tabela.appendChild(tr);
  });

  // Inicializa tooltips
  const tooltips = document.querySelectorAll('#tabelaEntradas [data-bs-toggle="tooltip"]');
  tooltips.forEach(tooltip => {
    new bootstrap.Tooltip(tooltip);
  });

  // Atualizar paginação
  configurarPaginacao(
    entradasAExibir.length,
    mostrarPaginaEntradas,
    "paginacaoEntradas",
    pagina
  );
}

function mostrarPaginaSaidas(pagina, saidasParam) {
  // Usar os dados passados como parâmetro ou os filtrados
  const saidasAExibir = saidasParam || saidasFiltradas;
  
  const inicio = (pagina - 1) * ITENS_POR_PAGINA;
  const fim = inicio + ITENS_POR_PAGINA;

  // Ordenar as saídas da mais recente para a mais antiga
  const saidasOrdenadas = [...saidasAExibir].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Paginar os resultados corretamente
  const saidasPagina = saidasOrdenadas.slice(inicio, fim);

  // Selecionar a tabela e limpar seu conteúdo - corrigindo o seletor para corpoTabelaSaidas
  const tabela = document.getElementById("corpoTabelaSaidas");
  if (!tabela) {
    console.error("Elemento com ID 'corpoTabelaSaidas' não encontrado");
    return;
  }
  
  tabela.innerHTML = "";

  // Exibir mensagem caso não haja saídas
  const mensagemNenhumaSaida = document.getElementById("mensagemNenhumaSaida");
  if (mensagemNenhumaSaida) {
    mensagemNenhumaSaida.style.display = saidasPagina.length === 0 ? "block" : "none";
  }

  // Preencher a tabela com as saídas paginadas
  saidasPagina.forEach((saida) => {
    const produto = produtosOriginais.find((p) => p.id == saida.idProdutos);
    let clienteNome = "Cliente não identificado";
    
    if (saida.cliente) {
      clienteNome = saida.cliente;
    } else if (Array.isArray(clientes) && saida.idClientes) {
      const cliente = clientes.find((c) => c.id == saida.idClientes);
      clienteNome = cliente ? cliente.nome : "Cliente não encontrado";
    }
    
    const tr = document.createElement("tr");
    
    // Criar célula para produto
    const tdProduto = document.createElement("td");
    tdProduto.textContent = produto?.nome || "Produto não encontrado";
    tr.appendChild(tdProduto);
    
    // Criar célula para cliente
    const tdCliente = document.createElement("td");
    tdCliente.textContent = clienteNome;
    tr.appendChild(tdCliente);
    
    // Criar célula para quantidade
    const tdQuantidade = document.createElement("td");
    tdQuantidade.textContent = saida.quantidade;
    tr.appendChild(tdQuantidade);
    
    // Criar célula para preço
    const tdPreco = document.createElement("td");
    tdPreco.textContent = saida.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    tr.appendChild(tdPreco);
    
    // Criar célula para data
    const tdData = document.createElement("td");
    tdData.textContent = formatarData(saida.created_at);
    tr.appendChild(tdData);
    
    // Criar célula de ações
    const tdAcoes = document.createElement("td");
    tdAcoes.className = "text-center";
    
    // Criar container para botões
    const acoesBtns = document.createElement("div");
    acoesBtns.className = "d-flex gap-2 justify-content-center";
    
    // Botão editar
    const btnEditar = document.createElement("button");
    btnEditar.className = "btn btn-primary btn-sm action-btn";
    btnEditar.setAttribute("data-bs-toggle", "tooltip");
    btnEditar.setAttribute("title", "Editar saída");
    btnEditar.setAttribute("data-saida-id", saida.id);
    
    // Usar uma função anônima para evitar problemas com o escopo
    btnEditar.addEventListener("click", function(event) {
      event.preventDefault();
      event.stopPropagation();
      editarSaida(saida.id);
    });
    
    const iconEditar = document.createElement("i");
    iconEditar.className = "fas fa-edit";
    btnEditar.appendChild(iconEditar);
    
    // Botão excluir
    const btnExcluir = document.createElement("button");
    btnExcluir.className = "btn btn-danger btn-sm action-btn";
    btnExcluir.setAttribute("data-bs-toggle", "modal");
    btnExcluir.setAttribute("data-bs-target", "#modalExcluirSaida");
    btnExcluir.setAttribute("data-bs-toggle", "tooltip");
    btnExcluir.setAttribute("title", "Excluir saída");
    btnExcluir.onclick = () => excluirSaida(saida.id);
    
    const iconExcluir = document.createElement("i");
    iconExcluir.className = "fas fa-trash";
    btnExcluir.appendChild(iconExcluir);
    
    // Adicionar botões ao container
    acoesBtns.appendChild(btnEditar);
    acoesBtns.appendChild(btnExcluir);
    
    // Adicionar container à célula
    tdAcoes.appendChild(acoesBtns);
    
    // Adicionar célula à linha
    tr.appendChild(tdAcoes);
    
    // Adicionar linha à tabela
    tabela.appendChild(tr);
  });

  // Inicializar tooltips
  setTimeout(() => {
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => {
      new bootstrap.Tooltip(tooltip);
    });
  }, 100);

  // Configurar a paginação
  configurarPaginacao(saidasAExibir.length, (p) => mostrarPaginaSaidas(p, saidasAExibir), "#paginacaoSaidas", pagina);
}

function filtrarEntradasPorData() {
  const dataFiltro = document.querySelector("#filtroDataEntrada").value; // Pega a data do filtro
  if (!dataFiltro) return; // Não faz nada se o campo de data estiver vazio

  // Filtra as entradas com a data selecionada
  entradasFiltradas = entradas.filter((entrada) => {
    // Extrai a parte da data de created_at (formato YYYY-MM-DD)
    const dataEntrada = entrada.created_at.split(" ")[0]; // Pega a data sem a hora (ex: 2024-12-22)

    // Compara as datas no formato YYYY-MM-DD
    return dataEntrada === dataFiltro;
  });

  // Verifica se há entradas filtradas, caso contrário exibe uma mensagem
  if (entradasFiltradas.length === 0) {
    mostrarMensagemNenhumaEntrada();
  } else {
    // Exibe a primeira página das entradas filtradas
    mostrarPaginaEntradas(1);
  }
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
  const totalPaginas = Math.ceil(totalItens / ITENS_POR_PAGINA);
  const paginacaoContainer = document.querySelector(seletorPaginacao);
  
  if (!paginacaoContainer) return; // Verifica se o container existe
  
  paginacaoContainer.innerHTML = ""; // Limpa a navegação

  if (totalPaginas <= 1) return; // Se há apenas uma página, não exibe paginação

  const paginaInicial = Math.max(1, paginaAtual - Math.floor(MAX_BOTOES_PAGINACAO / 2));
  const paginaFinal = Math.min(totalPaginas, paginaInicial + MAX_BOTOES_PAGINACAO - 1);

  // Botão "Anterior"
  const botaoAnterior = document.createElement("li");
  botaoAnterior.classList.add("page-item");
  
  const linkAnterior = document.createElement("a");
  linkAnterior.classList.add("page-link");
  linkAnterior.href = "#";
  linkAnterior.innerHTML = "&laquo;";
  
  if (paginaAtual > 1) {
    linkAnterior.addEventListener("click", function(e) {
      e.preventDefault();
      callback(paginaAtual - 1);
    });
  } else {
    botaoAnterior.classList.add("disabled");
    linkAnterior.style.pointerEvents = "none";
  }
  
  botaoAnterior.appendChild(linkAnterior);
  paginacaoContainer.appendChild(botaoAnterior);

  // Botões de páginas
  for (let i = paginaInicial; i <= paginaFinal; i++) {
    const botaoPagina = document.createElement("li");
    botaoPagina.classList.add("page-item");
    if (i === paginaAtual) botaoPagina.classList.add("active");

    const linkPagina = document.createElement("a");
    linkPagina.classList.add("page-link");
    linkPagina.href = "#";
    linkPagina.textContent = i;
    
    // Usar closure para capturar o valor correto de i
    linkPagina.addEventListener("click", function(e) {
      e.preventDefault();
      callback(i);
    });
    
    botaoPagina.appendChild(linkPagina);
    paginacaoContainer.appendChild(botaoPagina);
  }

  // Botão "Próximo"
  const botaoProximo = document.createElement("li");
  botaoProximo.classList.add("page-item");
  
  const linkProximo = document.createElement("a");
  linkProximo.classList.add("page-link");
  linkProximo.href = "#";
  linkProximo.innerHTML = "&raquo;";
  
  if (paginaAtual < totalPaginas) {
    linkProximo.addEventListener("click", function(e) {
      e.preventDefault();
      callback(paginaAtual + 1);
    });
  } else {
    botaoProximo.classList.add("disabled");
    linkProximo.style.pointerEvents = "none";
  }
  
  botaoProximo.appendChild(linkProximo);
  paginacaoContainer.appendChild(botaoProximo);
}

function editarEntrada(id) {
  const entrada = entradasFiltradas.find((e) => e.id === id); // Encontrar a entrada

  if (entrada) {
    // Obter o nome do produto com base no id do produto
    const produto = produtosOriginais.find((p) => p.id === entrada.idProdutos);
    const nomeProduto = produto ? produto.nome : "Produto não encontrado";

    // Preencher os campos do modal
    document.getElementById("idEntradaEditar").value = id;
    document.getElementById("entradaProduto").value = nomeProduto;
    document.getElementById("entradaQuantidade").value = entrada.quantidade;
    
    // Formatar o preço corretamente
    const precoFormatado = formatarPrecoParaExibicao(entrada.preco);
    document.getElementById("entradaPreco").value = precoFormatado;

    // Esconder temporariamente o modal de histórico de entradas (se estiver aberto)
    const historicoEntradas = document.getElementById('entradasModal');
    if (historicoEntradas) {
      const bsModal = bootstrap.Modal.getInstance(historicoEntradas);
      if (bsModal) bsModal.hide();
    }
    
    // Pequeno delay para garantir que o modal anterior seja fechado
    setTimeout(() => {
      // Abrir o modal de edição
      const modalEditarEntrada = new bootstrap.Modal(
        document.getElementById("modalEditarEntrada")
      );
      modalEditarEntrada.show();
      
      // Adicionar evento para quando o modal de edição for fechado
      const modalElement = document.getElementById("modalEditarEntrada");
      modalElement.addEventListener('hidden.bs.modal', function handleHidden() {
        // Remover este event listener após ser executado
        modalElement.removeEventListener('hidden.bs.modal', handleHidden);
        
        // Reabrir o modal de histórico de entradas
        setTimeout(() => {
          const historicoEntradas = document.getElementById('entradasModal');
          if (historicoEntradas) {
            const bsModal = bootstrap.Modal.getInstance(historicoEntradas);
            if (!bsModal) {
              const novoModal = new bootstrap.Modal(historicoEntradas);
              novoModal.show();
            } else {
              bsModal.show();
            }
          }
        }, 100);
      });
    }, 100);
  } else {
    console.error("Entrada não encontrada.");
  }
}

function excluirEntrada(entradaId) {
  // Insere o ID da entrada no campo oculto do modal
  const inputEntradaId = document.getElementById("idEntradaExcluir");
  if (inputEntradaId) {
    inputEntradaId.value = entradaId;
  }

  // Fecha quaisquer modais abertos
  const modaisAbertos = document.querySelectorAll(".modal.show");
  modaisAbertos.forEach((modal) => {
    const bootstrapModal = bootstrap.Modal.getInstance(modal);
    if (bootstrapModal) bootstrapModal.hide();
  });

  // Remove backdrop existente, se houver
  document
    .querySelectorAll(".modal-backdrop")
    .forEach((backdrop) => backdrop.remove());

  // Exibe o modal de exclusão usando Bootstrap
  const modalExcluirEntrada = new bootstrap.Modal(
    document.getElementById("modalExcluirEntrada")
  );
  modalExcluirEntrada.show();
}

function editarSaida(id) {
  const saida = saidas.find((s) => s.id === id); // Encontre a saída pelo ID
  const produto = produtosOriginais.find((p) => p.id === saida.idProdutos); // Encontre o produto correspondente à saída

  if (saida) {
    // Preencher os campos no modal
    document.getElementById("idEditarSaida").value = saida.id;
    document.getElementById("saidaProduto").value = produto.nome; // Nome do produto (não editável)
    document.getElementById("saidaQuantidade").value = saida.quantidade; // Quantidade
    
    // Formatar o preço corretamente
    const precoFormatado = formatarPrecoParaExibicao(saida.preco);
    document.getElementById("saidaPreco").value = precoFormatado; // Preço formatado

    // Esconder temporariamente o modal de histórico de saídas (se estiver aberto)
    const historicoSaidas = document.getElementById('saidasModal');
    if (historicoSaidas) {
      const bsModal = bootstrap.Modal.getInstance(historicoSaidas);
      if (bsModal) bsModal.hide();
    }
    
    // Pequeno delay para garantir que o modal anterior seja fechado
    setTimeout(() => {
      // Abrir o modal de edição
      const modalEditarSaida = new bootstrap.Modal(
        document.getElementById("modalEditarSaida")
      );
      modalEditarSaida.show();
      
      // Adicionar evento para quando o modal de edição for fechado
      const modalElement = document.getElementById("modalEditarSaida");
      modalElement.addEventListener('hidden.bs.modal', function handleHidden() {
        // Remover este event listener após ser executado
        modalElement.removeEventListener('hidden.bs.modal', handleHidden);
        
        // Reabrir o modal de histórico de saídas
        setTimeout(() => {
          const historicoSaidas = document.getElementById('saidasModal');
          if (historicoSaidas) {
            const bsModal = bootstrap.Modal.getInstance(historicoSaidas);
            if (!bsModal) {
              const novoModal = new bootstrap.Modal(historicoSaidas);
              novoModal.show();
            } else {
              bsModal.show();
            }
          }
        }, 100);
      });
    }, 100);
  } else {
    console.error("Saída não encontrada.");
  }
}

function excluirSaida(saidaId) {
  // Fecha manualmente qualquer modal aberto
  const modaisAbertos = document.querySelectorAll(".modal.show");
  modaisAbertos.forEach((modal) => {
    const bootstrapModal = bootstrap.Modal.getInstance(modal);
    if (bootstrapModal) bootstrapModal.hide();
  });

  // Remove backdrop existente, se houver
  document
    .querySelectorAll(".modal-backdrop")
    .forEach((backdrop) => backdrop.remove());

  // Configura o modal de exclusão
  const inputSaidaId = document.getElementById("idSaidaExcluir");
  if (inputSaidaId) {
    inputSaidaId.value = saidaId;
  }

  // Exibe o modal de exclusão
  const modalExcluir = new bootstrap.Modal(
    document.getElementById("modalExcluirSaida")
  );
  modalExcluir.show();
}

document.addEventListener("DOMContentLoaded", () => {
  const consultarEntradasBtn = document.getElementById("consultarEntradasBtn");
  const consultarSaidasBtn = document.getElementById("consultarSaidasBtn");
  const entradasModalElement = document.getElementById("entradasModal");
  const saidasModalElement = document.getElementById("saidasModal");

  if (
    !consultarEntradasBtn ||
    !consultarSaidasBtn ||
    !entradasModalElement ||
    !saidasModalElement
  ) {
    console.error("Botões ou modais não encontrados no DOM.");
    return;
  }

  // Inicializar os modais
  const entradasModal = new bootstrap.Modal(entradasModalElement);
  const saidasModal = new bootstrap.Modal(saidasModalElement);

  consultarEntradasBtn.addEventListener("click", () => {
    entradasModal.show();
    fetchEntradas();
  });

  consultarSaidasBtn.addEventListener("click", () => {
    saidasModal.show();
    fetchSaidas();
  });

  inicializarComponentes();
});

function preencherTabelaProdutos(produtosPaginados) {
  const corpoTabela = document.getElementById("corpoTabela");
  corpoTabela.innerHTML = ""; // Limpa a tabela

  if (!produtosPaginados || produtosPaginados.length === 0) {
    return; // Se não há produtos, apenas limpa a tabela
  }

  produtosPaginados.forEach((produto) => {
    const tr = document.createElement("tr");
    const {
      codigo_produto,
      nome,
      descricao,
      preco,
      quantidade,
      unidade_medida,
    } = produto;

    const precoFormatado = preco.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    // Determinar o status e a classe de estilo correspondente
    const disponivel = quantidade > 0;
    const statusText = disponivel ? "Disponível" : "Indisponível";
    const statusClass = disponivel ? "disponivel" : "indisponivel";

    // Criar as células da tabela
    const colunas = [
      { valor: codigo_produto, classe: "" },
      { valor: nome, classe: "fw-semibold" },
      { valor: descricao, classe: "text-muted small" },
      { valor: precoFormatado, classe: "fw-semibold" },
      { valor: `${quantidade} ${unidade_medida}`, classe: "text-center" },
      { valor: unidade_medida, classe: "text-center" },
      { 
        valor: `<span class="status-badge ${statusClass}">${statusText}</span>`, 
        classe: "text-center",
        isHtml: true
      },
    ];

    colunas.forEach((coluna) => {
      const td = document.createElement("td");
      if (coluna.classe) {
        td.className = coluna.classe;
      }
      
      if (coluna.isHtml) {
        td.innerHTML = coluna.valor;
      } else {
        td.textContent = coluna.valor;
      }
      
      tr.appendChild(td);
    });

    tr.appendChild(createButtonGroup(produto)); // Adiciona os botões de ação
    corpoTabela.appendChild(tr);
  });
}

function mostrarPagina(pagina) {
  paginaAtual = pagina;

  const inicio = (pagina - 1) * ITENS_POR_PAGINA;
  const fim = inicio + ITENS_POR_PAGINA;

  const produtosNaPagina = produtosOrdenados.slice(inicio, fim); // Paginar com a lista ordenada
  preencherTabelaProdutos(produtosNaPagina);

  atualizarPaginacao(produtosOrdenados.length, paginaAtual); // Atualiza paginação com a lista ordenada
}

function atualizarPaginacao(totalProdutos, paginaAtual) {
  const totalPaginas = Math.ceil(totalProdutos / ITENS_POR_PAGINA);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = ""; // Limpa o container de paginação

  const paginaInicial = Math.max(
    1,
    paginaAtual - Math.floor(MAX_BOTOES_PAGINACAO / 2)
  );
  const paginaFinal = Math.min(
    totalPaginas,
    paginaInicial + MAX_BOTOES_PAGINACAO - 1
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

function preencherCategorias(categorias, onChangeCallback) {
  // Encontre todos os selects de categoria na página
  const selectsCategorias = [
    document.getElementById("categoria"),                  // Filtro principal
    document.getElementById("categoriaProdutoAdicionar"),  // Modal adicionar
    document.getElementById("categoriaProdutoEditar")      // Modal editar
  ];

  // Iterar sobre todos os selects encontrados e preencher cada um
  selectsCategorias.forEach(select => {
    if (select) {
      // Limpar as opções existentes
      select.innerHTML = "";

      // Adicionar a opção vazia para filtro (apenas no filtro principal)
      if (select.id === "categoria") {
        const optionVazia = document.createElement("option");
        optionVazia.value = "";
        optionVazia.textContent = "Todas as categorias";
        select.appendChild(optionVazia);
      }

      // Adicionar as categorias
      if (Array.isArray(categorias)) {
        categorias.forEach(categoria => {
          const option = document.createElement("option");
          option.value = categoria.id;
          option.textContent = categoria.nome;
          select.appendChild(option);
        });
      }

      // Adicionar o evento de change, se fornecido
      if (onChangeCallback && typeof onChangeCallback === 'function') {
        select.addEventListener("change", onChangeCallback);
      }
    }
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

function abrirModalAdicionarProduto() {
  const modalAdicionarProduto = new bootstrap.Modal(
    document.getElementById("modalAdicionarProduto")
  );
  modalAdicionarProduto.show();
}

function abrirModalEditarEntrada(entrada) {
  const modalEditarEntrada = new bootstrap.Modal(
    document.getElementById("modalEditarEntrada")
  );
  document.getElementById("idProdutoEntrada").value = entrada.idProdutos;
  document.getElementById("quantidadeEntrada").value = entrada.quantidade;
  modalEditarEntrada.show();

  document.getElementById("formEditarEntrada").onsubmit = function (e) {
    e.preventDefault();
    const idProduto = document.getElementById("idProdutoEntrada").value;
    const quantidade = document.getElementById("quantidadeEntrada").value;

    alert(`Entrada Editada: Produto ID ${idProduto}, Quantidade ${quantidade}`);
    modalEditarEntrada.hide();
  };
}

function abrirModalEditarSaida(saida) {
  const modalEditarSaida = new bootstrap.Modal(
    document.getElementById("modalEditarSaida")
  );
  document.getElementById("idProdutoSaida").value = saida.idProdutos;
  document.getElementById("quantidadeSaida").value = saida.quantidade;
  modalEditarSaida.show();

  document.getElementById("formEditarSaida").onsubmit = function (e) {
    e.preventDefault();
    const idProduto = document.getElementById("idProdutoSaida").value;
    const quantidade = document.getElementById("quantidadeSaida").value;

    alert(`Saída Editada: Produto ID ${idProduto}, Quantidade ${quantidade}`);
    modalEditarSaida.hide();
  };
}

document.getElementById("categoria").addEventListener("change", function () {
  alterarTabelaPorCategoriaSelecionada(produtos);
});

document
  .getElementById("clienteNaoCadastrado")
  .addEventListener("change", function () {
    const clienteInput = document.getElementById("cliente");

    if (this.checked) {
      clienteInput.readOnly = true; // Torna o campo somente leitura
      clienteInput.value = null; // Defina o valor desejado
    } else {
      clienteInput.readOnly = false; // Atualiza o campo oculto com o valor do input
    }

  });

function createButtonGroup(produto) {
  const actions = [
    {
      text: "Editar",
      icon: "fas fa-edit",
      class: "btn-primary",
      tooltip: "Editar produto",
      action: () => openModal("Editar", produto, produto.id, categorias),
    },
    {
      text: "Excluir",
      icon: "fas fa-trash",
      class: "btn-danger",
      tooltip: "Excluir produto",
      action: () => openModal("Excluir", produto.id),
    },
    {
      text: "Adicionar Entrada",
      icon: "fas fa-arrow-down",
      class: "btn-success",
      tooltip: "Adicionar entrada",
      action: () => openModalEntrada(produto.id),
    },
    {
      text: "Adicionar Saída",
      icon: "fas fa-arrow-up",
      class: "btn-warning",
      tooltip: "Adicionar saída",
      action: () => openModalSaida(produto.id, produto.preco),
    },
  ];

  const tdAcoes = document.createElement("td");
  tdAcoes.classList.add("text-center");
  
  const actionButtonsContainer = document.createElement("div");
  actionButtonsContainer.classList.add("d-flex", "justify-content-center", "align-items-center");
  actionButtonsContainer.style.gap = "10px";
  
  actions.forEach(({ text, icon, class: btnClass, tooltip, action }) => {
    const btn = document.createElement("button");
    btn.classList.add("btn", btnClass, "btn-sm", "action-btn");
    btn.setAttribute("data-bs-toggle", "tooltip");
    btn.setAttribute("data-bs-placement", "top");
    btn.setAttribute("title", tooltip);
    
    const iconElement = document.createElement("i");
    iconElement.className = icon;
    btn.appendChild(iconElement);
    
    btn.onclick = action;
    actionButtonsContainer.appendChild(btn);
  });

  tdAcoes.appendChild(actionButtonsContainer);
  
  // Inicializar tooltips
  setTimeout(() => {
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => {
      new bootstrap.Tooltip(tooltip);
    });
  }, 100);
  
  return tdAcoes;
}

function openModal(tipo, produto) {
  const modalId = tipo === "Editar" ? "modalEditar" : "modalExcluir";

  if (tipo === "Editar") {
    document.getElementById("idProdutoUpdate").value = produto.id;
    document.getElementById("codigoProdutoEditar").value = produto.codigo_produto;
    document.getElementById("nomeProduto").value = produto.nome;
    document.getElementById("descricaoProduto").value = produto.descricao;
    document.getElementById("fotoProduto").value = ""; // Limpa o campo (opcional)
    document.getElementById("previewImagem").src = produto.imagem; // Define o src da imagem
    document.getElementById("previewImagem").style.display = "block"; // Mostra a imagem
    
    // Configurar unidade de medida
    const unidadeSelect = document.getElementById("unidadeProdutoEditar");
    const unidadeMedida = produto.unidade_medida;

    // Verificar se a unidade já existe no select
    const optionExiste = Array.from(unidadeSelect.options).some(
      (option) => option.value === unidadeMedida
    );

    // Adicionar a unidade ao select, se não existir
    if (!optionExiste && unidadeMedida) {
      const novaOption = document.createElement("option");
      novaOption.value = unidadeMedida;
      novaOption.textContent = unidadeMedida;
      unidadeSelect.appendChild(novaOption);
    }

    // Selecionar a unidade do produto
    if (unidadeMedida) {
      unidadeSelect.value = unidadeMedida;
    }

    const precoProduto = document.getElementById("precoProduto");

    // Garante que `produto.preco` seja um número válido antes de formatar
    let preco = produto.preco ? parseFloat(produto.preco) : 0;

    // Define o valor formatado no campo de entrada
    precoProduto.value = `R$ ${preco.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

    // Configurar categorias no select
    const categoriaSelect = document.getElementById("categoriaProdutoEditar");
    categoriaSelect.innerHTML = ""; // Limpar opções anteriores

    // Adicionar uma opção padrão "Selecione uma categoria"
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Selecione uma categoria";
    categoriaSelect.appendChild(defaultOption);

    // Preencher as opções com as categorias disponíveis
    if (Array.isArray(categorias)) {
      categorias.forEach((categoria) => {
        const option = document.createElement("option");
        option.value = categoria.id;
        option.textContent = categoria.nome;
        categoriaSelect.appendChild(option);
      });

      // Selecionar a categoria do produto
      if (produto.idCategoria) {
        categoriaSelect.value = produto.idCategoria;
      }
    }
  } else if (tipo === "Excluir") {
    document.getElementById("idProdutoExcluir").value = produto;
  }

  // Fechar qualquer modal que possa estar aberto
  const modaisAbertos = document.querySelectorAll('.modal.show');
  modaisAbertos.forEach(modalAberto => {
    const bsModal = bootstrap.Modal.getInstance(modalAberto);
    if (bsModal) {
      bsModal.hide();
    }
  });

  // Exibir o novo modal
  const modal = new bootstrap.Modal(document.getElementById(modalId));
  modal.show();
}

function openModalEntrada(id) {
  const inputProdutoId = document.getElementById("produtoId");

  inputProdutoId.value = id;
  new bootstrap.Modal(document.getElementById("modalEntrada")).show();
}

function openModalSaida(id, preco) {
  const inputProdutoId = document.getElementById("produtoId2");
  const inputPrecoSaida = document.getElementById("precoSaida");

  inputProdutoId.value = id;

  // Verifica se o preço é maior que 0, senão define como 0 formatado
  if (!preco || preco <= 0) {
    inputPrecoSaida.value = "R$ 0,00";
  } else {
    // Formata o valor do preço como moeda (BRL) antes de exibir
    inputPrecoSaida.value = preco.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  // Exibe o modal
  new bootstrap.Modal(document.getElementById("modalSaida")).show();
}

let ordemAtual = {
  coluna: null,
  crescente: true,
};

function ordenarTabela(coluna, idSeta) {
  if (ordemAtual.coluna === coluna) {
    ordemAtual.crescente = !ordemAtual.crescente;
  } else {
    ordemAtual.coluna = coluna;
    ordemAtual.crescente = true;
  }

  // Atualizar setas
  document
    .querySelectorAll(".seta")
    .forEach((seta) => (seta.textContent = "⬍"));
  const setaAtual = document.getElementById(idSeta);
  setaAtual.textContent = ordemAtual.crescente ? "⬆" : "⬇";

  // Ordenar produtos filtrados
  produtosOrdenados = [...produtosFiltrados].sort((a, b) => {
    let valorA = a[coluna];
    let valorB = b[coluna];

    // Se for uma string, converter para minúscula para comparar corretamente
    if (typeof valorA === "string") {
      valorA = valorA.toLowerCase();
      valorB = valorB.toLowerCase();
    }

    // Converter para número se for numérico
    if (!isNaN(valorA) && !isNaN(valorB)) {
      valorA = Number(valorA);
      valorB = Number(valorB);
    }

    // Comparar de acordo com a ordem crescente ou decrescente
    if (ordemAtual.crescente) {
      return valorA > valorB ? 1 : valorA < valorB ? -1 : 0;
    } else {
      return valorA < valorB ? 1 : valorA > valorB ? -1 : 0;
    }
  });

  mostrarPagina(1); // Atualiza a tabela começando na primeira página
}

document
  .getElementById("ordenarCodigo")
  .addEventListener("click", () =>
    ordenarTabela("codigo_produto", "setaCodigo")
  );
document
  .getElementById("ordenarNome")
  .addEventListener("click", () => ordenarTabela("nome", "setaNome"));
document
  .getElementById("ordenarPreco")
  .addEventListener("click", () => ordenarTabela("preco", "setaPreco"));
document
  .getElementById("ordenarQuantidade")
  .addEventListener("click", () =>
    ordenarTabela("quantidade", "setaQuantidade")
  );

// Funções de exportação para Excel
async function exportarClientesExcel() {
  try {
    const response = await fetch(`${BASE_URL}/excel-r-c`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio-clientes.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Erro ao exportar clientes:', error);
    alert('Erro ao gerar relatório Excel de clientes');
  }
}

async function exportarFornecedoresExcel() {
  try {
    const response = await fetch(`${BASE_URL}/excel-r-f`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio-fornecedores.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Erro ao exportar fornecedores:', error);
    alert('Erro ao gerar relatório Excel de fornecedores');
  }
}

async function exportarProdutosExcel() {
  try {
    const response = await fetch(`${BASE_URL}/excel-r-p`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio-produtos.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Erro ao exportar produtos:', error);
    alert('Erro ao gerar relatório Excel de produtos');
  }
}

// Adiciona event listeners para os botões de Excel
document.addEventListener('DOMContentLoaded', function() {
  const excelClientesBtn = document.querySelector('a[href*="excel-r-c"]');
  const excelFornecedoresBtn = document.querySelector('a[href*="excel-r-f"]');
  const excelProdutosBtn = document.querySelector('a[href*="excel-r-p"]');

  if (excelClientesBtn) {
    excelClientesBtn.addEventListener('click', function(e) {
      e.preventDefault();
      exportarClientesExcel();
    });
  }

  if (excelFornecedoresBtn) {
    excelFornecedoresBtn.addEventListener('click', function(e) {
      e.preventDefault();
      exportarFornecedoresExcel();
    });
  }

  if (excelProdutosBtn) {
    excelProdutosBtn.addEventListener('click', function(e) {
      e.preventDefault();
      exportarProdutosExcel();
    });
  }
});

// Função de exportação para Excel
async function exportarRelatorioExcel(tipo) {
  try {
    const response = await fetch(`${BASE_URL}/excel-r-${tipo}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${tipo}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error(`Erro ao exportar ${tipo}:`, error);
    alert(`Erro ao gerar relatório Excel de ${tipo}`);
  }
}

document
  .getElementById("categoria-cadastro")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const nome = document.getElementById("nomeCategoriaAdicionar").value;
    const descricao = document.getElementById(
      "descricaoCategoriaAdicionar"
    ).value;

    const novaCategoria = {
      nome: nome,
      descricao: descricao,
    };

    try {
      const response = await fetch(`${BASE_URL}/addCategoria`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novaCategoria),
      });

      if (response.ok) {
        const categoriaAdicionada = await response.json();
        categorias.push(categoriaAdicionada); // Adiciona a nova categoria à lista
        renderizarTabela();

        // Limpa e fecha o modal
        document.getElementById("nomeCategoriaAdicionar").value = "";
        document.getElementById("descricaoCategoriaAdicionar").value = "";
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("modalAdicionarCategoria")
        );
        modal.hide();
      } else {
        console.error("Erro ao adicionar categoria");
      }
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
    }
  });

function editarCategoria(id) {
  const categoria = categorias.find((cat) => cat.id === id);

  document.getElementById("idCategoriaEditar").value = categoria.id;
  document.getElementById("nomeCategoriaEditar").value = categoria.nome;
  document.getElementById("descricaoCategoriaEditar").value =
    categoria.descricao;

  const modalEditar = new bootstrap.Modal(
    document.getElementById("modalEditarCategoria")
  );
  modalEditar.show();
}

function excluirCategoria(id) {
  // Insere o ID da categoria no campo oculto do modal
  const inputCategoriaId = document.getElementById("idCategoriaExcluir");
  inputCategoriaId.value = id;

  // Mostra o modal de exclusão
  new bootstrap.Modal(document.getElementById("modalExcluirCategoria")).show();
}

/**
 * Inicializa todos os campos de preço na página com eventos de formatação
 */
function inicializarCamposPreco() {
    // Aplicar formatação a todos os campos com a classe 'preco'
    const camposPreco = document.querySelectorAll('.preco');
    
    // Percorrer e adicionar eventos para cada campo
    camposPreco.forEach(campo => {
        // Garantir que o campo tenha um valor inicial
        if (!campo.value || campo.value === "0" || campo.value === "0.00") {
            campo.value = "R$ 0,00";
        }
        
        // Adicionar evento para formatar quando o campo receber foco
        campo.addEventListener('focus', function(e) {
            // Se o campo tiver apenas zeros, selecionar todo o conteúdo
            if (e.target.value === "R$ 0,00") {
                setTimeout(() => e.target.select(), 50);
            }
        });
        
        // Adicionar evento para formatar durante a digitação
        campo.addEventListener('input', function(e) {
            formatarPreco(e.target);
        });
        
        // Adicionar evento para formatar quando o foco sair
        campo.addEventListener('blur', function(e) {
            formatarPreco(e.target);
        });
        
        // Formatar o valor inicial
        formatarPreco(campo);
    });
}

// Função que inicializa todos os componentes da aplicação
function inicializarComponentes() {
  loadAllData();
  inicializarCamposPreco();
}

