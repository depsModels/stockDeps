const inputProcurar = document.getElementById('procurar-cliente');

const listaDeClientes = document.getElementById('client-list');

function criaCardsProcurarCliente(event) {
    const textoPesquisado = event.target.value.toLowerCase();
  
    listaDeClientes.innerHTML = '';
  
    clientes.forEach(function(clientes) {
      const nome = clientes.nome.toLowerCase();
  
      if (nome.includes(textoPesquisado)) {
        const card = document.createElement('div');
        card.classList.add('clientes-card');
        card.innerHTML = `
          <a href="" class="link-clientes">
            <h6>${clientes.nome}</h6>
          </a>
        `;
        listaDeClientes.appendChild(card);
      }
    });
  
    if (textoPesquisado == "") {
      listaDeClientes.style.display = 'none';
    } else {
      listaDeClientes.style.display = "d-flex";
      listaDeClientes.style.display = "flex-column";
    }
  }
  
  inputProcurar.addEventListener('keyup', criaCardsProcurarCliente);
  inputProcurar.addEventListener('change', criaCardsProcurarCliente);