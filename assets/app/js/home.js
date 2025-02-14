// Funções específicas da página inicial

async function fetchProdutos() {
  try {
    const response = await fetch(`${window.location.origin + '/app'}/getProdutos`);
    const data = await response.json();
    produtos = data;
    return data;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
  }
}

async function fetchEntradas() {
  try {
    const response = await fetch(`${window.location.origin + '/app'}/getEntradas`);
    const data = await response.json();
    entradas = data;
    return data;
  } catch (error) {
    console.error('Erro ao buscar entradas:', error);
  }
}

async function fetchSaidas() {
  try {
    const response = await fetch(`${window.location.origin + '/app'}/getSaidas`);
    const data = await response.json();
    saidas = data;
    return data;
  } catch (error) {
    console.error('Erro ao buscar saidas:', error);
  }
}

async function fetchCategorias() {
  try {
    const response = await fetch(`${window.location.origin + '/app'}/getCategorias`);
    const data = await response.json();
    categorias = data;
    return data;
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
  }
}

async function fetchClientes() {
  try {
    const response = await fetch(`${window.location.origin + '/app'}/getClientes`);
    const data = await response.json();
    clientes = data;
    return data;
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
  }
}

async function fetchFornecedores() {
  try {
    const response = await fetch(`${window.location.origin + '/app'}/getFornecedores`);
    const data = await response.json();
    fornecedores = data;
    return data;
  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error);
  }
}

function atualizarProdutos(data) {
  produtos = data || [];
  document.getElementById('total-produtos').textContent = produtos.length || 0;
  document.getElementById('produtos-estoque').textContent = produtos.filter(p => p.quantidade > 0).length;
  document.getElementById('estoque-baixo').textContent = produtos.filter(p => p.quantidade >= 0 && p.quantidade <= 1).length;
  document.getElementById('produtos-sem-estoque').textContent = produtos.filter(p => p.quantidade == 0).length;
}

function atualizarEntradas(data) {
  entradas = data || [];
  document.getElementById('total-entradas').textContent = entradas.length || 0;
}

function atualizarSaidas(data) {
  saidas = data || [];
  document.getElementById('total-saidas').textContent = saidas.length || 0;
}

function atualizarClientes(data) {
  clientes = data || [];
  document.getElementById('total-clientes').textContent = clientes.length || 0;
}

function atualizarFornecedores(data) {
  fornecedores = data || [];
  document.getElementById('total-fornecedores').textContent = fornecedores.length || 0;
}

function atualizarCaixas() {
  atualizarProdutos(produtos);
  atualizarEntradas(entradas);
  atualizarSaidas(saidas);
  atualizarClientes(clientes);
  atualizarFornecedores(fornecedores);
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function atualizarProdutosMaisVendidos() {
  const vendasPorProduto = saidas.reduce((mapa, saida) => {
    if (!mapa[saida.idProdutos]) {
      mapa[saida.idProdutos] = { quantidade: 0, vendas: 0 };
    }
    mapa[saida.idProdutos].quantidade += saida.quantidade;
    mapa[saida.idProdutos].vendas += 1;
    return mapa;
  }, {});

  const maisVendidos = Object.entries(vendasPorProduto)
    .map(([idProduto, dados]) => {
      const produto = produtos.find(p => p.id == idProduto);
      return {
        nome: produto ? produto.nome : 'Desconhecido',
        quantidade: dados.quantidade,
        unidade_medida: produto ? produto.unidade_medida : '', // Adiciona unidade de medida
        vendas: dados.vendas
      };
    })
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 5);

  const produtosMaisVendidosList = document.querySelector("#produtos-mais-vendidos");
  produtosMaisVendidosList.innerHTML = maisVendidos
    .map(item => `  
          <li class="list-group-item">
              ${item.nome}
              <span class="badge bg-success float-end">
                ${parseFloat(Number(item.quantidade).toFixed(3))} ${item.unidade_medida} vendido(s) - ${item.vendas} venda(s)
              </span>
          </li>
      `)
    .join("");
}

