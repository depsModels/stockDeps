// Caminho: delete.js

// Função genérica para gerenciar exclusões
function handleDeleteFormSubmission(formSelector, url, callback) {
    $(formSelector).on("submit", function (e) {
        e.preventDefault();

        $.ajax({
            type: "POST",  // Use "DELETE" se o backend suportar
            url: url,
            data: $(this).serialize(),
            dataType: "json",
            success: function (response) {
                if (response.type === 'error') {
                    exibirMensagemTemporariaErro(response.message || "Erro desconhecido.");
                    return;
                }
                exibirMensagemTemporariaSucesso(response.message || "Operação concluída com sucesso.");
                fecharModalAtivo();
                if (callback) callback(response);
            },
            error: function (xhr, status, error) {
                console.error("Erro na requisição AJAX:", xhr.status, error);
                exibirMensagemTemporariaErro("Erro ao processar a solicitação.");
            }
        });
    });
}

// Fecha o modal ativo se houver
function fecharModalAtivo() {
    const modalAtivo = bootstrap.Modal.getInstance(document.querySelector('.modal.show'));
    if (modalAtivo) modalAtivo.hide();
}

// Manipulação local e atualizações
const atualizadores = {
    produtos: {
        remover: (id) => {
            produtos = produtos.filter(produto => produto.codigo_produto !== id);
            preencherTabela(produtos, "#tabelaProdutos tbody", limparTabelaProdutos);
        },
        atualizar: async () => atualizarLista("/getProdutos", produtos, preencherTabelaProdutos, limparTabelaProdutos)
    },
    clientes: {
        remover: (id) => {
            clientes = clientes.filter(cliente => cliente.id !== id);
            preencherTabela(clientes, "#tabelaClientes tbody", limparTabelaClientes);
        },
        atualizar: async () => atualizarLista("/getClientes", clientes, preencherTabelaClientes, limparTabelaClientes)
    },
    fornecedores: {
        remover: (id) => {
            fornecedores = fornecedores.filter(fornecedor => fornecedor.id !== id);
            preencherTabela(fornecedores, "#tabelaFornecedores tbody", limparTabelaFornecedores);
        },
        atualizar: async () => atualizarLista("/getFornecedores", fornecedores, preencherTabelaFornecedores, limparTabelaFornecedores)
    },
    entradas: {
        atualizar: async () => atualizarLista("/getEntradas", entradas, mostrarPaginaEntradas, limparTabelaEntradas)
    },
    saidas: {
        atualizar: async () => atualizarLista("/getSaidas", saidas, mostrarPaginaSaidas, limparTabelaSaidas)
    },
    categorias: {
        atualizar: async () => atualizarLista("/getCategorias", categorias, renderizarTabela, limparTabelaCategorias)
    }
};

// Função genérica para atualizar listas
async function atualizarLista(endpoint, lista, preencher, limpar) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const dadosAtualizados = await response.json(); // Certifique-se de ler o corpo apenas uma vez
        lista = Array.isArray(dadosAtualizados) ? dadosAtualizados : [];
        preencher(lista);
        if (lista.length === 0) limpar();
    } catch (error) {
        console.error(`Erro ao atualizar: ${endpoint}`, error);
        exibirMensagemTemporariaErro("Erro ao atualizar dados.");
    }
}

// Preenche tabelas ou exibe mensagem de vazio
function preencherTabela(lista, tabelaSelector, limparTabela) {
    if (lista.length === 0) {
        limparTabela();
        return;
    }
    // Implementar aqui a lógica de renderização da tabela, se necessário
}

// Funções para limpar tabelas vazias
function limparTabelaProdutos() {
    limparTabela("#tabelaProdutos tbody", "Nenhum produto encontrado.");
}

function limparTabelaClientes() {
    limparTabela("#tabelaClientes tbody", "Nenhum cliente encontrado.");
}

function limparTabelaFornecedores() {
    limparTabela("#tabelaFornecedores tbody", "Nenhum fornecedor encontrado.");
}

function limparTabelaEntradas() {
    limparTabela("#tabelaEntradas tbody", "Nenhuma entrada encontrada.");
}

function limparTabelaSaidas() {
    limparTabela("#tabelaSaidas tbody", "Nenhuma saída encontrada.");
}

function limparTabelaCategorias() {
    limparTabela("#corpoTabelaCategorias", "Nenhuma categoria encontrada.");
}

