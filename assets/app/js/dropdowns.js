const selectCategoriasEntradas = document.getElementById("dropdown-categorias-entradas");
const selectCategoriasSaidas = document.getElementById("dropdown-categorias-saidas");
const selectCategoriasSaldo = document.getElementById("dropdown-categorias-saldo");
const selectCategoriaProdutos = document.getElementById("dropdown-categorias-produtos");

const selectItensEntradas = document.getElementById('dropdown-itens-entradas');
const selectItensSaidas = document.getElementById('dropdown-itens-saidas');

const inputEscolheCliente = document.getElementById('procurar-cliente-saidas');


const listaDeClientesSaidas = document.getElementById('client-list-saidas');
const botaoClientesSaidas = document.getElementsByClassName('link-clientes-saidas');

//funçãao qque adiciona as categorias nos selects
function adicionaCategoriasDropdown(categorias) {
  let options = "";
  for (let i = 0; i < categorias.length; i++) {
    options += `
      <option value="${parseInt(categorias[i].id, 10)}"> ${categorias[i].nome}</option>
    `;
  }
  return options;
}

function adicionaItensDropdown(categoriaSelecionada) {
  let produtosFiltrados = [];
  let idCategorias;

  if (categoriaSelecionada == 10) {
    idCategorias = 10;
  } else if (categoriaSelecionada == 20) {
    idCategorias = 20;
  } else if (categoriaSelecionada == 30) {
    idCategorias = 30;
  } else if (categoriaSelecionada == 40) {
    idCategorias = 40;
  }else if (categoriaSelecionada == 50) {
    idCategorias = 50;
  }
//teste
  produtosFiltrados = produtos.filter(produto => produto.idCategoria === idCategorias);
  let options = "";
  for (let i = 0; i < produtosFiltrados.length; i++) {
    options += `
        <option value="${produtosFiltrados[i].id}"> ${produtosFiltrados[i].nome}</option>
      `;
  }
  return options;
}

document.addEventListener("DOMContentLoaded", function () {
    selectCategoriasEntradas.insertAdjacentHTML('beforeend', adicionaCategoriasDropdown(categorias));
    selectCategoriasSaidas.insertAdjacentHTML('beforeend', adicionaCategoriasDropdown(categorias));
    selectCategoriasSaldo.insertAdjacentHTML('beforeend', adicionaCategoriasDropdown(categorias));
    selectCategoriaProdutos.insertAdjacentHTML('beforeend', adicionaCategoriasDropdown(categorias));
});


  selectCategoriasEntradas.addEventListener("change", function() {
    const categoriaSelecionada = selectCategoriasEntradas.value;
    
      selectItensEntradas.innerHTML = ""; // Limpa os options anteriores
      selectItensEntradas.insertAdjacentHTML('beforeend', adicionaItensDropdown(categoriaSelecionada)); // Adiciona os novos options
  })
  
  selectCategoriasSaidas.addEventListener("change", function() {
    const categoriaSelecionada = selectCategoriasSaidas.value;
    
      selectItensSaidas.innerHTML = ""; // Limpa os options anteriores
      selectItensSaidas.insertAdjacentHTML('beforeend', adicionaItensDropdown(categoriaSelecionada)); // Adiciona os novos options
  })


  function criaCardsEscolheCliente(event) {
    const textoPesquisado = event.target.value.toLowerCase();
    listaDeClientesSaidas.innerHTML = '';
  
    clientes.forEach(function(clientes) {
      const nome = clientes.nome.toLowerCase();
  
      if (nome.includes(textoPesquisado)) {
        const card = document.createElement('div');
        card.classList.add('clientes-card-saidas');
        card.innerHTML = `
          <a data-nome='${clientes.nome}' class="link-clientes-saidas">
            <h6>${clientes.nome}</h6>
          </a>
        `;
        listaDeClientesSaidas.appendChild(card);
  
        // adiciona evento de clique ao botão
        const botaoClienteSaida = card.querySelector('.link-clientes-saidas');
        botaoClienteSaida.addEventListener('click', function () {
          inputEscolheCliente.value = botaoClienteSaida.dataset.nome;
        });
      }
    });
  
    if (textoPesquisado == "") {
      listaDeClientesSaidas.style.display = 'none';
    } else {
      listaDeClientesSaidas.style.display = "block";
    }  
    
    document.addEventListener('click', (event) => {
    // Verificar se o clique ocorreu dentro ou fora da div
      if (!listaDeClientesSaidas.contains(event.target)) {
        // Remover a div da página
        listaDeClientesSaidas.style.display = 'none' ;
      }else{
        listaDeClientesSaidas.style.display = 'block';
      }

  });
  }
  
 

  inputEscolheCliente.addEventListener('keyup', criaCardsEscolheCliente);
  inputEscolheCliente.addEventListener('change', criaCardsEscolheCliente);