function atualizarGraficoCategorias(categorias) {
  const ctx = document.getElementById('grafico-categorias');

  if (!ctx) {
    console.error('Elemento do gráfico não encontrado');
    return;
  }

  // Se já existe um gráfico, destrua-o
  if (window.chartCategorias) {
    window.chartCategorias.destroy();
  }

  const dados = {
    labels: categorias.map(c => c.nome),
    datasets: [{
      label: 'Produtos por Categoria',
      data: categorias.map(c => c.total_produtos || 0),
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1
    }]
  };

  const config = {
    type: 'doughnut',
    data: dados,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
        title: {
          display: true,
          text: 'Distribuição de Produtos por Categoria'
        }
      }
    },
  };

  window.chartCategorias = new Chart(ctx, config);
}

async function calcularLucro() {
  const lucroBruto = calcularLucroBruto(saidas);
  const lucroLiquido = calcularLucroLiquido(entradas, saidas);
  document.getElementById('lucro-bruto').textContent = `R$ ${lucroBruto.toFixed(2)}`;
  document.getElementById('lucro-liquido').textContent = `R$ ${lucroLiquido.toFixed(2)}`;
}

function calcularLucroBruto(saidas) {
  if (saidas.length === 0) return 0; // Sem vendas, lucro bruto é zero
  return saidas.reduce((total, saida) => {
    const preco = parseFloat(saida.preco.toString().replace(',', '.')) || 0;
    const quantidade = parseFloat(saida.quantidade.toString().replace(',', '.')) || 0;
    return total + (preco * quantidade);
  }, 0);
}

function calcularLucroLiquido(entradas, saidas) {
  const lucroBruto = calcularLucroBruto(saidas);

  const totalEntradas = entradas.reduce((total, entrada) => {
    const preco = parseFloat(entrada.preco.toString().replace(',', '.')) || 0;
    const quantidade = parseFloat(entrada.quantidade.toString().replace(',', '.')) || 0;
    return total + (preco * quantidade);
  }, 0);

  return lucroBruto - totalEntradas; // Receita - Custo
}

async function calcularValorEstoque() {
    try {
        const produtosResponse = await fetch(`${window.location.origin + '/app'}/getProdutos`, {method: 'GET'});
        const entradasResponse = await fetch(`${window.location.origin + '/app'}/getEntradas`, {method: 'GET'});
        const produtos = await produtosResponse.json();
        const entradas = await entradasResponse.json();

        let valorTotal = 0;

        produtos.forEach(produto => {
            // Só calcula se tiver quantidade em estoque
            if (produto.quantidade > 0) {
                // Pegar todas as entradas deste produto
                const entradasProduto = entradas.filter(e => e.idProdutos === produto.id);
                
                if (entradasProduto.length > 0) {
                    // Calcula o preço médio ponderado das entradas
                    const totalValorEntradas = entradasProduto.reduce((total, entrada) => 
                        total + (parseFloat(entrada.preco) * parseFloat(entrada.quantidade)), 0);
                    const totalQuantidadeEntradas = entradasProduto.reduce((total, entrada) => 
                        total + parseFloat(entrada.quantidade), 0);
                    const precoMedioPonderado = totalValorEntradas / totalQuantidadeEntradas;

                    // Multiplica a quantidade atual pelo preço médio de compra
                    const valorProduto = parseFloat(produto.quantidade) * precoMedioPonderado;
                    
                    console.log(`Calculando valor investido em ${produto.nome}:`, {
                        quantidade_atual: produto.quantidade,
                        preco_medio_compra: precoMedioPonderado.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        }),
                        valor_investido: valorProduto.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        })
                    });
                    
                    valorTotal += valorProduto;
                } else {
                    console.warn(`Produto ${produto.nome} tem estoque mas não tem entradas registradas`);
                }
            }
        });

        // Formatar o valor total com separadores de milhares
        const valorFormatado = valorTotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        
        console.log('Valor total investido em estoque:', valorFormatado);
        document.getElementById('valor-estoque').textContent = valorFormatado;
    } catch (error) {
        console.error("Erro ao calcular o valor total do estoque:", error);
        document.getElementById('valor-estoque').textContent = 'Erro ao calcular';
    }
}

