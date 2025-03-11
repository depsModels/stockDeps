const BASE_URL = '/stockDeps/app';

const itensPorPaginaClientes = 8;   // Quantidade de clientes por página
const maxBotoesPaginacaoClientes = 5;
let paginaAtualClientes = 1;        // Sempre começar na página 1

let clientes = [];
let clientesFiltrados = []; // Variável global para armazenar clientes filtrados
let produtos = [];
let saidas = [];
let categorias = [];

let ordemAtualClientes = {
    coluna: 'nome',  // Ordenação padrão por nome
    crescente: true
};

async function fetchProdutos() {
    try {
        produtos = await (await fetch(`${BASE_URL}/getProdutos`)).json();
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
    }
}

async function fetchCategorias() {
    try {
        categorias = await (await fetch(`${BASE_URL}/getCategorias`)).json();
    } catch (error) {
        console.error("Erro ao carregar categorias:", error);
    }
}

async function fetchClientes() {
    try {
        const response = await fetch(`${BASE_URL}/getClientes`);
        
        if (!response.ok) {
            throw new Error(`Erro ao buscar clientes: ${response.status} ${response.statusText}`);
        }
        
        clientes = await response.json();
        
        if (!Array.isArray(clientes)) {
            console.error("Dados recebidos não são um array:", clientes);
            clientes = [];
        }
        
        clientesFiltrados = [...clientes];
        
        aplicarOrdenacaoClientes();
        mostrarPaginaClientes(paginaAtualClientes);
        buscarCliente();
        
    } catch (error) {
        console.error("Erro ao carregar clientes:", error);
        alert("Ocorreu um erro ao carregar os clientes. Verifique o console para mais detalhes.");
    }
}

async function fetchEntradas() {
    try {
        entradas = await (await fetch(`${BASE_URL}/getEntradas`)).json();
    } catch (error) {
        console.error("Erro ao carregar entradas:", error);
    }
}

async function fetchSaidas() {
    try {
        const response = await fetch(`${BASE_URL}/getSaidas`);
        saidas = await response.json();
        
        // Verificar se há saídas para processar datas
        if (saidas && saidas.length > 0) {
            // Teste de conversão de data
            if (saidas[0] && saidas[0].data) {
                const dataTeste = new Date(saidas[0].data);
            }
        }
    } catch (error) {
        console.error("Erro ao carregar saídas:", error);
    }
}

async function loadAllData() {
    // Carregar produtos
    await fetchProdutos();
    
    // Carregar categorias
    await fetchCategorias();
    
    // Carregar clientes
    await fetchClientes();
    
    // Carregar entradas
    await fetchEntradas();
    
    // Carregar saídas
    await fetchSaidas();
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM carregado, iniciando aplicação");
    
    // Verificar se os elementos HTML necessários existem
    const tabelaClientes = document.querySelector("#tabelaClientes tbody");
    if (!tabelaClientes) {
        console.error("ERRO CRÍTICO: Tabela de clientes não encontrada no DOM!");
        alert("Erro ao inicializar a página de clientes. A tabela não foi encontrada.");
        return;
    } else {
        console.log("Tabela de clientes encontrada no DOM");
    }
    
    const paginacaoClientes = document.getElementById("paginationClientes");
    if (!paginacaoClientes) {
        console.error("ERRO: Elemento de paginação não encontrado no DOM!");
    } else {
        console.log("Elemento de paginação encontrado no DOM");
    }
    
    // Adicionar eventos de ordenação
    const ordenarNome = document.getElementById("ordenarNomeCliente");
    if (ordenarNome) {
        ordenarNome.addEventListener("click", () => ordenarTabelaClientes("nome", "setaNomeCliente"));
    }
    
    const ordenarCpf = document.getElementById("ordenarCpfCliente");
    if (ordenarCpf) {
        ordenarCpf.addEventListener("click", () => ordenarTabelaClientes("cpf", "setaCpfCliente"));
    }
    
    const ordenarTelefone = document.getElementById("ordenarTelefoneCliente");
    if (ordenarTelefone) {
        ordenarTelefone.addEventListener("click", () => ordenarTabelaClientes("celular", "setaTelefoneCliente"));
    }
    
    // Iniciar carregamento de dados
    loadAllData();
});

