const BASE_URL = '/stockDeps/app';

const itensPorPaginaFornecedores = 7;
const maxBotoesPaginacaoFornecedores = 5;
let paginaAtualFornecedores = 1;

let fornecedores = [];
let fornecedoresFiltrados = [];
let ordemAtualFornecedores = { coluna: null, crescente: true };

async function fetchProdutos() {
    const response = await fetch(`${BASE_URL}/getProdutos`);
    produtos = await response.json();
}

async function fetchCategorias() {
    const response = await fetch(`${BASE_URL}/getCategorias`);
    categorias = await response.json();
}

async function fetchClientes() {
    const response = await fetch(`${BASE_URL}/getClientes`);
    clientes = await response.json();
}
async function fetchSaidas() {
    const response = await fetch(`${BASE_URL}/getSaidas`);
    saidas = await response.json(); // Preenche a variável global saídas
}
async function fetchFornecedores() {
    // Exibir spinner de carregamento
    const spinner = document.getElementById('spinnerFornecedores');
    if (spinner) {
        spinner.classList.remove('d-none');
    }
    
    // Fazer requisição AJAX
    $.ajax({
        url: `${BASE_URL}/getFornecedores`,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            // Armazenar dados nas variáveis globais
            fornecedores = data;
            fornecedoresFiltrados = [...fornecedores];
            
            // Ocultar spinner
            if (spinner) {
                spinner.classList.add('d-none');
            }
            
            // Atualizar tabela
            aplicarOrdenacaoFornecedores();
            mostrarPaginaFornecedores(paginaAtualFornecedores);
        },
        error: function(xhr, status, error) {
            console.error("Erro ao buscar fornecedores:", error);
            
            // Ocultar spinner
            if (spinner) {
                spinner.classList.add('d-none');
            }
            
            // Mostrar mensagem de erro
            alert("Ocorreu um erro ao carregar fornecedores. Tente novamente mais tarde.");
        }
    });
}

async function fetchEntradas() {
    const response = await fetch(`${BASE_URL}/getEntradas`);
    entradas = await response.json(); // Preenche a variável global saídas
}

