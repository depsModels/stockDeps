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
        error: handleAjaxError
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
        error: handleAjaxError
    });
});

// Cadastro de entradas
const form_ec = $("#entrada-cadastro");
form_ec.on("submit", function (e) {
    e.preventDefault();

    // Validar campos antes de enviar
    const quantidade = $("#quantidadeEntrada").val();
    const preco = $("#precoEntrada").val().replace(/[^\d,]/g, '').replace(',', '.');
    
    if (!quantidade || quantidade <= 0) {
        exibirMensagemTemporariaErro("Por favor, insira uma quantidade válida.");
        return;
    }

    if (!preco || parseFloat(preco) <= 0) {
        exibirMensagemTemporariaErro("Por favor, insira um preço válido.");
        return;
    }

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
                // Fecha o modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalEntrada'));
                if (modal) {
                    modal.hide();
                }
            }
        },
        error: handleAjaxError
    });
});

// Cadastro de saídas
const form_sc = $("#saida-cadastro");
form_sc.on("submit", function (e) {
    e.preventDefault();

    // Validar campos antes de enviar
    const quantidade = $("#quantidadeSaida").val();
    const preco = $("#precoSaida").val().replace(/[^\d,]/g, '').replace(',', '.');
    
    if (!quantidade || quantidade <= 0) {
        exibirMensagemTemporariaErro("Por favor, insira uma quantidade válida.");
        return;
    }

    if (!preco || parseFloat(preco) <= 0) {
        exibirMensagemTemporariaErro("Por favor, insira um preço válido.");
        return;
    }

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
                // Fecha o modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalSaida'));
                if (modal) {
                    modal.hide();
                }
            }
        },
        error: handleAjaxError
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
        error: handleAjaxError
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
        error: handleAjaxError
    });
});

// Manusear o envio do formulário XML
const formXml = document.getElementById('formXmlUpload');
if (formXml) {
    formXml.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Exibir spinner durante o envio
        const submitButton = this.querySelector('button[type="submit"]');
        const submitText = submitButton.innerHTML;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
        submitButton.disabled = true;
        
        // Obter os dados do formulário
        const formData = new FormData(this);
        
        // Enviar para o servidor
        fetch(`${BASE_URL}/xml-upload`, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.type === 'success') {
                // Exibir mensagem de sucesso
                const successMessage = document.createElement('div');
                successMessage.className = 'alert alert-success mt-3';
                successMessage.textContent = data.message;
                this.appendChild(successMessage);
                
                // Remover mensagem após alguns segundos
                setTimeout(() => {
                    successMessage.remove();
                    location.reload();
                }, 3000);
            } else {
                // Exibir mensagem de erro
                const errorMessage = document.createElement('div');
                errorMessage.className = 'alert alert-danger mt-3';
                errorMessage.textContent = data.message || 'Ocorreu um erro ao processar o XML.';
                this.appendChild(errorMessage);
                
                // Remover mensagem após alguns segundos
                setTimeout(() => {
                    errorMessage.remove();
                }, 5000);
            }
        })
        .catch(error => {
            console.error('Erro ao enviar XML:', error);
            // Exibir mensagem de erro
            const errorMessage = document.createElement('div');
            errorMessage.className = 'alert alert-danger mt-3';
            errorMessage.textContent = 'Erro ao comunicar com o servidor. Tente novamente.';
            this.appendChild(errorMessage);
            
            // Remover mensagem após alguns segundos
            setTimeout(() => {
                errorMessage.remove();
            }, 5000);
        })
        .finally(() => {
            // Restaurar botão
            submitButton.innerHTML = submitText;
            submitButton.disabled = false;
        });
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

// Função auxiliar para tratar erros AJAX
function handleAjaxError(xhr, status, error) {
    console.error("Erro no AJAX:", error);
    
    let errorMessage = "Erro ao processar a solicitação.";
    
    try {
        // Tentar parse do JSON primeiro
        const jsonResponse = JSON.parse(xhr.responseText);
        if (jsonResponse.message) {
            errorMessage = jsonResponse.message;
        }
    } catch (e) {
        // Se não for JSON, pode ser HTML com mensagem de erro do PHP
        if (xhr.responseText.includes("Fatal error") || xhr.responseText.includes("Parse error")) {
            errorMessage = "Erro interno do servidor. Por favor, contate o suporte.";
        }
    }
    
    exibirMensagemTemporariaErro(errorMessage);
}

