<?php
$this->layout("_theme");

?>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js"></script>
<link rel="stylesheet" href="<?= url('assets/app/css/estoque.css') ?>">

<body>


    <div class="container-fluid mt-5">
        <div class="row justify-content-center">
            <div class="tabelaProdutos">
                <div class="headerTabelaProdutos p-3">
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalAdicionarProduto" id="adicionarProdutoBtn">
                        Adicionar Produto
                    </button>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalAdicionarCategoria" id="adicionarCategoriaBtn">Adicionar Categoria</button>
                    <button>Adicionar Notas</button>
                    <button class="btn btn-info" id="consultarEntradasBtn">Consultar Entradas</button>
                    <button class="btn btn-info" id="consultarSaidasBtn">Consultar Saídas</button>
                    <div>
                        <label for="categoria" class="text-light px-2">Procurar produto: </label>
                        <input type="text" name="buscarProduto" id="buscarProduto" placeholder="Procurar produto">
                    </div>
                    <div>
                        <label for="categoria" class="text-light px-2">Filtrar por categoria: </label>
                        <select id="categoria" name="categoria"></select>
                    </div>
                </div>
                <table class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Descrição</th>
                            <th>Preço</th>
                            <th>Quantidade</th>
                            <th>Status</th>
                            <th class="text-center" colspan="2">Ações</th>
                        </tr>
                    </thead>
                    <tbody id="corpoTabela">
                        <!-- As linhas serão adicionadas dinamicamente via JavaScript -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- MODAIS -->

    <!-- Modal Adicionar Produto -->
    <div class="modal fade" id="modalAdicionarProduto" tabindex="-1" aria-labelledby="modalAdicionarProdutoLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalAdicionarProdutoLabel">Adicionar Produto</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="nomeProdutoAdicionar" class="form-label">Nome</label>
                        <input type="text" class="form-control" id="nomeProdutoAdicionar" placeholder="Digite o nome do produto">
                    </div>
                    <div class="mb-3">
                        <label for="descricaoProdutoAdicionar" class="form-label">Descrição</label>
                        <textarea class="form-control" id="descricaoProdutoAdicionar" placeholder="Digite a descrição do produto"></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="categoriaProdutoAdicionar" class="form-label">Categoria</label>
                        <select class="form-control" id="categoriaProdutoAdicionar">
                            <!-- As categorias serão preenchidas dinamicamente -->
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="precoSaidaProdutoAdicionar" class="form-label">Preço para Saídas</label>
                        <input type="number" step="0.01" class="form-control" id="precoSaidaProdutoAdicionar" placeholder="Digite o preço para saídas">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                    <button type="button" class="btn btn-primary" id="salvarProduto">Salvar Produto</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Adicionar Categoria -->
    <div class="modal fade" id="modalAdicionarCategoria" tabindex="-1" aria-labelledby="modalAdicionarCategoriaLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalAdicionarCategoriaLabel">Adicionar Categoria</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="nomeCategoriaAdicionar" class="form-label">Nome</label>
                        <input type="text" class="form-control" id="nomeCategoriaAdicionar" placeholder="Digite o nome da categoria">
                    </div>
                    <div class="mb-3">
                        <label for="descricaoCategoriaAdicionar" class="form-label">Descrição</label>
                        <textarea class="form-control" id="descricaoCategoriaAdicionar" placeholder="Digite a descrição da categoria"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                    <button type="button" class="btn btn-primary" id="salvarCategoria">Salvar Categoria</button>
                </div>
            </div>
        </div>
    </div>


    <!-- Modal Editar Produto -->
    <div class="modal" id="modalEditar" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Editar Produto</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="nomeProduto" class="form-label">Nome</label>
                        <input type="text" id="nomeProduto" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label for="descricaoProduto" class="form-label">Descrição</label>
                        <textarea id="descricaoProduto" class="form-control"></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="precoProduto" class="form-label">Preço</label>
                        <input type="number" id="precoProduto" class="form-control" step="0.01">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary">Salvar Alterações</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Excluir -->
    <div class="modal fade" id="modalExcluir" tabindex="-1" aria-labelledby="modalExcluirLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalExcluirLabel">Excluir Produto</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                </div>
                <div class="modal-body">
                    <p>Tem certeza de que deseja excluir este produto?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-danger" id="confirmarExcluir">Excluir</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Adicionar Entrada -->
    <div class="modal fade" id="modalEntrada" tabindex="-1" aria-labelledby="modalEntradaLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalEntradaLabel">Adicionar Entrada</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="fornecedor" class="form-label">Fornecedor</label>
                        <input type="text" class="form-control" id="fornecedor" placeholder="Digite o nome do fornecedor">
                    </div>
                    <div class="mb-3">
                        <label for="quantidade" class="form-label">Quantidade</label>
                        <input type="number" class="form-control" id="quantidade" placeholder="Digite a quantidade">
                    </div>
                    <div class="mb-3">
                        <label for="precoEntrada" class="form-label">Preço</label>
                        <input type="number" step="0.01" class="form-control" id="precoEntrada" placeholder="Digite o preço">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                    <button type="button" class="btn btn-primary" id="salvarEntrada">Salvar Entrada</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Adicionar Saída -->
    <div class="modal fade" id="modalSaida" tabindex="-1" aria-labelledby="modalSaidaLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalSaidaLabel">Adicionar Saída</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="cliente" class="form-label">Cliente</label>
                        <input type="text" class="form-control" id="cliente" placeholder="Digite o nome do cliente">
                    </div>
                    <div class="mb-3">
                        <label for="quantidadeSaida" class="form-label">Quantidade</label>
                        <input type="number" class="form-control" id="quantidadeSaida" placeholder="Digite a quantidade">
                    </div>
                    <div class="mb-3">
                        <label for="precoSaida" class="form-label">Preço</label>
                        <input type="number" step="0.01" class="form-control" id="precoSaida" placeholder="Digite o preço">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                    <button type="button" class="btn btn-primary" id="salvarSaida">Salvar Saída</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Consultar Entradas-->
    <div class="modal fade" id="modalEntradas" tabindex="-1" aria-labelledby="modalEntradasLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalEntradasLabel">Consultar Entradas</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div>
                        <label for="buscarEntradas" class="text-light px-2">Procurar entrada:</label>
                        <input type="text" id="buscarEntradas" placeholder="Procurar entrada" class="form-control">
                    </div>
                    <table class="table table-bordered table-striped mt-3">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>ID Produto</th>
                                <th>Quantidade</th>
                                <th>Criado Em</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="corpoTabelaEntradas">
                            <!-- Entradas serão preenchidas dinamicamente -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Editar Entradas -->
    <div class="modal fade" id="modalEditarEntrada" tabindex="-1" aria-labelledby="modalEditarEntradaLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalEditarEntradaLabel">Editar Entrada</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="formEditarEntrada">
                        <div class="mb-3">
                            <label for="idProdutoEntrada" class="form-label">ID Produto</label>
                            <input type="number" class="form-control" id="idProdutoEntrada" required>
                        </div>
                        <div class="mb-3">
                            <label for="quantidadeEntrada" class="form-label">Quantidade</label>
                            <input type="number" class="form-control" id="quantidadeEntrada" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Salvar Alterações</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Consultar Saidas -->
    <div class="modal fade" id="modalSaidas" tabindex="-1" aria-labelledby="modalSaidasLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalSaidasLabel">Consultar Saídas</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div>
                        <label for="buscarSaidas" class="text-light px-2">Procurar saída:</label>
                        <input type="text" id="buscarSaidas" placeholder="Procurar saída" class="form-control">
                    </div>
                    <table class="table table-bordered table-striped mt-3">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>ID Produto</th>
                                <th>Quantidade</th>
                                <th>Criado Em</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="corpoTabelaSaidas">
                            <!-- Saídas serão preenchidas dinamicamente -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Editar Saidas -->
    <div class="modal fade" id="modalEditarSaida" tabindex="-1" aria-labelledby="modalEditarSaidaLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalEditarSaidaLabel">Editar Saída</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="formEditarSaida">
                        <div class="mb-3">
                            <label for="idProdutoSaida" class="form-label">ID Produto</label>
                            <input type="number" class="form-control" id="idProdutoSaida" required>
                        </div>
                        <div class="mb-3">
                            <label for="quantidadeSaida" class="form-label">Quantidade</label>
                            <input type="number" class="form-control" id="quantidadeSaida" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Salvar Alterações</button>
                    </form>
                </div>
            </div>
        </div>
    </div>


    <script>
        function exibirMensagemTemporaria(mensagem) {
            // Cria o elemento da mensagem
            const elementoMensagem = $('<div>')
                .css({
                    position: 'absolute',
                    top: '25%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: '#FF4C4C',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '5px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
                    zIndex: '9999', // Adiciona o z-index desejado
                    display: 'none' // Inicia oculto
                })
                .text(mensagem);

            // Adiciona o elemento à página
            $('body').append(elementoMensagem);

            // Animação de aparecimento suave
            elementoMensagem.fadeIn(400);

            // Define um temporizador para remover o elemento após 15 segundos
            setTimeout(() => {
                elementoMensagem.fadeOut(400, () => {
                    elementoMensagem.remove();
                });
            }, 2500);
        }
    </script>


    <script src="<?= url('assets/app/js/app.js') ?>"></script>
    <script src="<?= url('assets/app/js/teste.js') ?>"></script>


</body>