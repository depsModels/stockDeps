/* exibirMensagemTemporariaErro: EXIBE UMA MENSAGEM DE ERRO TEMPORARIA NA 
                                 TELA DO USUARIO */
function exibirMensagemTemporariaErro(mensagem) {
    // Cria o elemento da mensagem
    const elementoMensagem = $('<div>')
        .css({
            position: 'fixed',
            top: '25%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgb(220, 53, 69)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
            zIndex: '9999', // Adiciona o z-index desejado
            display: 'none' // Inicia oculto
        })
        .text(mensagem);

    // Adiciona o elemento à página
    $('body').append(elementoMensagem);

    // Animação de aparecimento suave
    elementoMensagem.fadeIn(400);

    // Define um temporizador para remover o elemento após 15 segundos
    setTimeout(() => {
        elementoMensagem.fadeOut(400, () => {
            elementoMensagem.remove();
        });
    }, 2500);
}

/* exibirMensagemTemporariaErro: EXIBE UMA MENSAGEM DE AVISO TEMPORARIA NA 
                                 TELA DO USUARIO */

function exibirMensagemTemporariaAviso(mensagem) {
    // Cria o elemento da mensagem
    const elementoMensagem = $('<div>')
        .css({
            position: 'fixed',
            top: '25%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgb(255, 193, 7)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
            zIndex: '9999', // Adiciona o z-index desejado
            display: 'none' // Inicia oculto
        })
        .text(mensagem);

    // Adiciona o elemento à página
    $('body').append(elementoMensagem);

    // Animação de aparecimento suave
    elementoMensagem.fadeIn(400);

    // Define um temporizador para remover o elemento após 15 segundos
    setTimeout(() => {
        elementoMensagem.fadeOut(400, () => {
            elementoMensagem.remove();
        });
    }, 2500);
}

/* exibirMensagemTemporariaSucesso: EXIBE UMA MENSAGEM DE SUCESSO TEMPORARIA NA 
                                    TELA DO USUARIO */

function exibirMensagemTemporariaSucesso(mensagem) {
    // Cria o elemento da mensagem
    const elementoMensagem = $('<div>')
        .css({
            position: 'fixed',
            top: '25%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgb(25, 135, 84)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
            zIndex: '9999', // Adiciona o z-index desejado
            display: 'none' // Inicia oculto
        })
        .text(mensagem);

    // Adiciona o elemento à página
    $('body').append(elementoMensagem);

    // Animação de aparecimento suave
    elementoMensagem.fadeIn(400);

    // Define um temporizador para remover o elemento após 15 segundos
    setTimeout(() => {
        elementoMensagem.fadeOut(400, () => {
            elementoMensagem.remove();
        });
    }, 2500);
}

/* verifyInputs: PERCORRE O FORM DADO, E RETORNA FALSE SE EXISTIR ALGUM INPUT VAZIO, 
                 CASO CONTRARIO DEVOLVE TRUE */

function verifyInputs(form) {
    let areInputsFilled = true;

    // Percorre todos os elementos de input, select e textarea do formulário
    $(form).find('input, select, textarea').each(function () {
        const value = $(this).val() ? $(this).val().trim() : '';
        const isDisabled = $(this).is(':disabled');

        // Verifica se o elemento está vazio ou desabilitado
        if ((value === '' || value === null) && !isDisabled) {
            areInputsFilled = false;
            return false; // Interrompe o loop
        }
    });

    return areInputsFilled;
}

function formatarPreco(input) {

    let valor = input.value.replace(/\D/g, "");

    valor = valor.replace(/^0+/, "") || "0";

    valor = valor.substring(0, 11);

    const centavos = valor.slice(-2).padStart(2, "0");
    const inteiros = valor.slice(0, -2);

    const inteirosFormatados = inteiros
        .split("")
        .reverse()
        .reduce((acc, num, i) => {
            return num + (i && i % 3 === 0 ? "." : "") + acc;
        }, "");

    input.value = `R$ ${inteirosFormatados || "0"},${centavos}`;
}

