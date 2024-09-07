const lavaRoupasQtd = document.getElementById('lava-roupas-qtd');
const lavaLoucasQtd = document.getElementById('lava-loucas-qtd');
const lavaCarrosQtd = document.getElementById('lava-carros-qtd');
const limpezaAmbienteQtd = document.getElementById('limpeza-ambiente-qtd');
const outrosQtd = document.getElementById('outros-qtd');

const totalProdutos = document.getElementById('total-produtos-qtd');

const qtdClientes = document.getElementById('qtd-clientes');
const qtdVendas = document.getElementById('qtd-vendas');
const rankingCategorias = document.getElementById('ranking-categorias'); 

function adicionaQtdProdutos(produtos) {
  if (produtos) {
    lavaRoupasQtd.innerHTML = "Lava roupas: " + produtos.filter(produto => produto.idCategoria === 10).length;
    lavaLoucasQtd.innerHTML = "Lava louças: " + produtos.filter(produto => produto.idCategoria === 20).length;
    lavaCarrosQtd.innerHTML = "Lava carros: " + produtos.filter(produto => produto.idCategoria === 30).length;
    limpezaAmbienteQtd.innerHTML = "Limpeza ambiente: " + produtos.filter(produto => produto.idCategoria === 40).length;
    outrosQtd.innerHTML = "Outros: " + produtos.filter(produto => produto.idCategoria === 50).length;
    totalProdutos.innerHTML = "Total: " + produtos.length
  }
}

var categoriasComprimento = [];


function adicionarRankingCategorias(saidas) {
  const lavaRoupas = saidas.idCategoria === 10 ? saidas.idCategoria : null;
  const lavaLoucas = saidas.idCategoria === 20 ? saidas.idCategoria : null;
  const lavaCarros = saidas.idCategoria === 30 ? saidas.idCategoria : null;
  const limpezaAmbiente = saidas.idCategoria === 40 ? saidas.idCategoria : null;
  const outros = saidas.idCategoria === 50 ? saidas.idCategoria : null;

  const categoriasComprimento = []; // Array para armazenar as categorias e seus comprimentos

  if (saidas) {

      const categoriaLavaRoupas = { nome: "Lava roupas", length: saidas.filter(saida => saida.idCategoria === 10).length };
      categoriasComprimento.push(categoriaLavaRoupas);
 
    

      const categoriaLavaLoucas = { nome: "Lava louças", length: saidas.filter(saida => saida.idCategoria === 20).length };
      categoriasComprimento.push(categoriaLavaLoucas);

    

      const categoriaLavaCarros = { nome: "Lava carros", length: saidas.filter(saida => saida.idCategoria === 30).length };
      categoriasComprimento.push(categoriaLavaCarros);

    

      const categoriaLimpezaAmbiente = { nome: "Limpeza ambiente", length: saidas.filter(saida => saida.idCategoria === 40).length };
      categoriasComprimento.push(categoriaLimpezaAmbiente);

    
 
      const categoriaOutros = { nome: "Outros", length: saidas.filter(saida => saida.idCategoria === 50).length };
      categoriasComprimento.push(categoriaOutros);
 
  }
  console.log(categoriasComprimento)
  categoriasComprimento.sort((a, b) => b.length - a.length);
  if (categoriasComprimento.length > 0) {
    const maiorCategoria = categoriasComprimento[0].nome;
    const segundaMaior = categoriasComprimento[1].nome;
    const terceiraMaior = categoriasComprimento[2].nome;
    rankingCategorias.innerHTML = "1° - " + maiorCategoria + "<br>"+
                                  "2° - " + segundaMaior + "<br>"+
                                  "3° - " + terceiraMaior + "<br>" 
                                  
  } else {
    console.log("Não há categorias disponíveis.");
  }
}



function contaClientes(clientes) {
  if (clientes) {
    qtdClientes.innerHTML = clientes.length;
  }
}

function contaVendas(saidas) {
  if (saidas) {
    qtdVendas.innerHTML = saidas.length;
  }
}

adicionarRankingCategorias(saidas)
adicionaQtdProdutos(produtos)
contaClientes(clientes)
contaVendas(saidas)