// Constants and Global Variables
const BASE_URL = '/stockDeps/app';
const CONFIG = {
    itensPorPagina: 8,
    maxBotoesPaginacao: 5,
    animationDuration: 400,
    messageTimeout: 2500
};

// Cache DOM queries
const DOM = {
    categoria: document.getElementById("categoria"),
    saidaCadastro: document.getElementById("saida-cadastro"),
    ordenarCodigo: document.getElementById("ordenarCodigo"),
    consultarEntradasBtn: document.getElementById("consultarEntradasBtn"),
    consultarSaidasBtn: document.getElementById("consultarSaidasBtn"),
    entradasModal: document.getElementById("entradasModal")
};

// State Management
const state = {
    produtos: [],
    produtosOriginais: [],
    produtosFiltrados: [],
    produtosOrdenados: [],
    clientes: [],
    fornecedores: [],
    entradas: [],
    entradasFiltradas: [],
    saidas: [],
    saidasFiltradas: [],
    categorias: [],
    paginacao: {
        atual: 1,
        entradas: 1,
        saidas: 1
    },
    ordem: {
        coluna: null,
        crescente: true
    }
};

// API Functions with Error Handling
const api = {
    async fetch(endpoint) {
        try {
            const response = await fetch(`${BASE_URL}/${endpoint}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            exibirMensagemTemporariaErro(`Erro ao carregar ${endpoint}`);
            return [];
        }
    },
    
    async fetchProdutos() {
        state.produtosOriginais = await this.fetch('getProdutos');
        state.produtosFiltrados = [...state.produtosOriginais];
        state.produtosOrdenados = [...state.produtosFiltrados];
        buscarProduto();
        mostrarPagina(state.paginacao.atual);
    },

    async fetchCategorias() {
        state.categorias = await this.fetch('getCategorias');
        preencherCategorias(state.categorias, alterarTabelaPorCategoriaSelecionada);
        renderizarTabela(state.categorias);
    },

    async fetchAll() {
        await Promise.all([
            this.fetchProdutos(),
            this.fetchCategorias(),
            this.fetch('getClientes').then(data => {
                state.clientes = data;
                preencherClientes(data);
            }),
            this.fetch('getFornecedores').then(data => {
                state.fornecedores = data;
                preencherFornecedores(data);
            }),
            this.fetch('getEntradas').then(data => {
                state.entradas = data;
                state.entradasFiltradas = [...data];
                mostrarPaginaEntradas(state.paginacao.entradas);
            }),
            this.fetch('getSaidas').then(data => {
                state.saidas = data;
                state.saidasFiltradas = [...data];
                mostrarPaginaSaidas(state.paginacao.saidas);
            })
        ]);
    }
};

// Utility Functions
const utils = {
    formatarData(dataISO) {
        if (!dataISO) return '';
        const data = new Date(dataISO);
        return data.toLocaleDateString('pt-BR');
    },

    removerAcentos(str) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Message Display Functions
function exibirMensagem(mensagem, tipo) {
    const cores = {
        erro: 'rgb(220, 53, 69)',
        aviso: 'rgb(255, 193, 7)',
        sucesso: 'rgb(40, 167, 69)'
    };

    const elementoMensagem = $('<div>').css({
        position: 'fixed',
        top: '25%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: cores[tipo],
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
        zIndex: '9999',
        display: 'none'
    }).text(mensagem);

    $('body').append(elementoMensagem);
    elementoMensagem.fadeIn(CONFIG.animationDuration);

    setTimeout(() => {
        elementoMensagem.fadeOut(CONFIG.animationDuration, () => {
            elementoMensagem.remove();
        });
    }, CONFIG.messageTimeout);
}

const exibirMensagemTemporariaErro = (msg) => exibirMensagem(msg, 'erro');
const exibirMensagemTemporariaAviso = (msg) => exibirMensagem(msg, 'aviso');
const exibirMensagemTemporariaSucesso = (msg) => exibirMensagem(msg, 'sucesso');

// Search and Filter Functions
const buscarProduto = utils.debounce(() => {
    const searchTerm = utils.removerAcentos(document.getElementById('searchInput').value.toLowerCase());
    state.produtosFiltrados = state.produtosOriginais.filter(produto => 
        utils.removerAcentos(produto.nome.toLowerCase()).includes(searchTerm) ||
        utils.removerAcentos(produto.codigo_produto.toLowerCase()).includes(searchTerm)
    );
    state.produtosOrdenados = [...state.produtosFiltrados];
    mostrarPagina(1);
}, 300);

// Event Listeners
function initEventListeners() {
    DOM.categoria?.addEventListener("change", () => alterarTabelaPorCategoriaSelecionada(state.produtos));
    DOM.saidaCadastro?.addEventListener("submit", handleSaidaSubmit);
    DOM.ordenarCodigo?.addEventListener("click", () => ordenarTabela("codigo_produto", "setaCodigo"));
    
    // Initialize search inputs with debounced handlers
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', buscarProduto);
    }
}

// Initialize Application
function init() {
    initEventListeners();
    api.fetchAll().catch(console.error);
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
