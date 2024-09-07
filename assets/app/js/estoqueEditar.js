$(document).ready(function (){
  const btnEditarRegistros = $(".btnEditarRegistro");

  btnEditarRegistros.off("click").on("click", function (e) {
    const nomeItem = $($(this).parent().parent().children()[0]).text();
    const idItem = $($(this).parent().parent()).attr("idr");
    const idProduto = $($(this).parent().parent()).attr("idp");

    const nomeTabela = $('input[name="checks"]:checked + label:first').text().trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const saveButton = $(".save-button");

    saveButton.off("click").on("click", function(e) {
      e.preventDefault();
      const idForm = $(this).parent().parent().parent().attr("id");

      const quantidade = $(`#${idForm} input[name="quantidade"]`).val();


      const dataAjax = {
        table: nomeTabela,
        id: idItem,
        idProduto,
        quantidade
      }
  
      const params = $.param(dataAjax);

      $.ajax({
        type: "POST",
        url: "estoque-atualizar",
        data: params,
        dataType: 'json',
        success: function (response) {
          console.log(response);
          if(!response['error'] && response.type != 'error'){
            location.reload(true);
          } else {
            exibirMensagemTemporaria(response['error']);
          }
        },
        error: function(response){
          console.log(response);
        }
      });
    });
  })

  function exibirMensagemTemporaria(mensagem) {
    // Cria o elemento da mensagem
    const elementoMensagem = $('<div>')
      .css({
        position: 'absolute',
        top: '25%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#FF4C4C',
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
})

