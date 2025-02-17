// Cadastro de produtos
const form_pc = $("#produto-cadastro");

form_pc.on("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form_pc[0]);

    $.ajax({
        type: "POST",
        url: `${BASE_URL}/estoque-pc`,
        data: formData,
        processData: false,
        contentType: false,
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
                // Limpa os campos do formulário - PASSANDO O SELETOR
                limparCamposFormulario("#produto-cadastro");
                // Recarrega produtos dinamicamente
                fetchProdutos();
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
                exibirMensagemTemporariaSucesso(response.message, form_cc); // Limpa o formulário
                // Limpa os campos do formulário
                limparCamposFormulario("#categoria-cadastro");
                // Recarrega categorias dinamicamente
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
                // Limpa os campos do formulário
                limparCamposFormulario("#entrada-cadastro");
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
                // Limpa apenas os campos específicos
                limparCamposSaida();
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
                // Limpa os campos do formulário
                limparCamposFormulario("#cadastro-clientes");
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
                // Limpa os campos do formulário
                limparCamposFormulario("#formAdicionarFornecedor");
                // Recarrega fornecedores dinamicamente
                fetchFornecedores();
            }
        },
        error: function (xhr, status, error) {
            console.error("Erro no AJAX:", error);
            exibirMensagemTemporariaErro("Erro ao processar a solicitação.");
        }
    });
});

// Cadastro via XML
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
                limparCamposFormulario('form[action="processarXmlNota"]')
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

function limparCamposFormulario(formSelector) {
    // Limpa todos os inputs de texto, email, number, file e textarea
    $(formSelector).find('input[type="text"], input[type="email"], input[type="number"], input[type="file"], textarea').val('');

    // Reseta selects para o valor padrão
    $(formSelector).find('select').prop('selectedIndex', 0);

    // Limpa o campo de preço e define o valor padrão
    $(formSelector).find('input[type="text"].preco').val('R$ 0,00');

    // Campos ocultos (hidden)
    $(formSelector).find('input[type="hidden"]').val('');
}

function limparCamposSaida() {
    const form = $("#saida-cadastro");

    form.find("#cliente").val(''); 
    form.find("#clienteNaoCadastrado").prop('checked', false);
    form.find("#quantidadeSaida").val('');
}

