const BASE_URL = '/stockDeps/app';
const itensPorPagina = 8;
const maxBotoesPaginacao = 5; // Limite de botões de página exibidos

let produtos = [];
let clientes = [];
let fornecedores = [];
let entradas = [];
let saidas = [];
let categorias = [];

let paginaAtual = 1;
let paginaAtualEntradas = 1;
let paginaAtualSaidas = 1;

let entradasFiltradas = [];
let saidasFiltradas = [];
let produtosFiltrados = [];

let produtosOrdenados = [];

async function fetchProdutos() {
  const response = await fetch(`${BASE_URL}/getProdutos`);
  produtosOriginais = await response.json(); // Salva os produtos originais
  produtosFiltrados = [...produtosOriginais]; // Inicializa os filtrados com todos os produtos
  produtosOrdenados = [...produtosFiltrados]; // Inicializa os ordenados com os produtos filtrados
  buscarProduto(); // Inicializa o evento de busca 
  mostrarPagina(paginaAtual); // Mostra a primeira página
}

async function fetchCategorias() {
  const response = await fetch(`${BASE_URL}/getCategorias`);
  categorias = await response.json();
  preencherCategorias(categorias, () => alterarTabelaPorCategoriaSelecionada());
  renderizarTabela(categorias);
}
async function fetchClientes() {
  const response = await fetch(`${BASE_URL}/getClientes`);
  clientes = await response.json();
  preencherClientes(clientes);

}
async function fetchFornecedores() {
  const response = await fetch(`${BASE_URL}/getFornecedores`);
  fornecedores = await response.json();
  preencherFornecedores(fornecedores);
}

async function fetchEntradas() {
  const response = await fetch(`${BASE_URL}/getEntradas`);
  entradas = await response.json();
  entradasFiltradas = [...entradas]; // Inicializa as filtradas
  mostrarPaginaEntradas(paginaAtualEntradas);
  buscarEntrada();
  filtrarEntradasPorData();
}
async function fetchSaidas() {
  const response = await fetch(`${BASE_URL}/getSaidas`);
  saidas = await response.json();
  saidasFiltradas = [...saidas];
  mostrarPaginaSaidas(paginaAtualSaidas);
  buscarSaida();
  filtrarSaidasPorData();
}

function loadAllData() {
  fetchProdutos();
  fetchCategorias();
  fetchClientes();
  fetchFornecedores();
  fetchEntradas();
  fetchSaidas();
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
  inputBuscarProduto.addEventListener("input", function () {
    const termoBusca = inputBuscarProduto.value.toLowerCase();

    produtosFiltrados = produtosOriginais.filter(
      (produto) =>
        produto.nome.toLowerCase().includes(termoBusca) ||
        produto.codigo_produto.toLowerCase().includes(termoBusca)
    );

    // Reiniciar a ordenação com os produtos filtrados
    produtosOrdenados = [...produtosFiltrados];
    paginaAtual = 1; // Reinicia na primeira página
    mostrarPagina(paginaAtual); // Atualiza a tabela
  });
}

function removerAcentos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function buscarEntrada() {
  const inputBuscarEntrada = document.getElementById("buscarEntrada");
  inputBuscarEntrada.addEventListener("input", function () {
    const termoBusca = removerAcentos(inputBuscarEntrada.value.toLowerCase());

    entradasFiltradas = entradas.filter((entrada) => {
      const produto = produtosOriginais.find((p) => p.id == entrada.idProdutos);
      const fornecedor = fornecedores.find((f) => f.id == entrada.idFornecedor);
      
      return (
        removerAcentos(produto?.nome?.toLowerCase()).includes(termoBusca) ||
        removerAcentos(fornecedor?.nome?.toLowerCase()).includes(termoBusca)
      );
    });

    paginaAtualEntradas = 1;
    mostrarPaginaEntradas(paginaAtualEntradas); // Atualiza a tabela com os resultados filtrados
  });
}