function preencherTabelaFornecedores(fornecedoresPaginados) {
    const tabela = document.querySelector("#tabelaFornecedores tbody");
    tabela.innerHTML = "";

    fornecedoresPaginados.forEach(fornecedor => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${fornecedor.nome}</td>
            <td>${fornecedor.cnpj}</td>
            <td>${fornecedor.email}</td>
            <td>${fornecedor.telefone}</td>
            <td>${fornecedor.endereco}</td>
            <td>${fornecedor.municipio}</td>
            <td>${fornecedor.cep}</td>
            <td>${fornecedor.uf}</td>
            <td class="text-center">
                <div class="d-flex gap-2 justify-content-center">
                    <button class="btn btn-primary action-btn" onclick="editarFornecedor(${fornecedor.id})" data-bs-toggle="modal" data-bs-target="#modalEditarFornecedor" title="Editar fornecedor">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger action-btn" onclick="openModalExcluir(${fornecedor.id})" title="Excluir fornecedor">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                    <button class="btn btn-success action-btn btn-historico" data-id="${fornecedor.id}" title="Histórico de compras">
                        <i class="fas fa-history"></i>
                    </button>
                </div>
            </td>
        `;
        tabela.appendChild(linha);
    });
    
    // Adicionar eventos aos botões de histórico após criá-los
    document.querySelectorAll('.btn-historico').forEach(botao => {
        botao.addEventListener('click', function() {
            const id = Number(this.getAttribute('data-id'));
            abrirModalHistorico(id);
        });
    });
}

function mostrarPaginaFornecedores(pagina) {
    paginaAtualFornecedores = pagina;

    aplicarOrdenacaoFornecedores(); // Garante que a ordenação é sempre aplicada antes de paginar

    const inicio = (pagina - 1) * itensPorPaginaFornecedores;
    const fim = inicio + itensPorPaginaFornecedores;

    const fornecedoresPaginados = fornecedoresFiltrados.slice(inicio, fim);
    preencherTabelaFornecedores(fornecedoresPaginados);
    atualizarPaginacaoFornecedores();
}

function atualizarPaginacaoFornecedores() {
    const totalPaginas = Math.ceil(fornecedoresFiltrados.length / itensPorPaginaFornecedores);
    const pagination = document.getElementById('paginationFornecedores');
    pagination.innerHTML = '';

    const maxLeft = Math.max(paginaAtualFornecedores - Math.floor(maxBotoesPaginacaoFornecedores / 2), 1);
    const maxRight = Math.min(maxLeft + maxBotoesPaginacaoFornecedores - 1, totalPaginas);

    if (paginaAtualFornecedores > 1) {
        const prevLi = document.createElement('li');
        prevLi.classList.add('page-item');
        prevLi.innerHTML = `<a class="page-link" href="#">Anterior</a>`;
        prevLi.onclick = () => mostrarPaginaFornecedores(paginaAtualFornecedores - 1);
        pagination.appendChild(prevLi);
    }

    for (let i = maxLeft; i <= maxRight; i++) {
        const li = document.createElement('li');
        li.classList.add('page-item');
        if (i === paginaAtualFornecedores) li.classList.add('active');

        const a = document.createElement('a');
        a.classList.add('page-link');
        a.textContent = i;
        a.onclick = () => mostrarPaginaFornecedores(i);
        li.appendChild(a);
        pagination.appendChild(li);
    }

    if (paginaAtualFornecedores < totalPaginas) {
        const nextLi = document.createElement('li');
        nextLi.classList.add('page-item');
        nextLi.innerHTML = `<a class="page-link" href="#">Próximo</a>`;
        nextLi.onclick = () => mostrarPaginaFornecedores(paginaAtualFornecedores + 1);
        pagination.appendChild(nextLi);
    }
}

function aplicarOrdenacaoFornecedores() {
    if (!ordemAtualFornecedores.coluna) return;

    fornecedoresFiltrados.sort((a, b) => {
        let valorA = a[ordemAtualFornecedores.coluna];
        let valorB = b[ordemAtualFornecedores.coluna];

        if (typeof valorA === 'string') {
            valorA = valorA.toLowerCase();
            valorB = valorB.toLowerCase();
        }

        return ordemAtualFornecedores.crescente
            ? (valorA > valorB ? 1 : valorA < valorB ? -1 : 0)
            : (valorA < valorB ? 1 : valorA > valorB ? -1 : 0);
    });
}

// Função para buscar fornecedores com base no nome
function buscarFornecedor() {
    const inputBuscarFornecedor = document.getElementById('buscarFornecedor');

    inputBuscarFornecedor.addEventListener('input', function () {
        const termoBusca = inputBuscarFornecedor.value.toLowerCase();

        fornecedoresFiltrados = fornecedores.filter(fornecedor =>
            fornecedor.nome.toLowerCase().includes(termoBusca) ||
            fornecedor.cnpj.toLowerCase().includes(termoBusca)
        );

        mostrarPaginaFornecedores(1);
    });
}

function editarFornecedor(id) {
    if (!fornecedores || fornecedores.length === 0) {
        console.error("O array de fornecedores está vazio ou não foi carregado.");
        return;
    }
    const fornecedor = fornecedores.find(fornecedor => fornecedor.id === id);
    if (fornecedor) {
        document.getElementById("editarFornecedorId").value = fornecedor.id;
        document.getElementById("editarFornecedorNome").value = fornecedor.nome;
        document.getElementById("editarFornecedorCnpj").value = fornecedor.cnpj;
        document.getElementById("editarFornecedorEmail").value = fornecedor.email;
        document.getElementById("editarFornecedorTelefone").value = fornecedor.telefone;
        document.getElementById("editarFornecedorEndereco").value = fornecedor.endereco;
        document.getElementById("editarFornecedorMunicipio").value = fornecedor.municipio || "";
        document.getElementById("editarFornecedorCep").value = fornecedor.cep || "";
        document.getElementById("editarUfFornecedor").value = fornecedor.uf || "";

        // Abrir o modal usando Bootstrap
        const modal = new bootstrap.Modal(document.getElementById('modalEditarFornecedor'));
        modal.show();
    } else {
        console.error("Fornecedor não encontrado.");
    }
}

function verHistoricoFornecedor(id, fornecedores) {
    window.location.href = `${BASE_URL}/historicoFornecedor/${id}`;
}

function abrirModal() {
    const modal = document.getElementById("modalEditarFornecedor");
    modal.style.display = "block";
}

function fecharModal() {
    const modal = document.getElementById("modalEditarFornecedor");
    modal.style.display = "none";
}

document.getElementById("formEditarFornecedor").addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = document.getElementById("editarFornecedorId").value;
    const nome = document.getElementById("editarFornecedorNome").value;
    const cnpj = document.getElementById("editarFornecedorCnpj").value;
    const email = document.getElementById("editarFornecedorEmail").value;
    const telefone = document.getElementById("editarFornecedorTelefone").value;
    const municipio = document.getElementById("editarFornecedorMunicipio").value;
    const cep = document.getElementById("editarFornecedorCep").value;
    const uf = document.getElementById("editarUfFornecedor").value;

    const fornecedorAtualizado = { id, nome, cnpj, email, telefone, municipio, cep, uf };
});

function openModalExcluir(fornecedorId) {
    // Insere o ID do fornecedor no campo oculto do modal
    const inputFornecedorId = document.getElementById('idFornecedorExcluir');
    inputFornecedorId.value = fornecedorId;

    // Mostra o modal
    new bootstrap.Modal(document.getElementById('modalExcluir')).show();
}

function abrirModalHistorico(id) {
    console.log("Abrindo modal histórico do fornecedor ID:", id);
    
    try {
        // Garantir que o id seja um número
        id = Number(id);
        
    const modalHistorico = new bootstrap.Modal(document.getElementById("modalHistoricoFornecedor"));

        // Armazenar ID do fornecedor selecionado
        document.getElementById("fornecedorIdHistorico").value = id;
        
        // Limpar filtros
        document.getElementById("filtroDataHistoricoFornecedor").value = "";
        document.getElementById("buscarHistoricoFornecedor").value = "";
        
        // Carregar dados do histórico
        carregarHistoricoFornecedor(id);
        
        // Mostrar modal
        modalHistorico.show();
        
        // Adicionar eventos para os filtros
        const btnFiltrar = document.getElementById("filtrarHistoricoFornecedorBtn");
        const btnLimpar = document.getElementById("limparFiltroHistoricoFornecedorBtn");
        const inputBuscar = document.getElementById("buscarHistoricoFornecedor");
        
        // Remover eventos antigos antes de adicionar novos
        btnFiltrar.removeEventListener("click", filtrarHistoricoFornecedor);
        btnLimpar.removeEventListener("click", limparFiltrosHistoricoFornecedor);
        inputBuscar.removeEventListener("keyup", filtrarHistoricoFornecedor);
        
        // Adicionar eventos novos
        btnFiltrar.addEventListener("click", filtrarHistoricoFornecedor);
        btnLimpar.addEventListener("click", limparFiltrosHistoricoFornecedor);
        inputBuscar.addEventListener("keyup", filtrarHistoricoFornecedor);
        
        console.log("Modal aberto com sucesso");
    } catch (error) {
        console.error("Erro ao abrir modal de histórico:", error);
        alert("Houve um erro ao abrir o histórico. Por favor, tente novamente.");
    }
}

// Variáveis para controle da paginação e dados do histórico
let historicoFornecedorDados = [];
let historicoFornecedorFiltrado = [];
let paginaAtualHistoricoFornecedor = 1;
const itensPorPaginaHistoricoFornecedor = 5;

function carregarHistoricoFornecedor(fornecedorId) {
    // Ordenar entradas por data (mais recentes primeiro)
    entradas.sort((a, b) => new Date(b.data) - new Date(a.data));
    
    // Filtrar entradas do fornecedor
    const entradasFornecedor = entradas.filter(entrada => entrada.idFornecedor === fornecedorId);
    
    // Transformar dados para exibição
    historicoFornecedorDados = entradasFornecedor.map(entrada => {
            const produto = produtos.find(p => p.id === entrada.idProdutos);
        return {
            produtoNome: produto ? produto.nome : 'Produto não encontrado',
            quantidade: entrada.quantidade,
            preco: formatarMoeda(entrada.preco),
            total: formatarMoeda(entrada.quantidade * entrada.preco),
            data: formatarData(entrada.data),
            dataOriginal: entrada.data // Para usar nos filtros
        };
    });
    
    // Aplicar filtros iniciais (sem filtro)
    historicoFornecedorFiltrado = [...historicoFornecedorDados];
    
    // Atualizar exibição
    atualizarTabelaHistoricoFornecedor();
}

function atualizarTabelaHistoricoFornecedor() {
    const tbody = document.getElementById("corpoTabelaHistoricoFornecedor");
    const mensagemVazia = document.getElementById("mensagemNenhumHistoricoFornecedor");
    
    // Verificar se existem dados
    if (historicoFornecedorFiltrado.length === 0) {
        tbody.innerHTML = "";
        mensagemVazia.style.display = "block";
        document.getElementById("paginacaoHistoricoFornecedor").innerHTML = "";
        return;
    }
    
    // Esconder mensagem de vazio
    mensagemVazia.style.display = "none";
    
    // Calcular paginação
    const inicio = (paginaAtualHistoricoFornecedor - 1) * itensPorPaginaHistoricoFornecedor;
    const fim = inicio + itensPorPaginaHistoricoFornecedor;
    const dadosPaginados = historicoFornecedorFiltrado.slice(inicio, fim);
    
    // Gerar HTML das linhas
    let html = "";
    dadosPaginados.forEach(item => {
        html += `
            <tr>
                <td>${item.produtoNome}</td>
                <td>${item.quantidade}</td>
                <td>${item.preco}</td>
                <td>${item.total}</td>
                <td>${item.data}</td>
            </tr>
        `;
    });
    
    // Atualizar tabela
    tbody.innerHTML = html;
    
    // Atualizar paginação
    atualizarPaginacaoHistoricoFornecedor();
}

function atualizarPaginacaoHistoricoFornecedor() {
    const paginacao = document.getElementById("paginacaoHistoricoFornecedor");
    
    // Calcular páginas
    const totalPaginas = Math.ceil(historicoFornecedorFiltrado.length / itensPorPaginaHistoricoFornecedor);
    
    // Não exibir paginação se tiver apenas uma página
    if (totalPaginas <= 1) {
        paginacao.innerHTML = "";
        return;
    }
    
    // Gerar botões de paginação
    let html = "";
    
    // Botão anterior
    html += `
        <li class="page-item ${paginaAtualHistoricoFornecedor === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-pagina="${paginaAtualHistoricoFornecedor - 1}">
                <i class="fas fa-chevron-left"></i>
            </a>
        </li>
    `;
    
    // Páginas
    for (let i = 1; i <= totalPaginas; i++) {
        html += `
            <li class="page-item ${paginaAtualHistoricoFornecedor === i ? 'active' : ''}">
                <a class="page-link" href="#" data-pagina="${i}">${i}</a>
            </li>
        `;
    }
    
    // Botão próximo
    html += `
        <li class="page-item ${paginaAtualHistoricoFornecedor === totalPaginas ? 'disabled' : ''}">
            <a class="page-link" href="#" data-pagina="${paginaAtualHistoricoFornecedor + 1}">
                <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    `;
    
    // Atualizar HTML
    paginacao.innerHTML = html;
    
    // Adicionar eventos aos botões
    document.querySelectorAll("#paginacaoHistoricoFornecedor .page-link").forEach(botao => {
        botao.addEventListener("click", (e) => {
            e.preventDefault();
            const pagina = parseInt(e.currentTarget.getAttribute("data-pagina"));
            if (!isNaN(pagina)) {
                paginaAtualHistoricoFornecedor = pagina;
                atualizarTabelaHistoricoFornecedor();
            }
        });
    });
}

function filtrarHistoricoFornecedor() {
    const filtroData = document.getElementById("filtroDataHistoricoFornecedor").value;
    const filtroProduto = document.getElementById("buscarHistoricoFornecedor").value.toLowerCase();
    
    // Aplicar filtros
    historicoFornecedorFiltrado = historicoFornecedorDados.filter(item => {
        let passaFiltroData = true;
        let passaFiltroProduto = true;
        
        // Filtrar por data
        if (filtroData) {
            const dataEntrada = new Date(item.dataOriginal);
            const dataFiltro = new Date(filtroData);
            
            // Comparar apenas a data, não a hora
            passaFiltroData = dataEntrada.toDateString() === dataFiltro.toDateString();
        }
        
        // Filtrar por produto
        if (filtroProduto) {
            passaFiltroProduto = item.produtoNome.toLowerCase().includes(filtroProduto);
        }
        
        // Deve passar em ambos os filtros
        return passaFiltroData && passaFiltroProduto;
    });
    
    // Resetar para primeira página e atualizar tabela
    paginaAtualHistoricoFornecedor = 1;
    atualizarTabelaHistoricoFornecedor();
}

function limparFiltrosHistoricoFornecedor() {
    // Limpar campos de filtro
    document.getElementById("filtroDataHistoricoFornecedor").value = "";
    document.getElementById("buscarHistoricoFornecedor").value = "";
    
    // Resetar dados filtrados
    historicoFornecedorFiltrado = [...historicoFornecedorDados];
    
    // Atualizar tabela
    paginaAtualHistoricoFornecedor = 1;
    atualizarTabelaHistoricoFornecedor();
}

// Função auxiliar para formatar moeda
function formatarMoeda(valor) {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

// Função auxiliar para formatar data
function formatarData(dataString) {
    // Se não houver data, retornar mensagem amigável
    if (!dataString) {
        return "Data não disponível";
    }
    
    try {
        // Verificar se é um timestamp em milissegundos (número)
        if (!isNaN(dataString) && typeof dataString === 'number') {
            const data = new Date(dataString);
            return data.toLocaleDateString('pt-BR');
        }
        
        // Verificar se é uma string
        if (typeof dataString === 'string') {
            // Verificar se é formato MySQL (YYYY-MM-DD HH:MM:SS)
            if (dataString.match(/^\d{4}-\d{2}-\d{2}(?: \d{2}:\d{2}:\d{2})?$/)) {
                const data = new Date(dataString.replace(' ', 'T'));
                return data.toLocaleDateString('pt-BR');
            }
            
            // Verificar se é formato ISO (YYYY-MM-DDTHH:MM:SSZ)
            if (dataString.includes('T')) {
                const data = new Date(dataString);
                return data.toLocaleDateString('pt-BR');
            }
            
            // Verificar se é formato brasileiro (DD/MM/YYYY)
            if (dataString.includes('/')) {
                const partes = dataString.split('/');
                if (partes.length === 3) {
                    // No formato DD/MM/YYYY, precisamos converter para MM/DD/YYYY
                    const data = new Date(`${partes[1]}/${partes[0]}/${partes[2]}`);
                    if (!isNaN(data.getTime())) {
                        return data.toLocaleDateString('pt-BR');
                    }
                }
            }
            
            // Verificar se é formato com traços (DD-MM-YYYY)
            if (dataString.match(/^\d{2}-\d{2}-\d{4}$/)) {
                const partes = dataString.split('-');
                const data = new Date(`${partes[1]}/${partes[0]}/${partes[2]}`);
                if (!isNaN(data.getTime())) {
                    return data.toLocaleDateString('pt-BR');
                }
            }
            
            // Tentar formato americano simples (YYYY/MM/DD)
            if (dataString.match(/^\d{4}\/\d{2}\/\d{2}$/)) {
                const data = new Date(dataString);
                if (!isNaN(data.getTime())) {
                    return data.toLocaleDateString('pt-BR');
                }
            }
            
            // Último recurso: tentar converter diretamente
            const data = new Date(dataString);
            if (!isNaN(data.getTime())) {
                return data.toLocaleDateString('pt-BR');
            }
        }
        
        // Se chegou aqui, nenhum formato funcionou
        console.warn("Formato de data não reconhecido:", dataString);
        return "Data não reconhecida";
        
    } catch (error) {
        console.error("Erro ao processar data:", error, dataString);
        return "Erro na data";
    }
}

async function loadAllData() {
    try {
        await Promise.all([
            fetchFornecedores(),
            fetchProdutos(),
            fetchCategorias(),
            fetchClientes(),
            fetchEntradas(),
            fetchSaidas(),
        ]);
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadAllData();
});

// Função para ordenar a tabela de fornecedores
function ordenarTabelaFornecedores(coluna, idSeta) {
    if (ordemAtualFornecedores.coluna === coluna) {
        ordemAtualFornecedores.crescente = !ordemAtualFornecedores.crescente;
    } else {
        ordemAtualFornecedores.coluna = coluna;
        ordemAtualFornecedores.crescente = true;
    }

    document.querySelectorAll(".seta").forEach(seta => (seta.textContent = "⬍"));
    const setaAtual = document.getElementById(idSeta);
    setaAtual.textContent = ordemAtualFornecedores.crescente ? "⬆" : "⬇";

    aplicarOrdenacaoFornecedores();
    mostrarPaginaFornecedores(1); // Sempre volta para a primeira página após uma nova ordenação
}

// Adicionando eventos de clique para ordenar as colunas de fornecedores
document.getElementById("ordenarNomeFornecedor").addEventListener("click", () => ordenarTabelaFornecedores("nome", "setaNomeFornecedor"));

function formatarCNPJ(event) {
    let cnpj = event.target.value;

    // Remove qualquer caractere que não seja número
    cnpj = cnpj.replace(/\D/g, '');

    // Formata o CNPJ no padrão XX.XXX.XXX/XXXX-XX
    if (cnpj.length <= 14) {
        cnpj = cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    // Atualiza o valor do campo com o CNPJ formatado
    event.target.value = cnpj;
}

function formatarTelefone(event) {
    const input = event.target;
    let valor = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (valor.length > 11) valor = valor.slice(0, 11); // Limita a 11 caracteres

    const tamanhoAnterior = input.dataset.previousLength || 0;
    input.dataset.previousLength = valor.length;

    if (tamanhoAnterior > valor.length) {
        input.value = valor; // Não aplica máscara ao apagar
        return;
    }

    if (valor.length <= 10) {
        input.value = valor.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
        input.value = valor.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
}

document.getElementById('telefoneFornecedor').addEventListener('input', formatarTelefone);

function formatarCEP(event) {
    const input = event.target;
    let valor = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    
    if (valor.length > 8) valor = valor.slice(0, 8); // Limita a 8 caracteres

    // Aplica a máscara do CEP apenas se o usuário estiver digitando
    if (valor.length > 5) {
        input.value = valor.replace(/(\d{5})(\d{0,3})/, '$1-$2');
    } else {
        input.value = valor; // Exibe os números sem máscara até 5 dígitos
    }
}

// Adiciona o evento ao campo de entrada
document.getElementById('cepFornecedor').addEventListener('input', formatarCEP);
