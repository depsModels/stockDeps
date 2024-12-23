// Cadastro de produtos
const form_pc = $("#produto-cadastro");
form_pc.on("submit", function (e) {
    e.preventDefault();

    const serializedData = form_pc.serialize();

    $.ajax({
        type: "POST",
        url: `${BASE_URL}/estoque-pc`,
        data: serializedData,
        dataType: "json",
        success: function (response) {
            if (response.type === 'error') {
                exibirMensagemTemporariaErro(response.message);
                return;
            }
            if (response.type === 'warning') {
                exibirMensagemTemporariaAviso(response.message);
                return;
            }
            if (response.type === 'success') {
                exibirMensagemTemporariaSucesso(response.message);

                // Recarrega os produtos dinamicamente
                fetchProdutos(); // Recarrega os produtos e atualiza a tabela
            }
        },
        error: function (xhr, status, error) {
            console.error("Erro no AJAX:", error);
            exibirMensagemTemporariaErro("Erro ao processar a solicitação.");
        }
    });
});

// Cadastro de categorias
const form_cc = $("#categoria-cadastro");
form_cc.on("submit", function (e) {
    e.preventDefault();

    const serializedData = form_cc.serialize();

    $.ajax({
        type: "POST",
        url: `${BASE_URL}/estoque-cc`,
        data: serializedData,
        dataType: "json",
        success: function (response) {
            if (response.type === 'error') {
                exibirMensagemTemporariaErro(response.message);
                return;
            }
            if (response.type === 'warning') {
                exibirMensagemTemporariaAviso(response.message);
                return;
            }
            if (response.type === 'success') {
                exibirMensagemTemporariaSucesso(response.message);

                // Recarrega as categorias dinamicamente
                fetchCategorias();
            }
        },
        error: function (xhr, status, error) {
            console.error("Erro no AJAX:", error);
            exibirMensagemTemporariaErro("Erro ao processar a solicitação.");
        }
    });
});

// Cadastro de entradas
const form_ec = $("#entrada-cadastro");
form_ec.on("submit", function (e) {
    e.preventDefault();

    const serializedData = form_ec.serialize();

    $.ajax({
        type: "POST",
        url: `${BASE_URL}/estoque-ec`,
        data: serializedData,
        dataType: "json",
        success: function (response) {
            if (response.type === 'error') {
                exibirMensagemTemporariaErro(response.message);
                return;
            }
            if (response.type === 'warning') {
                exibirMensagemTemporariaAviso(response.message);
                return;
            }
            if (response.type === 'success') {
                exibirMensagemTemporariaSucesso(response.message);

                // Recarrega entradas e produtos
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

// Cadastro de saídas
const form_sc = $("#saida-cadastro");
form_sc.on("submit", function (e) {
    e.preventDefault();

    const serializedData = form_sc.serialize();

    $.ajax({
        type: "POST",
        url: `${BASE_URL}/estoque-sc`,
        data: serializedData,
        dataType: "json",
        success: function (response) {
            if (response.type === 'error') {
                exibirMensagemTemporariaErro(response.message);
                return;
            }
            if (response.type === 'warning') {
                exibirMensagemTemporariaAviso(response.message);
                return;
            }
            if (response.type === 'success') {
                exibirMensagemTemporariaSucesso(response.message);

                // Recarrega saídas e produtos
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

// Cadastro de clientes
const form_cadastro_clientes = $("#cadastro-clientes");
form_cadastro_clientes.on("submit", function (e) {
    e.preventDefault();

    const serializedData = form_cadastro_clientes.serialize();

    $.ajax({
        type: "POST",
        url: `${BASE_URL}/cadastro-clientes`,
        data: serializedData,
        dataType: "json",
        success: function (response) {
            if (response.type === 'error') {
                exibirMensagemTemporariaErro(response.message);
                return;
            }
            if (response.type === 'warning') {
                exibirMensagemTemporariaAviso(response.message);
                return;
            }
            if (response.type === 'success') {
                exibirMensagemTemporariaSucesso(response.message);

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

// Cadastro de fornecedores
const form_cadastro_fornecedores = $("#formAdicionarFornecedor");
form_cadastro_fornecedores.on("submit", function (e) {
    e.preventDefault();

    const serializedData = form_cadastro_fornecedores.serialize();

    $.ajax({
        type: "POST",
        url: `${BASE_URL}/cadastro-fornecedores`,
        data: serializedData,
        dataType: "json",
        success: function (response) {
            if (response.type === 'error') {
                exibirMensagemTemporariaErro(response.message);
                return;
            }
            if (response.type === 'warning') {
                exibirMensagemTemporariaAviso(response.message);
                return;
            }
            if (response.type === 'success') {
                exibirMensagemTemporariaSucesso(response.message);

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


const form = document.querySelector('form[action="processarXmlNota"]');
form.addEventListener('submit', handleFormSubmit);   

function handleFormSubmit(e) {
    e.preventDefault(); // Impede o envio do formulário de forma tradicional
    const formData = new FormData(this); // Captura o conteúdo do formulário

    fetch('processarXmlNota', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())  // Aguarda a resposta JSON
        .then(result => {
            // Verifica se o resultado é de sucesso
            if (result.type === 'success') {
                // Exibe mensagem de sucesso
                exibirMensagemTemporariaSucesso(result.message);
                fetchFornecedores();
                fetchProdutos();    
            } else {
                // Caso haja erro ou warning, exibe a mensagem adequada
                exibirMensagemTemporariaErro(result.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            // Exibe erro genérico
            exibirMensagemTemporariaErro("Ocorreu um erro ao processar a nota.");
        });
}