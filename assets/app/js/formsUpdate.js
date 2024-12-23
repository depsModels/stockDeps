function handleEditFormSubmission(formSelector, url, callback) {
    const form = $(formSelector);
    form.on("submit", function (e) {
        e.preventDefault();

        const serializedData = form.serialize();

        $.ajax({
            type: "POST",
            url: url,
            data: serializedData,
            dataType: "json",
            success: function (response) {
                if (response.type === 'error') {
                    exibirMensagemTemporariaErro(response.message);
                    return;
                }

                if (response.type === 'success') {
                    exibirMensagemTemporariaSucesso(response.message);
                    if (callback) callback(response);
                }
            },
            error: function (xhr, status, error) {
                console.error("Erro no AJAX:", error);
                exibirMensagemTemporariaErro("Erro ao processar a solicitação.");
            }
        });
    });
}

// Atualiza produtos, entradas, e saídas dinamicamente
function atualizarDadosGlobais(response) {
    // Atualiza produtos se houver dados de produtos na resposta
    if (response.produtos) {
        produtos = response.produtos;
        produtosFiltrados = [...produtos];
        produtosOrdenados = [...produtos];
        mostrarPagina(1);  // Atualiza a página de produtos
    }

    // Atualiza entradas se houver dados de entradas na resposta
    if (response.entradas) {
        entradas = response.entradas;
        entradasFiltradas = [...entradas];
        mostrarPaginaEntradas(1);  // Atualiza a página de entradas
        fetchProdutos();  // Atualiza a página de produtos novamente (caso precise)
    }

    // Atualiza saídas se houver dados de saídas na resposta
    if (response.saidas) {
        saidas = response.saidas;
        saidasFiltradas = [...saidas];
        mostrarPaginaSaidas(1);  // Atualiza a página de saídas
        fetchProdutos();  // Atualiza a página de produtos novamente (caso precise)
    }
}

// Registra formulários para edição
handleEditFormSubmission("#produto-update", `${BASE_URL}/estoque-pu`, atualizarDadosGlobais);
handleEditFormSubmission("#entrada-editar", `${BASE_URL}/estoque-eu`, atualizarDadosGlobais);
handleEditFormSubmission("#saida-editar", `${BASE_URL}/estoque-su`, atualizarDadosGlobais);
handleEditFormSubmission("#categoria-editar", `${BASE_URL}/estoque-cu`, fetchCategorias);
handleEditFormSubmission("#cliente-update", `${BASE_URL}/update-clientes`, fetchClientes);
handleEditFormSubmission("#formEditarFornecedor", `${BASE_URL}/update-fornecedores`, fetchFornecedores);
