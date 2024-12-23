const BASE_URL = '/app';

let produtos = [];
let entradas = [];
let saidas = [];
let categorias = [];
let clientes = [];
let fornecedores = [];
let chartCategorias = null;

async function fetchProdutos() {
  const response = await fetch(`${BASE_URL}/getProdutos`);
  produtos = await response.json();
}

async function fetchEntradas() {
  const response = await fetch(`${BASE_URL}/getEntradas`);
  entradas = await response.json();  // Defina a variável `entradas` no escopo global
  console.log(entradas); 
  calcularLucro(entradas, saidas);
}

async function fetchSaidas() {
  const response = await fetch(`${BASE_URL}/getSaidas`);
  saidas = await response.json(); 
  calcularLucro(entradas, saidas);
}

async function fetchCategorias() {
  const response = await fetch(`${BASE_URL}/getCategorias`);
  categorias = await response.json();
  atualizarGraficoCategorias(categorias);
}

async function fetchClientes() {
  const response = await fetch(`${BASE_URL}/getClientes`);
  clientes = await response.json();
  preencherClientes(clientes);
}

async function fetchFornecedores() {
  const response = await fetch(`${BASE_URL}/getFornecedores`);
  fornecedores = await response.json();
  preencherFornecedores(fornecedores);
}


async function loadDashboardData() {
  try {
    await Promise.all([
      fetchAndUpdateData('produtos', atualizarProdutos),
      fetchAndUpdateData('entradas', atualizarEntradas),
      fetchAndUpdateData('saidas', atualizarSaidas),
      fetchAndUpdateData('clientes', atualizarClientes),
      fetchAndUpdateData('fornecedores', atualizarFornecedores),
      fetchCategorias(),
    ]);
    atualizarCaixas();
    atualizarProdutosMaisVendidos();
  atualizarGraficoCategorias(categorias);
  } catch (error) {
    console.error('Erro ao carregar os dados do dashboard:', error);
  }
}

async function fetchAndUpdateData(resource, updateFunction) {
  try {
    const response = await fetch(`${BASE_URL}/get${capitalize(resource)}`);
    const data = await response.json();
    updateFunction(data);
  } catch (error) {
    console.error(`Erro ao buscar ${resource}:`, error);
    updateFunction([]); // Atualiza com array vazia em caso de erro
  }
}

function atualizarProdutos(data) {
  produtos = data || [];
  document.getElementById('total-produtos').textContent = produtos.length || 0;
  document.getElementById('produtos-estoque').textContent = produtos.filter(p => p.quantidade > 0).length;
  document.getElementById('estoque-baixo').textContent = produtos.filter(p => p.quantidade > 0 && p.quantidade < 5).length;
  document.getElementById('produtos-sem-estoque').textContent = produtos.filter(p => p.quantidade === 0).length;
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
                  ${item.quantidade} vendido(s) - ${item.vendas} venda(s)
              </span>
          </li>
      `)
    .join("");
}


function atualizarGraficoCategorias(categorias) {
  if (!categorias || categorias.length === 0) {
    console.error("Categorias inválidas ou não carregadas.");
    return;
  }

  const categoriasContagem = produtos.reduce((mapa, produto) => {
    if (!mapa[produto.idCategoria]) {
      mapa[produto.idCategoria] = 0;
    }
    mapa[produto.idCategoria] += 1;
    return mapa;
  }, {});

  const categoriasLabels = Object.keys(categoriasContagem).map(id => {
    const categoria = categorias.find(c => c.id == id);
    return categoria ? categoria.nome : `Categoria ${id}`;
  });

  const categoriasData = Object.values(categoriasContagem);

  // Gerar cores distintas usando HSL
  const gerarCoresDistintas = (quantidade) => {
    const cores = [];
    const intervalo = 360 / quantidade; // Espaçamento igual no espectro de cores
    for (let i = 0; i < quantidade; i++) {
      const hue = Math.round(i * intervalo); // Variar o tom (hue)
      cores.push(`hsl(${hue}, 70%, 60%)`); // Saturação fixa e brilho médio
    }
    return cores;
  };

  const categoriasCores = gerarCoresDistintas(categoriasLabels.length);

  // Verificar se já existe um gráfico e destruí-lo antes de criar um novo
  if (chartCategorias) {
    chartCategorias.destroy();
  }

  const ctxCategorias = document.getElementById("chart-categorias").getContext("2d");
  chartCategorias = new Chart(ctxCategorias, {
    type: "doughnut",
    data: {
      labels: categoriasLabels,
      datasets: [{
        data: categoriasData,
        backgroundColor: categoriasCores,
      }],
    },
    options: {
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    },
  });
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
    const preco = parseFloat(saida.preco) || 0;
    const quantidade = parseInt(saida.quantidade) || 0;
    return total + (preco * quantidade);
  }, 0);
}

function calcularLucroLiquido(entradas, saidas) {
  const lucroBruto = calcularLucroBruto(saidas);

  const totalEntradas = entradas.reduce((total, entrada) => {
    const preco = parseFloat(entrada.preco) || 0;
    const quantidade = parseInt(entrada.quantidade) || 0;
    return total + (preco * quantidade);
  }, 0);

  return lucroBruto - totalEntradas; // Receita - Custo
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

// Chamada inicial para calcular com o período "total"
window.onload = async () => {
  await loadDashboardData();
  calcularLucroPorPeriodo('total'); // Exibe lucro total ao carregar a página
};