function calcularLucroPorPeriodo(periodo) {
  const now = new Date(); // Data atual

  // Define o intervalo com base no período selecionado
  let dataInicio = new Date();
  switch (periodo) {
    case 'dia':
      dataInicio.setDate(now.getDate() - 1); // Último dia
      break;
    case 'tresDias':
      dataInicio.setDate(now.getDate() - 3); // Últimos 3 dias
      break;
    case 'semana':
      dataInicio.setDate(now.getDate() - 7); // Última semana
      break;
    case 'duasSemanas':
      dataInicio.setDate(now.getDate() - 14); // Últimas 2 semanas
      break;
    case 'mes':
      dataInicio.setMonth(now.getMonth() - 1); // Último mês
      break;
    case 'trimestre':
      dataInicio.setMonth(now.getMonth() - 3); // Último trimestre
      break;
    case 'semestre':
      dataInicio.setMonth(now.getMonth() - 6); // Último semestre
      break;
    case 'ano':
      dataInicio.setFullYear(now.getFullYear() - 1); // Último ano
      break;
    default:
      dataInicio = null; // Período total
  }

  // Converte strings de `created_at` para objetos Date e filtra os dados
  const entradasFiltradas = dataInicio
    ? entradas.filter((entrada) => new Date(entrada.created_at) >= dataInicio)
    : entradas;

  const saidasFiltradas = dataInicio
    ? saidas.filter((saida) => new Date(saida.created_at) >= dataInicio)
    : saidas;

  // Recalcula os lucros com os dados filtrados
  const lucroBruto = calcularLucroBruto(saidasFiltradas);
  const lucroLiquido = calcularLucroLiquido(entradasFiltradas, saidasFiltradas);

  // Atualiza os valores no HTML
  document.getElementById('lucro-bruto').textContent = `R$ ${lucroBruto.toFixed(2)}`;
  document.getElementById('lucro-liquido').textContent = `R$ ${lucroLiquido.toFixed(2)}`;
}

// Adiciona o evento ao seletor de período
document.getElementById('periodo').addEventListener('change', (event) => {
  const periodo = event.target.value;
  calcularLucroPorPeriodo(periodo);
});

// Carrega os dados iniciais
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await Promise.all([
      fetchProdutos(),
      fetchEntradas(),
      fetchSaidas(),
      fetchCategorias(),
      fetchClientes(),
      fetchFornecedores()
    ]);
    atualizarCaixas();
    atualizarProdutosMaisVendidos();
    atualizarGraficoCategorias(categorias);
    calcularLucroPorPeriodo('total');
    carregarProdutosBaixoEstoque();
    calcularValorEstoque();
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }
});

async function carregarProdutosBaixoEstoque() {
  try {
    const response = await fetch(`${window.location.origin + '/app'}/getProdutos`, {method: 'GET'});
    const produtos = await response.json();

    const produtosBaixoEstoque = produtos.filter(p =>
      (p.unidade_medida === 'KG' && p.quantidade <= 1) ||
      (p.unidade_medida === 'UN' && p.quantidade <= 5)
    );

    const lista = document.getElementById("lista-estoque-baixo");
    lista.innerHTML = ""; // Limpa a lista antes de adicionar novos itens

    if (produtosBaixoEstoque.length === 0) {
      lista.innerHTML = '<li class="list-group-item text-center text-success">Todos os produtos estão em estoque!</li>';
      return;
    }

    produtosBaixoEstoque.forEach(produto => {
      const item = document.createElement("li");
      item.className = `list-group-item d-flex justify-content-between align-items-center ${produto.quantidade === 0 ? 'list-group-item-danger' : 'list-group-item-warning'} fw-bold`;
      item.innerHTML = `
              <span>${produto.nome} (Qtd: ${produto.quantidade} ${produto.unidade_medida})</span>
              <span class="badge bg-${produto.quantidade === 0 ? 'danger' : 'warning'} rounded-pill p-2">
                  ${produto.quantidade === 0 ? 'Sem estoque' : 'Estoque baixo'}
              </span>
          `;
      lista.appendChild(item);
    });
  } catch (error) {
    console.error("Erro ao carregar produtos de estoque baixo:", error);
  }
}