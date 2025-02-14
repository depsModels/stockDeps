// Cadastro de produtos
const form_pc = $("#produto-cadastro");

form_pc.on("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form_pc[0]);

    $.ajax({
        type: "POST",
        url: `${window.location.origin + '/app'}/estoque-pc`,
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
        url: `${window.location.origin + '/app'}/estoque-cc`,
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

    // Criar FormData para enviar os dados
    const formData = new FormData(this);
    
    // Garantir que o ID do fornecedor seja incluído
    const idFornecedor = document.querySelector('#idFornecedor')?.value;
    if (idFornecedor) {
        formData.append('idFornecedores', idFornecedor); // Mudado para idFornecedores para match com o backend
        
        // Adicionar o nome do fornecedor como 'nome'
        const fornecedorNome = document.querySelector('#entradaFornecedor')?.value;
        if (fornecedorNome) {
            formData.append('nome', fornecedorNome);
        }
    }

    // Log para debug
    const formDataObj = {};
    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });
    console.log('Dados da entrada sendo enviados:', formDataObj);

    $.ajax({
        type: "POST",
        url: `${window.location.origin + '/app'}/estoque-ec`,
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            console.log('Resposta recebida:', response);
            
            try {
                // Se a resposta for string, tentar fazer parse
                if (typeof response === 'string') {
                    response = JSON.parse(response);
                }

                if (response.type === 'error') {
                    exibirMensagemTemporariaErro(response.message || "Erro ao processar a entrada.");
                    return;
                }
                if (response.type === 'warning') {
                    exibirMensagemTemporariaAviso(response.message || "Atenção ao processar a entrada.");
                    return;
                }
                if (response.type === 'success') {
                    // Fechar o modal de cadastro
                    const modalCadastro = bootstrap.Modal.getInstance(document.getElementById('modalCadastrarEntrada'));
                    if (modalCadastro) {
                        modalCadastro.hide();
                    }

                    // Limpar campos
                    limparCamposFormulario("#entrada-cadastro");
                    
                    // Atualizar dados
                    fetchEntradas().then(() => {
                        entradasFiltradas = [...entradas];
                        mostrarPaginaEntradas(1);
                    });
                    
                    fetchProdutos().then(() => {
                        produtos = response.produtos;
                        produtosFiltrados = [...produtos];
                        mostrarPagina(1);
                    });

                    exibirMensagemTemporariaSucesso(response.message || "Entrada cadastrada com sucesso!");
                }
            } catch (e) {
                console.error('Erro ao processar resposta:', e);
                exibirMensagemTemporariaErro("Erro ao processar a resposta do servidor.");
            }
        },
        error: function (xhr, status, error) {
            console.error("Erro no AJAX:", error);
            console.error("Status:", status);
            console.error("Resposta do servidor:", xhr.responseText);
            
            let mensagemErro = "Erro ao processar a entrada.";
            
            try {
                if (xhr.responseText) {
                    const response = JSON.parse(xhr.responseText);
                    mensagemErro = response.message || mensagemErro;
                }
            } catch (e) {
                console.error('Erro ao processar mensagem de erro:', e);
            }
            
            exibirMensagemTemporariaErro(mensagemErro);
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
        url: `${window.location.origin + '/app'}/estoque-sc`,
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
                // Fechar o modal de cadastro
                const modalCadastro = bootstrap.Modal.getInstance(document.getElementById('modalCadastrarSaida'));
                if (modalCadastro) {
                    modalCadastro.hide();
                }
                
                // Limpa os campos do formulário
                limparCamposFormulario("#saida-cadastro");
                
                // Atualiza os dados usando o mesmo padrão do delete
                fetchSaidas().then(() => {
                    // Após buscar as saídas, atualiza a exibição
                    saidasFiltradas = [...saidas];
                    mostrarPaginaSaidas(1);
                });
                
                // Atualiza produtos
                fetchProdutos().then(() => {
                    // Após buscar os produtos, atualiza a exibição
                    produtosFiltrados = [...produtos];
                    produtosOrdenados = [...produtos];
                    mostrarPagina(1);
                });
                
                // Exibe mensagem de sucesso
                exibirMensagemTemporariaSucesso(response.message);
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
        url: `${window.location.origin + '/app'}/cadastro-clientes`,
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
        url: `${window.location.origin + '/app'}/cadastro-fornecedores`,
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
