// Use as configurações globais

async function handleEditFormSubmission(formSelector, url, callback) {
    const form = document.querySelector(formSelector);
    if (!form) return;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        
        try {
            const formData = new FormData(this);
            const response = await fetch(`${window.location.origin + '/app'}${url}`, {
                method: "POST",
                body: formData,
                ...DEFAULT_FETCH_OPTIONS
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.error) {
                exibirMensagemTemporariaErro(data.error);
                return;
            }

            exibirMensagemTemporariaSucesso("Atualizado com sucesso!");
            if (callback) callback(data);
            
            const modal = bootstrap.Modal.getInstance(document.querySelector(formSelector).closest('.modal'));
            if (modal) {
                modal.hide();
            }
            
        } catch (error) {
            handleApiError(error, url);
            exibirMensagemTemporariaErro("Erro ao atualizar. Tente novamente.");
        }
    });
}

// Atualiza produtos, entradas, e saídas dinamicamente
function atualizarDadosGlobais(response) {
    // Atualiza produtos se houver dados de produtos na resposta
    if (response.produtos) {
        produtos = response.produtos;
        produtosFiltrados = [...produtos];
        produtosOrdenados = [...produtos];
        mostrarPagina(1);
    }

    // Atualiza entradas se houver dados de entradas na resposta
    if (response.entradas) {
        entradas = response.entradas;
        entradasFiltradas = [...entradas];
        mostrarPaginaEntradas(1);
        fetchProdutos();
    }

    // Atualiza saídas se houver dados de saídas na resposta
    if (response.saidas) {
        saidas = response.saidas;
        saidasFiltradas = [...saidas];
        mostrarPaginaSaidas(1);
        fetchProdutos();
    }
}

// Registra formulários para edição
handleEditFormSubmission("#produto-update", "/estoque-pu", function(response) {
    if (response.produtos) {
        produtos = response.produtos;
        produtosFiltrados = [...produtos];
        produtosOrdenados = [...produtos];
        mostrarPagina(1);
    }
});
handleEditFormSubmission("#entrada-editar", "/estoque-eu", atualizarDadosGlobais);
handleEditFormSubmission("#saida-editar", "/estoque-su", atualizarDadosGlobais);
handleEditFormSubmission("#categoria-editar", "/estoque-cu", fetchCategorias);
handleEditFormSubmission("#cliente-update", "/update-clientes", fetchClientes);
handleEditFormSubmission("#formEditarFornecedor", "/update-fornecedores", fetchFornecedores);

// Função para formatar preço antes de enviar
function formatarPrecoParaEnvio(preco) {
    if (!preco) return '';
    // Remove o símbolo da moeda e espaços
    preco = preco.replace('R$', '').trim();
    // Remove os pontos de milhar e substitui vírgula por ponto
    return preco.replace(/\./g, '').replace(',', '.');
}

// Adicionar handler para formatar preço antes do envio
document.addEventListener('DOMContentLoaded', function() {
    const formProduto = document.querySelector('#produto-update');
    if (formProduto) {
        formProduto.addEventListener('submit', function(e) {
            const precoInput = this.querySelector('[name="preco"]');
            if (precoInput) {
                precoInput.value = formatarPrecoParaEnvio(precoInput.value);
            }
        });
    }
});
