// Exclusão de Produtos
const form_produto_excluir = $("#produto-excluir");
form_produto_excluir.on("submit", function (e) {
    e.preventDefault();

    const serializedData = form_produto_excluir.serialize();

    $.ajax({
        type: "POST",
        url: `${window.location.origin + '/app'}/estoque-pd`,
        data: serializedData,
        dataType: "json",
        success: function (response) {
            if (response.type === 'error') {
                exibirMensagemTemporariaErro(response.message);
                return;
            }
            if (response.type === 'success') {
                exibirMensagemTemporariaSucesso(response.message);

                // Fecha o modal de exclusão
                $('#modalExcluir').modal('hide');  // Fecha o modal de produto

                // Recarrega os produtos dinamicamente
                fetchProdutos();
            }
        },
        error: function (xhr, status, error) {
            console.error("Erro no AJAX:", error);
            exibirMensagemTemporariaErro("Erro ao processar a solicitação.");
        }
    });
});

// Exclusão de Categorias
const form_categoria_excluir = $("#categoria-excluir");
form_categoria_excluir.on("submit", function (e) {
    e.preventDefault();

    const serializedData = form_categoria_excluir.serialize();

    $.ajax({
        type: "POST",
        url: `${window.location.origin + '/app'}/estoque-cd`,
        data: serializedData,
        dataType: "json",
        success: function (response) {
            if (response.type === 'error') {
                exibirMensagemTemporariaErro(response.message);
                return;
            }
            if (response.type === 'success') {
                exibirMensagemTemporariaSucesso(response.message);

                // Fecha o modal de exclusão
                $('#modalExcluirCategoria').modal('hide');  // Fecha o modal de categoria

                // Recarrega as categorias dinamicamente
                fetchCategorias();
                fetchProdutos(); // Atualiza produtos relacionados às categorias
            }
        },
        error: function (xhr, status, error) {
            console.error("Erro no AJAX:", error);
            exibirMensagemTemporariaErro("Erro ao processar a solicitação.");
        }
    });
});

// Exclusão de Entradas
const form_entrada_excluir = $("#entrada-excluir");
form_entrada_excluir.on("submit", function (e) {
    e.preventDefault();

    const serializedData = form_entrada_excluir.serialize();

    $.ajax({
        type: "POST",
        url: `${window.location.origin + '/app'}/estoque-ed`,
        data: serializedData,
        dataType: "json",
        success: function (response) {
            if (response.type === 'error') {
                exibirMensagemTemporariaErro(response.message);
                return;
            }
            if (response.type === 'success') {
                exibirMensagemTemporariaSucesso(response.message);

                // Fecha o modal de exclusão
                $('#modalExcluirEntrada').modal('hide');  // Fecha o modal de entrada

                // Recarrega entradas e produtos dinamicamente
                fetchEntradas();
                fetchProdutos();
            }
        },
        error: function (xhr, status, error) {
            console.error("Erro no AJAX:", error);
            exibirMensagemTemporariaErro("Erro ao processar a solicitação.");
        }
    });
});

// Exclusão de Saídas
const form_saida_excluir = $("#saida-excluir");
form_saida_excluir.on("submit", function (e) {
    e.preventDefault();

    const serializedData = form_saida_excluir.serialize();

    $.ajax({
        type: "POST",
        url: `${window.location.origin + '/app'}/estoque-sd`,
        data: serializedData,
        dataType: "json",
        success: function (response) {
            if (response.type === 'error') {
                exibirMensagemTemporariaErro(response.message);
                return;
            }
            if (response.type === 'success') {
                exibirMensagemTemporariaSucesso(response.message);

                // Fecha o modal de exclusão
                $('#modalExcluirSaida').modal('hide');  // Fecha o modal de saída

                // Recarrega saídas e produtos dinamicamente
                fetchSaidas();
                fetchProdutos();
            }
        },
        error: function (xhr, status, error) {
            console.error("Erro no AJAX:", error);
            exibirMensagemTemporariaErro("Erro ao processar a solicitação.");
        }
    });
});

// Exclusão de Clientes
const form_cliente_excluir = $("#cliente-excluir");
form_cliente_excluir.on("submit", function (e) {
    e.preventDefault();

    const serializedData = form_cliente_excluir.serialize();

    $.ajax({
        type: "POST",
        url: `${window.location.origin + '/app'}/deletar-clientes`,
        data: serializedData,
        dataType: "json",
        success: function (response) {
            if (response.type === 'error') {
                exibirMensagemTemporariaErro(response.message);
                return;
            }
            if (response.type === 'success') {
                exibirMensagemTemporariaSucesso(response.message);

                // Fecha o modal de exclusão
                $('#modalExcluir').modal('hide');  // Fecha o modal de cliente

                // Recarrega os clientes dinamicamente
                fetchClientes();
            }
        },
        error: function (xhr, status, error) {
            console.error("Erro no AJAX:", error);
            exibirMensagemTemporariaErro("Erro ao processar a solicitação.");
        }
    });
});

// Exclusão de Fornecedores
const form_fornecedor_excluir = $("#fornecedor-excluir");
form_fornecedor_excluir.on("submit", function (e) {
    e.preventDefault();

    const serializedData = form_fornecedor_excluir.serialize();

    $.ajax({
        type: "POST",
        url: `${window.location.origin + '/app'}/deletar-fornecedores`,
        data: serializedData,
        dataType: "json",
        success: function (response) {
            if (response.type === 'error') {
                exibirMensagemTemporariaErro(response.message);
                return;
            }
            if (response.type === 'success') {
                exibirMensagemTemporariaSucesso(response.message);

                // Fecha o modal de exclusão
                $('#modalExcluir').modal('hide');  // Fecha o modal de fornecedor

                // Recarrega os fornecedores dinamicamente
                fetchFornecedores();
            }
        },
        error: function (xhr, status, error) {
            console.error("Erro no AJAX:", error);
            exibirMensagemTemporariaErro("Erro ao processar a solicitação.");
        }
    });
});
