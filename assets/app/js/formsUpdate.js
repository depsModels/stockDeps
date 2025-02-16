// Use BASE_URL from app.js

function handleEditFormSubmission(formSelector, url, callback) {
    const form = $(formSelector);
    form.off("submit").on("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const modalElement = $(this).closest('.modal')[0];
        const modal = modalElement ? bootstrap.Modal.getInstance(modalElement) : null;

        // Converter FormData para objeto para debug
        const formDataObj = {};
        formData.forEach((value, key) => {
            formDataObj[key] = value;
        });
        console.log('Dados sendo enviados:', formDataObj);

        $.ajax({
            type: "POST",
            url: url,
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
                        exibirMensagemTemporariaErro(response.message || "Erro ao processar a solicitação.");
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
                        exibirMensagemTemporariaSucesso(response.message || "Operação realizada com sucesso!");
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
                
                let mensagemErro = "Erro ao processar a solicitação.";
                
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
handleEditFormSubmission("#produto-update", `${BASE_URL}/estoque-pu`, function(response) {
    if (response.produtos) {
        produtos = response.produtos;
        produtosFiltrados = [...produtos];
        produtosOrdenados = [...produtos];
        mostrarPagina(1);
    }
});
handleEditFormSubmission("#entrada-editar", `${BASE_URL}/estoque-eu`, atualizarDadosGlobais);
handleEditFormSubmission("#saida-editar", `${BASE_URL}/estoque-su`, atualizarDadosGlobais);
handleEditFormSubmission("#categoria-editar", `${BASE_URL}/estoque-cu`, fetchCategorias);
handleEditFormSubmission("#cliente-update", `${BASE_URL}/update-clientes`, fetchClientes);
handleEditFormSubmission("#formEditarFornecedor", `${BASE_URL}/update-fornecedores`, fetchFornecedores);

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
