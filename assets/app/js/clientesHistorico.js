$(document).ready(function() {
  $(document).off("click").on("click",".historico", function() {
    $("#myModal").css("display", "block");
    $('body').addClass('modal-open');

    const $this = $(this);
    const idCliente = $this.attr("idC");
    console.log(idCliente);

    const tbody = $("#historicoSaidas");
    tbody.empty();
    $("#nomeCliente").empty();

    $.ajax({
      type: "POST",
      url: "historico-cliente",
      data: `idCliente=${idCliente}`,
      dataType: "json",
      success:  function (response) {
        $("#nomeCliente").text(response['nomeCliente']);
        
      
        if( typeof response['historico'] === 'string' || response['historico'] instanceof String){
          exibirMensagemTemporaria(response['historico']);
          return;
        }

        $(response['historico']).each(function(index, element) {
          console.log(element);
          const tr = `<tr>
          <td>${element.nomeCategoria}</td>
          <td>${element.nomeProduto}</td>
          <td>${element.quantidade}</td>
          <td>${element.created_at}</td>
          </tr>`;

          tbody.append(tr);
        })
      }, error: function(response){
        console.log(response.responseText);
      }
    });
  });

  $(".fecharModal").click(function() {
    $("#myModal").css("display", "none");
    $("body").removeClass("modal-open");
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
  
  // Exemplo de uso:  
  
  
  

  // exibirMensagemTemporaria("ola");
});
