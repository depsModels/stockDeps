$(document).ready(function (){
  const btnDeletar = $(".botao-deletar");

  btnDeletar.off("click").on("click", function(e){
    $('body').addClass('modal-open');
    $("#myModal").css("display", "flex");
    const nomeItem = $($(this).parent().parent().children()[0]).text();
    const idItem = $($(this).parent().parent()).attr("idr");
    $(".itemExcluir").text(nomeItem);

    //fiz esse esquema pra poder passar o nome da tabela sem ter que atribuir a um type hidden
    const primeiroLabel = $('input[name="checks"] + label:first').text().trim().toLowerCase();
    const nomeTabela = $('input[name="checks"]:checked + label:first').text().trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    console.log(idItem)
    const dataAjax = {
      table: nomeTabela,
      id: idItem
    }

    const params = $.param(dataAjax);
    
    $("#confirmarExcluir").off("click").on("click", function(){
      console.log(params)
      $.ajax({
        type: "POST",
        url: "estoque-deletar",
        data: params,
        dataType: "json",
        success: function (response) {
          if(!response['error'] && response.type != 'error'){
            location.reload(true);
          } else {
            exibirMensagemTemporaria(response['error']);
          }
        }, 
        error: function (response){
          console.log(response)
        }
      });
    })


  })

  $(".close, .cancelarExcluir").click(function() {
      $("#myModal").css("display", "none");
  });
  
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