const BASE_URL = '/app';

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
    try {
        const response = await fetch(`${BASE_URL}/getFornecedores`);
        if (!response.ok) throw new Error(`Erro ao buscar fornecedores: ${response.statusText}`);

        fornecedores = await response.json();
        fornecedoresFiltrados = [...fornecedores];
        aplicarOrdenacaoFornecedores();
        mostrarPaginaFornecedores(paginaAtualFornecedores);
        buscarFornecedor()
    } catch (error) {
        console.error('Erro em fetchFornecedores:', error);
        fornecedores = [];
        fornecedoresFiltrados = [];
        mostrarPaginaFornecedores(1);
    }
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
            <td>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="editarFornecedor(${fornecedor.id})" data-bs-toggle="modal" data-bs-target="#modalEditarFornecedor" id="editarFornecedorBtn">Editar</button>
                    <button class="btn btn-danger" onclick="openModalExcluir(${fornecedor.id})">Excluir</button>
                    <button class="btn btn-success" onclick="abrirModalHistorico(${fornecedor.id})">Histórico</button>
                </div>
            </td>
        `;
        tabela.appendChild(linha);
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

        abrirModal()
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
    const modalHistorico = new bootstrap.Modal(document.getElementById("modalHistoricoFornecedor"));

    document.getElementById("historicoFornecedor").textContent = `Carregando histórico do fornecedor ID ${id}...`;
    entradas.sort((a, b) => b.id - a.id);
    const entradasFornecedor = entradas.filter(entrada => entrada.idFornecedor === id);

    let htmlHistorico = '';
    if (entradasFornecedor.length > 0) {
        entradasFornecedor.forEach(entrada => {
            const produto = produtos.find(p => p.id === entrada.idProdutos);
            const categoria = produto ? categorias.find(c => c.id === produto.idCategoria) : null;

            htmlHistorico += `
                <p><strong>Produto:</strong> ${produto ? produto.nome : 'Desconhecido'} <br>
                <strong>Categoria:</strong> ${categoria ? categoria.nome : 'Desconhecida'} <br>
                <strong>Quantidade:</strong> ${entrada.quantidade} <br>
                <strong>Preço:</strong> ${entrada.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} <br>
                <strong>Data:</strong> ${new Date(entrada.created_at).toLocaleDateString()}</p>
            `;
        });
    } else {
        htmlHistorico = '<p>Nenhuma entrada registrada para este fornecedor.</p>';
    }

    document.getElementById("historicoFornecedor").innerHTML = htmlHistorico;

    modalHistorico.show();
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
