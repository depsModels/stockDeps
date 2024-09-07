const modal = document.getElementById('modal');
const modalEntradas = document.getElementById('modal-entradas');
const modalSaidas = document.getElementById('modal-saidas');

const botoesEditar = document.getElementsByClassName('botao-editar');
const botoesEditarEntradas = document.getElementsByClassName('botao-editar-entradas');
const botoesEditarSaidas = document.getElementsByClassName('botao-editar-saidas');

const botaoCancelar = document.getElementById('cancel-button');
const botaoCancelarEntradas = document.getElementById('cancel-button-entradas');
const botaoCancelarSaidas = document.getElementById('cancel-button-saidas');

const entradasBarraLateral = document.getElementById('barralateral-entradas');
const SaidasBarraLateral = document.getElementById('barralateral-saidas');


botaoCancelar.addEventListener('click', function () {
  modal.style.display = "none";
})

botaoCancelarEntradas.addEventListener('click', function () {
  modalEntradas.style.display = "none";
})

botaoCancelarSaidas.addEventListener('click', function () {
  modalSaidas.style.display = "none";
})

botaoFiltrar.addEventListener('click', function () {
  // Adicione o evento de clique nos botões de edição
  for (let i = 0; i < botoesEditar.length; i++) {
    botoesEditar[i].addEventListener('click', function () {
      // Recupere as informações do produto do botão
      const nome = this.dataset.nome;
      const preco = parseFloat(this.dataset.preco.replace(",", ".")).toFixed(2);
      const quantidade = parseInt(this.dataset.quantidade);
      const descricao = this.dataset.descricao;
      // Defina os valores dos campos de entrada do modal
      document.getElementById('nome').value = nome;
      document.getElementById('preco').value = preco.toString().replace(",", "."); // Formatar e substituir ponto por vírgula
      document.getElementById('quantidade').value = quantidade;
      document.getElementById('descricao-produto-modal').value = descricao;

      // Exiba o modal
      modal.style.display = "flex";
    });
  }

})

// Event listener para abrir o modal
entradasBarraLateral.addEventListener("click", function () {
  for (let i = 0; i < botoesEditarEntradas.length; i++) {
    botoesEditarEntradas[i].addEventListener('click', function () {
      const nomeEntradas = this.dataset.nome;
      const quantidadeEntradas = parseInt(this.dataset.quantidade);
      document.getElementById('nome-entradas').value = nomeEntradas;
      document.getElementById('quantidade-entradas').value = quantidadeEntradas;
 
      document.getElementById('nome-entradas').setAttribute('disabled', 'disabled');
      modalEntradas.style.display = "flex";
      modalEntradas.style.justifyContent = "center";
      modalEntradas.classList.add("modal-align");
    });
    
  }
});




  SaidasBarraLateral.addEventListener("click", function () {
 
  for (let i = 0; i < botoesEditarSaidas.length; i++) {
    botoesEditarSaidas[i].addEventListener('click', function () {
    
      const nomeSaidas= this.dataset.nome;
      const clienteSaidas = this.dataset.cliente;
      const quantidadeSaidas = parseInt(this.dataset.quantidade);
      
      document.getElementById('nome-saidas').value = nomeSaidas;
      document.getElementById('cliente-saidas').value = clienteSaidas;
      document.getElementById('quantidade-saidas').value = quantidadeSaidas;
      
      document.getElementById('nome-saidas').setAttribute('disabled', 'disabled');
      document.getElementById('cliente-saidas').setAttribute('disabled', 'disabled');

      modalSaidas.style.display = "flex";
      modalSaidas.style.justifyContent = "center";
      modalSaidas.classList.add("teste");

    });
   
  }
});