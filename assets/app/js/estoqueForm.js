const mensagemNome = document.getElementById('message-nome')
const mensagemPreco = document.getElementById('message-preco')


form.on('submit',function(){
    const inputNomeProduto = document.getElementById('input-nome-produto').value;
    const inputPrecoProduto = document.getElementById('input-preco-produto').value;
    const botaoProduto =    document.getElementById('botao-produtos');
    
    if(inputNomeProduto.length > 35){
        mensagemNome.innerHTML = "O nome do item deve ter menos que 35 letras.";
    }else{
        mensagemNome.innerHTML = " "
    }
    if(inputPrecoProduto <= 0){
        mensagemPreco.innerHTML = "Deve haver um preço."
    }else{
        mensagemPreco.innerHTML = " "
    }
});


