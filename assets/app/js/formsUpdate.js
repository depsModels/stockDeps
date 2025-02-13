// Use BASE_URL from app.js

function handleEditFormSubmission(formSelector, url, callback) {
    const form = $(formSelector);
    form.off("submit").on("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const modalElement = $(this).closest('.modal')[0];
        const modal = modalElement ? bootstrap.Modal.getInstance(modalElement) : null;

        $.ajax({
            type: "POST",
            url: url,
            data: formData,
            processData: false,
            contentType: false,
            dataType: "json",
            success: function (response) {
                if (response.type === 'error') {
                    exibirMensagemTemporariaErro(response.message);
                    return;
                }

                if (response.type === 'success') {
                    if (modal) {
                        modal.hide();
                    }
                    
                    // Fechar também o modal principal se estiver aberto
                    const entradasModal = bootstrap.Modal.getInstance(document.getElementById('entradasModal'));
                    const saidasModal = bootstrap.Modal.getInstance(document.getElementById('saidasModal'));
                    
                    if (entradasModal) entradasModal.hide();
                    if (saidasModal) saidasModal.hide();
                    
                    if (callback) callback(response);
                    exibirMensagemTemporariaSucesso(response.message);
                }
            },
            error: function (xhr, status, error) {
                console.error("Erro no AJAX:", error);
                console.error("Resposta do servidor:", xhr.responseText);
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
handleEditFormSubmission("#produto-update", `${window.BASE_URL}/estoque-pu`, atualizarDadosGlobais);
handleEditFormSubmission("#entrada-editar", `${window.BASE_URL}/estoque-eu`, atualizarDadosGlobais);
handleEditFormSubmission("#saida-editar", `${window.BASE_URL}/estoque-su`, atualizarDadosGlobais);
handleEditFormSubmission("#categoria-editar", `${window.BASE_URL}/estoque-cu`, fetchCategorias);
handleEditFormSubmission("#cliente-update", `${window.BASE_URL}/update-clientes`, fetchClientes);
handleEditFormSubmission("#formEditarFornecedor", `${window.BASE_URL}/update-fornecedores`, fetchFornecedores);