function preencherTabelaClientes(clientesPaginados) {
    const tabela = document.getElementById('tabelaClientes');
    
    // Limpar tabela
    const tbody = tabela.querySelector('tbody');
    tbody.innerHTML = '';
    
    // Verificar se há clientes para exibir
    if (!clientesPaginados || clientesPaginados.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="6" class="text-center">Nenhum cliente encontrado</td>';
        tbody.appendChild(tr);
        return;
    }
    
    // Adicionar cada cliente à tabela
    clientesPaginados.forEach((cliente) => {
        const tr = document.createElement('tr');
        
        // Construindo as células da tabela
        tr.innerHTML = `
            <td>${cliente.nome}</td>
            <td>${cliente.cpf}</td>
            <td>${cliente.celular || '-'}</td>
            <td class="text-center">
                <div class="d-flex gap-2 justify-content-center">
                    <button class="btn btn-primary btn-sm action-btn" onclick="abrirModalEditarCliente(${cliente.id})" data-bs-toggle="tooltip" title="Editar cliente">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm action-btn" onclick="openModalExcluir(${cliente.id})" data-bs-toggle="tooltip" title="Excluir cliente">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                    <button class="btn btn-success btn-sm action-btn" onclick="abrirModalHistorico(${cliente.id})" data-bs-toggle="tooltip" title="Histórico de compras">
                        <i class="fas fa-history"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(tr);
    });

    // Inicializar tooltips
    setTimeout(() => {
        const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltips.forEach(tooltip => {
            new bootstrap.Tooltip(tooltip);
        });
    }, 100);
}

function mostrarPaginaClientes(pagina) {
    // Verificar se há clientes para exibir
    if (clientesFiltrados.length === 0) {
        preencherTabelaClientes([]);
        atualizarPaginacaoClientes();
        return;
    }
    
    // Calcular índice inicial e final para paginação
    const inicio = (pagina - 1) * itensPorPaginaClientes;
    const fim = Math.min(inicio + itensPorPaginaClientes, clientesFiltrados.length);
    
    // Verificar se a página está vazia
    if (fim <= inicio && pagina > 1) {
        // Se estiver vazia, voltar para a página anterior
        mostrarPaginaClientes(pagina - 1);
        return;
    }
    
    // Obter os clientes para a página atual
    const clientesPaginados = clientesFiltrados.slice(inicio, fim);
    
    // Atualizar a tabela e a paginação
    preencherTabelaClientes(clientesPaginados);
    atualizarPaginacaoClientes();
    
    // Atualizar a página atual
    paginaAtualClientes = pagina;
}

function atualizarPaginacaoClientes() {
    const totalPaginas = Math.ceil(clientesFiltrados.length / itensPorPaginaClientes);
    const pagination = document.getElementById('paginationClientes');
    pagination.innerHTML = '';

    const maxLeft = Math.max(paginaAtualClientes - Math.floor(maxBotoesPaginacaoClientes / 2), 1);
    const maxRight = Math.min(maxLeft + maxBotoesPaginacaoClientes - 1, totalPaginas);

    if (paginaAtualClientes > 1) {
        const prevLi = document.createElement('li');
        prevLi.classList.add('page-item');
        prevLi.innerHTML = `<a class="page-link" href="#">Anterior</a>`;
        prevLi.onclick = () => mostrarPaginaClientes(paginaAtualClientes - 1);
        pagination.appendChild(prevLi);
    }

    for (let i = maxLeft; i <= maxRight; i++) {
        const li = document.createElement('li');
        li.classList.add('page-item');
        if (i === paginaAtualClientes) {
            li.classList.add('active');
        }

        const a = document.createElement('a');
        a.classList.add('page-link');
        a.textContent = i;
        a.onclick = () => mostrarPaginaClientes(i);
        li.appendChild(a);
        pagination.appendChild(li);
    }

    if (paginaAtualClientes < totalPaginas) {
        const nextLi = document.createElement('li');
        nextLi.classList.add('page-item');
        nextLi.innerHTML = `<a class="page-link" href="#">Próximo</a>`;
        nextLi.onclick = () => mostrarPaginaClientes(paginaAtualClientes + 1);
        pagination.appendChild(nextLi);
    }
}

function buscarCliente() {
    const buscaInput = document.getElementById('buscaClientes');
    if (!buscaInput) return;

    buscaInput.addEventListener('input', function() {
        const termo = this.value.toLowerCase().trim();
        
        if (termo === '') {
            // Se o termo de busca estiver vazio, mostrar todos
            clientesFiltrados = [...clientes];
        } else {
            // Filtrar pelos campos
            clientesFiltrados = clientes.filter(cliente => {
                return (
                    (cliente.nome && cliente.nome.toLowerCase().includes(termo)) ||
                    (cliente.cpf && cliente.cpf.toLowerCase().includes(termo)) ||
                    (cliente.celular && cliente.celular.toLowerCase().includes(termo)) ||
                    (cliente.email && cliente.email.toLowerCase().includes(termo))
                );
            });
        }
        
        // Aplicar ordenação e atualizar tabela
        aplicarOrdenacaoClientes();
        mostrarPaginaClientes(1);
    });
}

function abrirModalEditarCliente(id) {
    const cliente = clientes.find(c => c.id === id);
    if (!cliente) {
        exibirMensagemTemporariaErro("Cliente não encontrado");
        return;
    }

    // Fechar qualquer modal que possa estar aberto
    const modaisAbertos = document.querySelectorAll('.modal.show');
    modaisAbertos.forEach(modalAberto => {
        const bsModal = bootstrap.Modal.getInstance(modalAberto);
        if (bsModal) {
            bsModal.hide();
        }
    });

    // Preencher os campos do formulário
    document.getElementById("idClienteUpdate").value = id;
    document.getElementById("editarNomeCliente").value = cliente.nome;
    document.getElementById("editarCpfCliente").value = cliente.cpf;
    document.getElementById("editarTelefoneCliente").value = cliente.celular || '';

    // Abrir o modal de edição
    const modalEditar = new bootstrap.Modal(document.getElementById("modalEditarCliente"));
    modalEditar.show();
}

function abrirModalHistorico(id) {
    const modalHistorico = new bootstrap.Modal(document.getElementById("modalHistoricoCliente"));

    // Armazenar ID do cliente selecionado
    document.getElementById("clienteIdHistorico").value = id;
    
    // Limpar filtros
    document.getElementById("filtroDataHistoricoCliente").value = "";
    document.getElementById("buscarHistoricoCliente").value = "";
    
    // Carregar dados do histórico
    carregarHistoricoCliente(id);
    
    // Mostrar modal
    modalHistorico.show();
}

// Variáveis para controle da paginação e dados do histórico
let historicoClienteDados = [];
let historicoClienteFiltrado = [];
let paginaAtualHistoricoCliente = 1;
const itensPorPaginaHistoricoCliente = 5;

function carregarHistoricoCliente(clienteId) {
    // Verificar se temos dados de saídas
    if (!Array.isArray(saidas) || saidas.length === 0) {
        historicoClienteDados = [];
        historicoClienteFiltrado = [];
        atualizarTabelaHistoricoCliente();
        return;
    }
    
    try {
        // Ordenar saídas por data (mais recentes primeiro)
        // Usar uma cópia para evitar modificar o array original
        const saidasOrdenadas = [...saidas].sort((a, b) => {
            const dataA = new Date(a.data || 0);
            const dataB = new Date(b.data || 0);
            
            // Verificar se as datas são válidas
            if (isNaN(dataA.getTime()) && isNaN(dataB.getTime())) return 0;
            if (isNaN(dataA.getTime())) return 1;  // b vem primeiro
            if (isNaN(dataB.getTime())) return -1; // a vem primeiro
            
            return dataB - dataA;
        });
        
        // Filtrar saídas do cliente
        const saidasCliente = saidasOrdenadas.filter(saida => saida.idClientes === clienteId);
        
        // Transformar dados para exibição
        historicoClienteDados = saidasCliente.map(saida => {
            const produto = produtos.find(p => p.id === saida.idProdutos);
            
            // Calcular o preço total com segurança
            const preco = typeof saida.preco === 'number' ? saida.preco : 0;
            const quantidade = typeof saida.quantidade === 'number' ? saida.quantidade : 0;
            const total = preco * quantidade;
            
            // Formatar a data original para exibição
            const dataFormatada = formatarData(saida.data);
            
            return {
                produtoNome: produto ? produto.nome : 'Produto não encontrado',
                quantidade: saida.quantidade,
                preco: formatarMoeda(preco),
                total: formatarMoeda(total),
                data: dataFormatada,
                dataOriginal: saida.data // Para usar nos filtros
            };
        });
        
        // Aplicar filtros iniciais (sem filtro)
        historicoClienteFiltrado = [...historicoClienteDados];
        
        // Atualizar exibição
        atualizarTabelaHistoricoCliente();
    } catch (error) {
        historicoClienteDados = [];
        historicoClienteFiltrado = [];
        atualizarTabelaHistoricoCliente();
    }
}

function atualizarTabelaHistoricoCliente() {
    const tbody = document.getElementById("corpoTabelaHistoricoCliente");
    const mensagemVazia = document.getElementById("mensagemNenhumHistoricoCliente");
    
    // Verificar se existem dados
    if (historicoClienteFiltrado.length === 0) {
        tbody.innerHTML = "";
        mensagemVazia.style.display = "block";
        document.getElementById("paginacaoHistoricoCliente").innerHTML = "";
        return;
    }
    
    // Esconder mensagem de vazio
    mensagemVazia.style.display = "none";
    
    // Calcular paginação
    const inicio = (paginaAtualHistoricoCliente - 1) * itensPorPaginaHistoricoCliente;
    const fim = inicio + itensPorPaginaHistoricoCliente;
    const dadosPaginados = historicoClienteFiltrado.slice(inicio, fim);
    
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
    atualizarPaginacaoHistoricoCliente();
}

function atualizarPaginacaoHistoricoCliente() {
    const paginacao = document.getElementById("paginacaoHistoricoCliente");
    
    // Calcular páginas
    const totalPaginas = Math.ceil(historicoClienteFiltrado.length / itensPorPaginaHistoricoCliente);
    
    // Não exibir paginação se tiver apenas uma página
    if (totalPaginas <= 1) {
        paginacao.innerHTML = "";
        return;
    }
    
    // Gerar botões de paginação
    let html = "";
    
    // Botão anterior
    html += `
        <li class="page-item ${paginaAtualHistoricoCliente === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-pagina="${paginaAtualHistoricoCliente - 1}">
                <i class="fas fa-chevron-left"></i>
            </a>
        </li>
    `;
    
    // Páginas
    for (let i = 1; i <= totalPaginas; i++) {
        html += `
            <li class="page-item ${paginaAtualHistoricoCliente === i ? 'active' : ''}">
                <a class="page-link" href="#" data-pagina="${i}">${i}</a>
            </li>
        `;
    }
    
    // Botão próximo
    html += `
        <li class="page-item ${paginaAtualHistoricoCliente === totalPaginas ? 'disabled' : ''}">
            <a class="page-link" href="#" data-pagina="${paginaAtualHistoricoCliente + 1}">
                <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    `;
    
    // Atualizar HTML
    paginacao.innerHTML = html;
    
    // Adicionar eventos aos botões
    document.querySelectorAll("#paginacaoHistoricoCliente .page-link").forEach(botao => {
        botao.addEventListener("click", (e) => {
            e.preventDefault();
            const pagina = parseInt(e.currentTarget.getAttribute("data-pagina"));
            if (!isNaN(pagina)) {
                paginaAtualHistoricoCliente = pagina;
                atualizarTabelaHistoricoCliente();
            }
        });
    });
}

function filtrarHistoricoCliente() {
    const filtroData = document.getElementById("filtroDataHistoricoCliente").value;
    const filtroProduto = document.getElementById("buscarHistoricoCliente").value.toLowerCase();
    
    try {
        // Verificar se temos dados
        if (!Array.isArray(historicoClienteDados)) {
            historicoClienteFiltrado = [];
            return;
        }
        
        // Se não há filtros, retornar todos os itens
        if (!filtroData && !filtroProduto) {
            historicoClienteFiltrado = [...historicoClienteDados];
            return historicoClienteFiltrado;
        }
        
        // Filtrar por data e/ou produto
        historicoClienteFiltrado = historicoClienteDados.filter(item => {
            let passaFiltroData = true;
            let passaFiltroProduto = true;
            
            // Filtrar por data
            if (filtroData) {
                if (item.data) {
                    const dataSaida = new Date(item.data);
                    const dataFiltro = new Date(filtroData);
                    
                    // Converter para string no formato YYYY-MM-DD para comparação
                    const dataSaidaStr = dataSaida.toISOString().split('T')[0];
                    const dataFiltroStr = dataFiltro.toISOString().split('T')[0];
                    
                    passaFiltroData = dataSaidaStr === dataFiltroStr;
                }
            }
            
            // Filtrar por produto
            if (filtroProduto) {
                const produtoNome = String(item.produtoNome || '').toLowerCase();
                passaFiltroProduto = produtoNome.includes(filtroProduto);
            }
            
            // Retornar apenas itens que passam por ambos os filtros
            return passaFiltroData && passaFiltroProduto;
        });
        
        // Atualizar tabela com os dados filtrados
        atualizarTabelaHistoricoCliente();
        
        return historicoClienteFiltrado;
    } catch (error) {
        console.error("Erro ao filtrar histórico:", error);
        return [];
    }
}

function limparFiltrosHistoricoCliente() {
    // Limpar campos de filtro
    document.getElementById("filtroDataHistoricoCliente").value = "";
    document.getElementById("buscarHistoricoCliente").value = "";
    
    // Resetar dados filtrados
    historicoClienteFiltrado = [...historicoClienteDados];
    
    // Atualizar tabela
    paginaAtualHistoricoCliente = 1;
    atualizarTabelaHistoricoCliente();
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

function aplicarOrdenacaoClientes() {
    const { coluna, crescente } = ordemAtualClientes;
    
    clientesOrdenados = [...clientesFiltrados].sort((a, b) => {
        // Tratar valores nulos ou undefined
        let valorA = a[coluna] || '';
        let valorB = b[coluna] || '';
        
        // Converter para minúsculas se for string
        if (typeof valorA === 'string') valorA = valorA.toLowerCase();
        if (typeof valorB === 'string') valorB = valorB.toLowerCase();
        
        // Ordenar
        if (valorA < valorB) return crescente ? -1 : 1;
        if (valorA > valorB) return crescente ? 1 : -1;
        return 0;
    });
}

function ordenarTabelaClientes(coluna, idSeta) {
    // Se clicar na mesma coluna que já está ordenada, inverter a direção
    if (ordemAtualClientes.coluna === coluna) {
        ordemAtualClientes.crescente = !ordemAtualClientes.crescente;
    } else {
        ordemAtualClientes.coluna = coluna;
        ordemAtualClientes.crescente = true;
    }
    
    // Aplicar ordenação e atualizar tabela
    aplicarOrdenacaoClientes();
    mostrarPaginaClientes(1); // Voltar para a primeira página
    
    // Atualizar ícone de ordenação
    const seta = document.getElementById(idSeta);
    if (seta) {
        seta.className = `fas fa-sort-${ordemAtualClientes.crescente ? 'up' : 'down'}`;
    }
}

function openModalExcluir(clienteId) {
    // Insere o ID do cliente no campo oculto do modal
    const inputClienteId = document.getElementById('idClienteExcluir');
    inputClienteId.value = clienteId;

    // Mostra o modal
    new bootstrap.Modal(document.getElementById('modalExcluir')).show();
}