function limparTabela(selector, mensagem) {
    const tabela = document.querySelector(selector);
    if (tabela) tabela.innerHTML = `<tr><td colspan="6" class="text-center">${mensagem}</td></tr>`;
}

function removerClienteLocalmente(idCliente) {
    // Remove o cliente da lista
    clientes = clientes.filter(cliente => cliente.id !== idCliente);
    clientesFiltrados = [...clientes]; // Atualiza os filtrados com a lista geral

    // Ajusta a página atual e exibe a tabela
    const totalPaginas = Math.ceil(clientesFiltrados.length / itensPorPaginaClientes);
    if (paginaAtualClientes > totalPaginas) {
        paginaAtualClientes = totalPaginas || 1; // Ajusta para a última página válida
    }
    mostrarPaginaClientes(paginaAtualClientes);
}


async function atualizarClientes() {
    try {
        const response = await fetch(`${BASE_URL}/getClientes`);
        clientes = await response.json();
        clientesFiltrados = [...clientes];
        aplicarOrdenacaoClientes();
        mostrarPaginaClientes(paginaAtualClientes);
    } catch (error) {
        console.error("Erro ao atualizar clientes:", error);
        exibirMensagemTemporariaErro("Erro ao atualizar a lista de clientes.");
    }
}

async function atualizarFornecedores() {
    try {
        const response = await fetch(`${BASE_URL}/getFornecedores`);
        fornecedores = await response.json();
        fornecedoresFiltrados = [...fornecedores];
        aplicarOrdenacaoFornecedores();
        mostrarPaginaFornecedores(paginaAtualFornecedores);
    } catch (error) {
        console.error("Erro ao atualizar fornecedores:", error);
        exibirMensagemTemporariaErro("Erro ao atualizar a lista de fornecedores.");
    }
}

function removerFornecedorLocalmente(idFornecedor) {
    fornecedores = fornecedores.filter(fornecedor => fornecedor.id !== idFornecedor);
    fornecedoresFiltrados = [...fornecedores]; // Atualiza os filtrados com a lista geral

    // Ajusta a página atual e exibe a tabela
    const totalPaginas = Math.ceil(fornecedoresFiltrados.length / itensPorPaginaFornecedores);
    if (paginaAtualFornecedores > totalPaginas) {
        paginaAtualFornecedores = totalPaginas || 1; // Ajusta para a última página válida
    }
    mostrarPaginaFornecedores(paginaAtualFornecedores);
}

handleDeleteFormSubmission("#produto-excluir", `${BASE_URL}/estoque-pd`, (response) => {
    if (response.produtoExcluidoId) atualizadores.produtos.remover(response.produtoExcluidoId);
    atualizadores.produtos.atualizar();
});

handleDeleteFormSubmission("#categoria-excluir", `${BASE_URL}/estoque-cd`, () => {
    fetchCategorias()
    atualizadores.categorias.atualizar();
    atualizadores.produtos.atualizar();
});

handleDeleteFormSubmission("#entrada-excluir", `${BASE_URL}/estoque-ed`, () => {
    Promise.all([
        atualizadores.entradas.atualizar(), // Atualiza entradas
        atualizadores.produtos.atualizar()  // Atualiza produtos após exclusão de entrada
    ]).catch(error => {
        console.error("Erro ao atualizar entradas e produtos:", error);
        exibirMensagemTemporariaErro("Erro ao atualizar os dados após exclusão.");
    });
});

handleDeleteFormSubmission("#saida-excluir", `${BASE_URL}/estoque-sd`, () => {
    Promise.all([
        atualizadores.saidas.atualizar(),   // Atualiza saídas
        atualizadores.produtos.atualizar() // Atualiza produtos após exclusão de saída
    ]).catch(error => {
        console.error("Erro ao atualizar saídas e produtos:", error);
        exibirMensagemTemporariaErro("Erro ao atualizar os dados após exclusão.");
    });
});

handleDeleteFormSubmission("#cliente-excluir", `${BASE_URL}/deletar-clientes`, (response) => {
    if (response.clienteExcluidoId) {
        removerClienteLocalmente(response.clienteExcluidoId);
    }
    atualizarClientes(); // Atualiza a lista geral após exclusão
});

handleDeleteFormSubmission("#fornecedor-excluir", `${BASE_URL}/deletar-fornecedores`, (response) => {
    if (response.fornecedorExcluidoId) {
        removerFornecedorLocalmente(response.fornecedorExcluidoId);
    }
    atualizarFornecedores(); // Atualiza a lista geral após exclusão
});