function buscarSaida() {
  const inputBuscarSaida = document.getElementById("buscarSaida");
  inputBuscarSaida.addEventListener("input", function () {
    const termoBusca = removerAcentos(inputBuscarSaida.value.toLowerCase());

    saidasFiltradas = saidas.filter((saida) => {
      const produto = produtosOriginais.find((p) => p.id == saida.idProdutos);
      const cliente = Array.isArray(clientes)
        ? clientes.find((c) => c.id == saida.idClientes)?.nome || "Cliente não encontrado"
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
  const inicio = (pagina - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;

  // Paginar os resultados corretamente
  const entradasPagina = entradasFiltradas.slice(inicio, fim);

  // Selecionar a tabela e limpar seu conteúdo
  const tabela = document.querySelector("#tabelaEntradas tbody");
  tabela.innerHTML = "";

  // Exibir mensagem caso não haja entradas
  if (entradasPagina.length === 0) {
    tabela.innerHTML = `<tr><td colspan="6" class="text-center">Nenhuma entrada encontrada.</td></tr>`;
    return;
  }

  // Preencher a tabela com as entradas paginadas
  entradasPagina.forEach((entrada) => {
    const produto = produtosOriginais.find((p) => p.id == entrada.idProdutos);
    const fornecedor = fornecedores.find((f) => f.id == entrada.idFornecedor);

    const row = `
            <tr>
                <td>${fornecedor?.nome || "Fornecedor não encontrado"}</td>
                <td>${produto?.nome || "Produto não encontrado"}</td>
                <td>${entrada.quantidade}</td>
                <td>${entrada.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                <td>${formatarData(entrada.created_at)}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editarEntrada(${entrada.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#modalExcluirEntrada" onclick="excluirEntrada(${entrada.id})">Excluir</button>
                </td>
            </tr>`;
    tabela.insertAdjacentHTML("beforeend", row);
  });

  // Configurar a paginação
  configurarPaginacao(entradasFiltradas.length, mostrarPaginaEntradas, "#paginacaoEntradas", pagina);
}

function mostrarPaginaSaidas(pagina) {
  const inicio = (pagina - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;

  // Ordenar as saídas da mais recente para a mais antiga
  saidasFiltradas.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Paginar os resultados corretamente
  const saidasPagina = saidasFiltradas.slice(inicio, fim);

  // Selecionar a tabela e limpar seu conteúdo
  const tabela = document.querySelector("#tabelaSaidas tbody");
  tabela.innerHTML = "";

  // Exibir mensagem caso não haja saídas
  if (saidasPagina.length === 0) {
    tabela.innerHTML = `<tr><td colspan="6" class="text-center">Nenhuma saída encontrada.</td></tr>`;
    return;
  }

  // Preencher a tabela com as saídas paginadas
  saidasPagina.forEach((saida) => {
    const produto = produtosOriginais.find((p) => p.id == saida.idProdutos);
    const cliente = Array.isArray(clientes)
    ? clientes.find((c) => c.id == saida.idClientes)?.nome ||
      "Cliente não encontrado"
    : "Cliente não cadastrado";

    const row = `
            <tr>
                <td>${cliente?.nome || "Cliente não identificado"}</td>
                <td>${produto?.nome || "Produto não encontrado"}</td>
                <td>${saida.quantidade}</td>
                <td>${saida.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                <td>${formatarData(saida.created_at)}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editarSaida(${saida.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#modalExcluirSaida" onclick="excluirSaida(${saida.id})">Excluir</button>
                </td>
            </tr>`;
    tabela.insertAdjacentHTML("beforeend", row);
  });

  // Configurar a paginação
  configurarPaginacao(saidasFiltradas.length, mostrarPaginaSaidas, "#paginacaoSaidas", pagina);
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
  const totalPaginas = Math.ceil(totalItens / itensPorPagina);
  const paginacaoContainer = document.querySelector(seletorPaginacao);
  paginacaoContainer.innerHTML = ""; // Limpa a navegação

  if (totalPaginas <= 1) return; // Se há apenas uma página, não exibe paginação

  const paginaInicial = Math.max(1, paginaAtual - Math.floor(maxBotoesPaginacao / 2));
  const paginaFinal = Math.min(totalPaginas, paginaInicial + maxBotoesPaginacao - 1);

  // Botão "Anterior"
  const botaoAnterior = document.createElement("li");
  botaoAnterior.classList.add("page-item");
  if (paginaAtual > 1) {
    botaoAnterior.innerHTML = `<a class="page-link" href="#" onclick="${callback.name}(${paginaAtual - 1})">&laquo;</a>`;
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
    botaoProximo.innerHTML = `<a class="page-link" href="#" onclick="${callback.name}(${paginaAtual + 1})">&raquo;</a>`;
  } else {
    botaoProximo.classList.add("disabled");
    botaoProximo.innerHTML = `<span class="page-link">&raquo;</span>`;
  }
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
    document.getElementById("entradaPreco").value = entrada.preco;

    // Abrir o modal
    const modalEditarEntrada = new bootstrap.Modal(
      document.getElementById("modalEditarEntrada"),
      {
        backdrop: "static", // Não fecha o modal de consulta ao abrir o de editar
        keyboard: false, // Impede o fechamento do modal com a tecla ESC
      }
    );
    modalEditarEntrada.show();
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
    document.getElementById("saidaPreco").value = saida.preco; // Preço

    // Abrir o modal de edição sem fechar o modal anterior
    const modalEditarSaida = new bootstrap.Modal(
      document.getElementById("modalEditarSaida"),
      {
        backdrop: "static", // Não fecha o modal de consulta ao abrir o de editar
        keyboard: false, // Impede o fechamento do modal com a tecla ESC
      }
    );
    modalEditarSaida.show();
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

    const status = quantidade > 0 ? "Disponível" : "Indisponível";
    const dados = [
      codigo_produto,
      nome,
      descricao,
      precoFormatado,
      quantidade,
      unidade_medida,
      status,
    ];

    dados.forEach((dado) => {
      const td = document.createElement("td");
      td.textContent = dado;
      tr.appendChild(td);
    });

    tr.appendChild(createButtonGroup(produto)); // Adiciona os botões de ação
    corpoTabela.appendChild(tr);
  });
}

function mostrarPagina(pagina) {
  paginaAtual = pagina;

  const inicio = (pagina - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;

  const produtosNaPagina = produtosOrdenados.slice(inicio, fim); // Paginar com a lista ordenada
  preencherTabelaProdutos(produtosNaPagina);

  atualizarPaginacao(produtosOrdenados.length, paginaAtual); // Atualiza paginação com a lista ordenada
}

function atualizarPaginacao(totalProdutos, paginaAtual) {
  const totalPaginas = Math.ceil(totalProdutos / itensPorPagina);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = ""; // Limpa o container de paginação

  const paginaInicial = Math.max(
    1,
    paginaAtual - Math.floor(maxBotoesPaginacao / 2)
  );
  const paginaFinal = Math.min(
    totalPaginas,
    paginaInicial + maxBotoesPaginacao - 1
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

  // Adiciona a opção "Todas" no select principal
  const optionAll = document.createElement("option");
  optionAll.value = ""; // Valor vazio para identificar a exibição de todos os produtos
  optionAll.textContent = "Todas";
  selectElement.appendChild(optionAll);

  // Adiciona o placeholder "Selecione a categoria" no modal select
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
      class: "btn-primary",
      action: () => openModal("Editar", produto, produto.id, categorias),
    },
    {
      text: "Excluir",
      class: "btn-danger",
      action: () => openModal("Excluir", produto.id),
    },
    {
      text: "Adicionar Entrada",
      class: "btn-success",
      action: () => openModalEntrada(produto.id),
    },
    {
      text: "Adicionar Saída",
      class: "btn-warning",
      action: () => openModalSaida(produto.id, produto.preco),
    },
  ];

  const btnGroup = document.createElement("div");
  btnGroup.classList.add("btn-group", "w-100");
  actions.forEach(({ text, class: btnClass, action }) => {
    const btn = document.createElement("button");
    btn.classList.add("btn", btnClass);
    btn.textContent = text;
    btn.onclick = action;
    btnGroup.appendChild(btn);
  });

  const tdAcoes = document.createElement("td");
  tdAcoes.colSpan = 2;
  tdAcoes.appendChild(btnGroup);
  return tdAcoes;
}

function openModal(tipo, produto) {
  const modalId = tipo === "Editar" ? "modalEditar" : "modalExcluir";

  if (tipo === "Editar") {
    document.getElementById("idProdutoUpdate").value = produto.id;
    document.getElementById("codigoProdutoEditar").value =
      produto.codigo_produto;
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
    if (!optionExiste) {
      const novaOption = document.createElement("option");
      novaOption.value = unidadeMedida;
      novaOption.textContent = unidadeMedida;
      unidadeSelect.appendChild(novaOption);
    }

    // Selecionar a unidade do produto
    unidadeSelect.value = unidadeMedida;


    const precoProduto = document.getElementById("precoProduto");

    // Garante que `produto.preco` seja um número válido antes de formatar
    let preco = produto.preco ? parseFloat(produto.preco) : 0;

    // Define o valor formatado no campo de entrada
    precoProduto.value = preco.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });


    // Configurar categorias no select
    const categoria = categorias.find(
      (categoria) => categoria.id === produto.idCategoria
    );
    const categoriaSelect = document.getElementById("categoriaProdutoEditar");
    categoriaSelect.innerHTML = ""; // Limpar opções anteriores

    // Adicionar uma opção padrão "Selecione uma categoria"
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Selecione uma categoria";
    categoriaSelect.appendChild(defaultOption);

    // Preencher as opções com as categorias disponíveis
    categorias.forEach((categoria) => {
      const option = document.createElement("option");
      option.value = categoria.id;
      option.textContent = categoria.nome;
      categoriaSelect.appendChild(option);
    });

    // Selecionar a categoria correspondente ao produto
    if (categoria) {
      categoriaSelect.value = categoria.id;
    }
  }

  if (tipo === "Excluir") {
    document.getElementById("idProdutoExcluir").value = produto;
  }

  // Exibir o modal correspondente
  new bootstrap.Modal(document.getElementById(modalId)).show();
}

function openModalEntrada(id) {
  const inputProdutoId = document.getElementById("produtoId");

  inputProdutoId.value = id;
  new bootstrap.Modal(document.getElementById("modalEntrada")).show();
}

document
  .getElementById("saida-cadastro")
  .addEventListener("submit", function (event) {
    const inputPrecoSaida = document.getElementById("precoSaida");

    inputPrecoSaida.value = preco;
  });

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

window.onload = loadAllData;
