
function criaCartaoCarrossel(clientes) {
    return `
    <div class="card d-flex flex-column">
        <h3 my-3>${clientes.nome}</h3>
        <p class="info-clientes mt-3"><strong>CPF:</strong> ${clientes.cpf}</p>
        <p class="info-clientes mt-3"><strong>Email:</strong> ${clientes.email}</p>
        <P class="info-clientes mt-3"><strong>Celular:</strong> ${clientes.celular}</P>
        <p class="info-clientes mt-3"><strong>Cidade:</strong> ${clientes.cidade}</p>
        <p class="info-clientes mt-3"><strong>Bairro:</strong> ${clientes.bairro}</p>
        <p class="info-clientes mt-3"><strong>UF:</strong> ${clientes.uf}</p>    
        <button idC='${clientes.id}' class="btn btn-danger  historico mt-2">Histórico</button>
    </div>

    `;
}
function criaCardBloco(clientes) {
    return `
    <div class="card-bloco d-flex flex-column justify-content-center col-9">
        <div class="item-cartao col-md-12"><h3>${clientes.nome}</h3></div> 
        <button class="btn btn-danger center historico m-4" idC='${clientes.id}'> 
            Histórico
        </button> 
        <div class="d-flex flex-wrap">
            <div class="flex-column col-md-4">
                <p class="info-cliente-bloco"><strong>CPF:</strong> ${clientes.cpf}</p>
                <p class="info-cliente-bloco"><strong>Email:</strong> ${clientes.email}</p>
            </div>
            <div class=" flex-column col-md-4">
                <P class="info-cliente-bloco"><strong>Celular:</strong> ${clientes.celular}</P>
                <p class="info-cliente-bloco"><strong>Cidade:</strong> ${clientes.cidade}</p>
            </div>    
            <div class="flex-column col-md-4">
                <p class="info-cliente-bloco"><strong>Bairro:</strong> ${clientes.bairro}</p>
                <p class="info-cliente-bloco"><strong>UF:</strong> ${clientes.uf}</p>
            </div>
        </div>
    </div>

    `;
}

var botaoCarrosel = document.getElementById("checkCarrossel");
var botaoBloco = document.getElementById("checkBloco");

var divCarrossel = document.getElementById("carousel");
var divBloco = document.getElementsByClassName("bloco")[0];

document.addEventListener("DOMContentLoaded", function () {
    function exibirCarrossel() {
        divCarrossel.style.display = "block";
        divBloco.style.display = "none";
        divBloco.innerHTML = "";


        // Cria os cards do carrossel
        clientes.forEach((cliente) => {
            var cartao = criaCartaoCarrossel(cliente);
            divCarrossel.innerHTML += cartao;
        });

        // Inicializa o carrossel
        $('#carousel').owlCarousel({
            loop: true,
            margin: 10,
            nav: true,
            dots: false,
            responsive: {
                0: {
                    items: 1,
                    nav: true
                },
                600: {
                    items: 3,
                    nav: false
                },
                1000: {
                    items: 5,
                    nav: true,
                    loop: false
                }
            }
        });

    }


    // Exibe o carrossel por padrão
    exibirCarrossel();
})

botaoCarrosel.addEventListener("change", function () {
    if (botaoCarrosel.checked) {
        divCarrossel.style.display = "block";
        divBloco.style.display = "none";
        divBloco.innerHTML = "";
    } else {
        divCarrossel.style.display = "none";
        divBloco.style.display = "block";
    }
});

botaoBloco.addEventListener("change", function () {
    if (botaoBloco.checked) {
        divBloco.style.display = "block";
        divCarrossel.style.display = "none";

        if (divBloco.innerHTML === "") { // adiciona cards somente se a div estiver vazia
            clientes.forEach(function (cliente) {
                divBloco.innerHTML += criaCardBloco(cliente);
            });
        }
    } else {
        divBloco.style.display = "none";
        divCarrossel.style.display = "block";
    }
});


