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

            if (response.type == 'error') {
                console.log(response);
                exibirMensagemTemporariaErro(response.message);
                return;
            }

            if (response.type == 'warning') {
                console.log(response);
                exibirMensagemTemporariaAviso(response.message);
                return;
            }

            if (response.type == 'success') {
                console.log(response);
                exibirMensagemTemporariaSucesso(response.message);
                preencherTabelaProdutos(response.produtos);
                produtos = response.produtos;
                mostrarPagina(paginaAtual);
                return;
            }

        }
    });
});

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

            if (response.type == 'error') {
                console.log(response);
                exibirMensagemTemporariaErro(response.message);
                return;
            }

            if (response.type == 'warning') {
                console.log(response);
                exibirMensagemTemporariaAviso(response.message);
                return;
            }

            if (response.type == 'success') {
                console.log(response);
                exibirMensagemTemporariaSucesso(response.message);
                preencherCategorias(response.categorias);
                return;
            }

        }
    });
});

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

            if (response.type == 'error') {
                console.log(response);
                exibirMensagemTemporariaErro(response.message);
                return;
            }

            if (response.type == 'warning') {
                console.log(response);
                exibirMensagemTemporariaAviso(response.message);
                return;
            }

            if (response.type == 'success') {
                console.log(response);
                exibirMensagemTemporariaSucesso(response.message);
                preencherTabelaEntradas(response.entradas, response.produtos);
                preencherTabelaProdutos(response.produtos);
                produtos = response.produtos;
                mostrarPagina(paginaAtual);
                return;
            }

        }
    });
});

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

            if (response.type == 'error') {
                console.log(response);
                exibirMensagemTemporariaErro(response.message);
                return;
            }

            if (response.type == 'warning') {
                console.log(response);
                exibirMensagemTemporariaAviso(response.message);
                return;
            }

            if (response.type == 'success') {
                console.log(response);
                exibirMensagemTemporariaSucesso(response.message);
                preencherTabelaSaidas(response.saidas, response.produtos);
                preencherTabelaProdutos(response.produtos);
                produtos = response.produtos;
                mostrarPagina(paginaAtual);
                return;
            }

        }
    });
});

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

            if (response.type == 'error') {
                console.log(response);
                exibirMensagemTemporariaErro(response.message);
                return;
            }

            if (response.type == 'warning') {
                console.log(response);
                exibirMensagemTemporariaAviso(response.message);
                return;
            }

            if (response.type == 'success') {
                console.log(response);
                exibirMensagemTemporariaSucesso(response.message);
                clientes = response.clientes;
                mostrarPaginaClientes(paginaAtualClientes);
                return;
            }

        }
    });
});


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

            if (response.type == 'error') {
                console.log(response);
                exibirMensagemTemporariaErro(response.message);
                return;
            }

            if (response.type == 'warning') {
                console.log(response);
                exibirMensagemTemporariaAviso(response.message);
                return;
            }

            if (response.type == 'success') {
                console.log(response);
                exibirMensagemTemporariaSucesso(response.message);
                fornecedores = response.fornecedores;
                mostrarPaginaFornecedores(paginaAtualFornecedores);
                return;
            }

        }
    });
});

const form = document.querySelector('form[action="processarXmlNota"]');
form.removeEventListener('submit', handleFormSubmit); // Remove listener duplicado, se houver
form.addEventListener('submit', handleFormSubmit);    // Adiciona o listener apenas uma vez

function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(this);

    fetch('processarXmlNota', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(result => {
            alert("Nota processada com sucesso!");
            window.location.reload(); // Recarrega a página após o sucesso
        })
        .catch(error => {
            console.error('Erro:', error);
            alert("Ocorreu um erro ao processar a nota.");
        });
}