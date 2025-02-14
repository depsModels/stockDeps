// // Configurações globais
// window.CONFIG = {
//     itensPorPagina: 10,
//     maxBotoesPaginacao: 5,
//     messageTimeout: 3000,
// };

// // Variáveis globais
// window.produtos = [];
// window.entradas = [];
// window.saidas = [];
// window.categorias = [];
// window.clientes = [];
// window.fornecedores = [];
// window.chartCategorias = null;

// // Funções de fetch
// window.fetchProdutos = async function() {
//     try {
//         const response = await fetch(`${window.BASE_URL}/getProdutos`);
//         const data = await response.json();
//         window.produtos = data;
//         return data;
//     } catch (error) {
//         console.error('Erro ao buscar produtos:', error);
//     }
// };

// window.fetchEntradas = async function() {
//     try {
//         const response = await fetch(`${window.BASE_URL}/getEntradas`);
//         const data = await response.json();
//         window.entradas = data;
//         return data;
//     } catch (error) {
//         console.error('Erro ao buscar entradas:', error);
//     }
// };

// window.fetchSaidas = async function() {
//     try {
//         const response = await fetch(`${window.BASE_URL}/getSaidas`);
//         const data = await response.json();
//         window.saidas = data;
//         return data;
//     } catch (error) {
//         console.error('Erro ao buscar saídas:', error);
//     }
// };

// window.fetchCategorias = async function() {
//     try {
//         const response = await fetch(`${window.BASE_URL}/getCategorias`);
//         const data = await response.json();
//         window.categorias = data;
//         return data;
//     } catch (error) {
//         console.error('Erro ao buscar categorias:', error);
//     }
// };

// window.fetchClientes = async function() {
//     try {
//         const response = await fetch(`${window.BASE_URL}/getClientes`);
//         const data = await response.json();
//         window.clientes = data;
//         return data;
//     } catch (error) {
//         console.error('Erro ao buscar clientes:', error);
//     }
// };

// window.fetchFornecedores = async function() {
//     try {
//         const response = await fetch(`${window.BASE_URL}/getFornecedores`);
//         const data = await response.json();
//         window.fornecedores = data;
//         return data;
//     } catch (error) {
//         console.error('Erro ao buscar fornecedores:', error);
//     }
// };
