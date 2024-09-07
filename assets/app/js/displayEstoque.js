var botaoProdutos = document.getElementById("checkProduto");
var botaoSaldo = document.getElementById("checkSaldo");
var botaoEntradas = document.getElementById("checkEntradas");
var botaoSaidas = document.getElementById("checkSaidas");

var divProdutos = document.getElementsByClassName("cadastroProdutos")[0];
var divSaldo = document.getElementsByClassName("saldoProdutos")[0];
var divEntradas = document.getElementsByClassName("entradaProdutos")[0];
var divSaidas = document.getElementsByClassName("saidaProdutos")[0];

botaoProdutos.addEventListener("change", function () {
    if (botaoProdutos.checked) {
        divProdutos.style.display = "block";
        divSaldo.style.display = "none";
        divEntradas.style.display = "none";
        divSaidas.style.display = "none";
        
    } else {
        divProdutos.style.display = "none";
    }
});

botaoSaldo.addEventListener("change", function () {
    if (botaoSaldo.checked) {
        divProdutos.style.display = "none";
        divSaldo.style.display = "block";
        divEntradas.style.display = "none";
        divSaidas.style.display = "none";
    } else {
        divSaldo.style.display = "none";
    }
});

botaoEntradas.addEventListener("change", function () {
    if (botaoEntradas.checked) {
        divProdutos.style.display = "none";
        divSaldo.style.display = "none";
        divEntradas.style.display = "block";
        divSaidas.style.display = "none";
    } else {
        divEntradas.style.display = "none";
    }
});

botaoSaidas.addEventListener("change", function () {
    if (botaoSaidas.checked) {
        divProdutos.style.display = "none";
        divSaldo.style.display = "none";
        divEntradas.style.display = "none";
        divSaidas.style.display = "block";
    } else {
        divSaidas.style.display = "none";
    }
});


