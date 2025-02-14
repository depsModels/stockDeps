<?php
$this->layout("_theme");
?>

<link rel="stylesheet" href="<?= url('assets/app/css/estoque.css') ?>">

<body>
    <div class="container-fluid mt-2">
        <div class="row justify-content-center">
            <div class="tabelaProdutos">
                <h1 class="p-4 text-center">
                    Produtos
                </h1>
                <div class="headerTabelaProdutos p-3">
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalAdicionarProduto" id="adicionarProdutoBtn">
                        Adicionar Produto
                    </button>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalTabelaCategorias" id="adicionarCategoriaBtn">
                        Gerenciar Categorias
                    </button>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalAdicionarDANFE">
                        Adicionar Notas
                    </button>
                    <button class="btn btn-info" id="consultarEntradasBtn">Consultar Entradas</button>
                    <button class="btn btn-info" id="consultarSaidasBtn">Consultar Saídas</button>
                    <div>
                        <label for="buscarProduto" class="px-2">Procurar produto:</label>
                        <input type="text" name="buscarProduto" class="inputsBusca" id="buscarProduto" placeholder="Procurar produto">
                    </div>
                    <div>
                        <label for="categoria" class="px-2">Filtrar por categoria: </label>
                        <select id="categoria" name="categoria"></select>
                    </div>
                </div>
                <table class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th id="ordenarCodigo">Código <span class="seta" id="setaCodigo">⬍</span></th>
                            <th id="ordenarNome">Nome <span class="seta" id="setaNome">⬍</span></th>
                            <th id="ordenarDescricao">Descrição</th>
                            <th id="ordenarPreco">Preço <span class="seta" id="setaPreco">⬍</span></th>
                            <th id="ordenarQuantidade">Quantidade <span class="seta" id="setaQuantidade">⬍</span></th>
                            <th id="ordenarUnidade">Unidade</th>
                            <th id="ordernarStatus">Status</th>
                            <th id="acoesProdutos" class="text-center" colspan="2">Ações</th>
                        </tr>
                    </thead>
                    <tbody id="corpoTabela">
                    </tbody>
                </table>
            </div>
        </div>
        <nav>
            <ul class="pagination justify-content-center" id="pagination"></ul>
        </nav>
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
                <form id="produto-cadastro" name="produto-cadastro" method="post" enctype="multipart/form-data">
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="codigoProdutoAdicionar" class="form-label">Código do Produto</label>
                            <input name="codigo" type="text" class="form-control" id="codigoProdutoAdicionar" placeholder="Digite o código do produto">
                        </div>
                        <div class="mb-3">
                            <label for="nomeProdutoAdicionar" class="form-label">Nome</label>
                            <input name="nome" type="text" class="form-control" id="nomeProdutoAdicionar" placeholder="Digite o nome do produto">
                        </div>
                        <div class="mb-3">
                            <label for="descricaoProdutoAdicionar" class="form-label">Descrição</label>
                            <textarea name="descricao" class="form-control" id="descricaoProdutoAdicionar" placeholder="Digite a descrição do produto"></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="categoriaProdutoAdicionar" class="form-label">Categoria</label>
                            <select name="categoria" class="form-control" id="categoriaProdutoAdicionar">
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="precoSaidaProdutoAdicionar" class="form-label">Preço para Saídas</label>
                            <input name="preco" type="text" class="form-control" id="precoSaidaProdutoAdicionar" value="0,00" data-tipo="preco">
                            <small id="precoHelp" class="form-text text-muted">Digite o valor do produto com separação de milhar (ex: R$ 1.000,00).</small>
                        </div>
                        <div class="mb-3">
                            <label for="unidadeProdutoAdicionar" class="form-label">Unidade de Medida</label>
                            <select name="unidade" class="form-control" id="unidadeProdutoAdicionar">
                                <option value="KG">Kilograma (kg)</option>
                                <option value="G">Grama (g)</option>
                                <option value="L">Litro (l)</option>
                                <option value="ML">Mililitro (ml)</option>
                                <option value="PACOTE">Pacote</option>
                                <option value="UN">Unidade (un)</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="fotoProdutoAdicionar" class="form-label">Foto do Produto</label>
                            <input name="image" type="file" id="fotoProdutoAdicionar" class="form-control">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        <button type="submit" class="btn btn-primary" id="salvarProduto">Salvar Produto</button>
                    </div>
                </form>
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
                <form id="produto-update" method="post" enctype="multipart/form-data">
                    <div class="modal-body">
                        <input type="hidden" name="idProdutoUpdate" id="idProdutoUpdate">
                        <div class="mb-3">
                            <label for="codigoProdutoEditar" class="form-label">Código do Produto</label>
                            <input name="codigo" type="text" class="form-control" id="codigoProdutoEditar" placeholder="Digite o código do produto">
                        </div>
                        <div class="mb-3">
                            <label for="nomeProduto" class="form-label">Nome</label>
                            <input name="nome" type="text" id="nomeProduto" class="form-control">
                        </div>
                        <div class="mb-3">
                            <label for="descricaoProduto" class="form-label">Descrição</label>
                            <textarea name="descricao" id="descricaoProduto" class="form-control"></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="categoriaProdutoEditar" class="form-label">Categoria</label>
                            <select name="categoria" class="form-control" id="categoriaProdutoEditar">
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="precoProduto" class="form-label">Preço</label>
                            <input name="preco" type="text" class="form-control" id="precoProduto" data-tipo="preco">
                            <small id="precoHelp" class="form-text text-muted">Digite o valor do produto com separação de milhar (ex: R$ 1.000,00).</small>
                        </div>
                        <div class="mb-3">
                            <label for="unidadeProdutoEditar" class="form-label">Unidade de Medida</label>
                            <select name="unidade" class="form-control" id="unidadeProdutoEditar">
                                <option value="KG">Kilograma (kg)</option>
                                <option value="G">Grama (g)</option>
                                <option value="L">Litro (l)</option>
                                <option value="ML">Mililitro (ml)</option>
                                <option value="PACOTE">Pacote</option>
                                <option value="UN">Unidade (un)</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="fotoProdutoEditar" class="form-label">Foto do Produto</label>
                            <input name="image" type="file" id="fotoProdutoEditar" class="form-control" onchange="previewImagemEditar(this)">
                            <div class="mt-2 text-center">
                                <img id="previewImagemEditar" src="" alt="Preview da Imagem" style="max-width: 200px; max-height: 200px; display: none;">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        <button type="submit" class="btn btn-primary">Salvar alterações</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal com a tabela de categorias -->
    <div class="modal fade" id="modalTabelaCategorias" tabindex="-1" aria-labelledby="modalTabelaCategoriasLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalTabelaCategoriasLabel">Gerenciar Categorias</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- Botão para adicionar uma nova categoria -->
                    <button class="btn btn-success mb-3" data-bs-toggle="modal" data-bs-target="#modalAdicionarCategoria">
                        Adicionar Categoria
                    </button>
                    <!-- Tabela de categorias -->
                    <div class="table-responsive">
                        <table class="table table-bordered table-striped" id="tabelaCategorias">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Descrição</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody id="corpoTabelaCategorias">
                                <!-- As categorias serão inseridas aqui dinamicamente -->
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
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
                <form id="categoria-cadastro" name="categoria-cadastro" method="post">
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="nomeCategoriaAdicionar" class="form-label">Nome</label>
                            <input name="nome" type="text" class="form-control" id="nomeCategoriaAdicionar" placeholder="Digite o nome da categoria">
                        </div>
                        <div class="mb-3">
                            <label for="descricaoCategoriaAdicionar" class="form-label">Descrição</label>
                            <textarea name="descricao" class="form-control" id="descricaoCategoriaAdicionar" placeholder="Digite a descrição da categoria"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        <button type="submit" class="btn btn-primary" id="salvarCategoria">Salvar Categoria</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal Editar Categoria -->
    <div class="modal fade" id="modalEditarCategoria" tabindex="-1" aria-labelledby="modalEditarCategoriaLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalEditarCategoriaLabel">Editar Categoria</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="categoria-editar" name="categoria-editar" method="post">
                    <div class="modal-body">
                        <input name="idCategoriaEditar" id="idCategoriaEditar" type="hidden">
                        <div class="mb-3">
                            <label for="nomeCategoriaEditar" class="form-label">Nome</label>
                            <input name="nome" type="text" class="form-control" id="nomeCategoriaEditar" placeholder="Digite o nome da categoria">
                        </div>
                        <div class="mb-3">
                            <label for="descricaoCategoriaEditar" class="form-label">Descrição</label>
                            <textarea name="descricao" class="form-control" id="descricaoCategoriaEditar" placeholder="Digite a descrição da categoria"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        <button type="submit" class="btn btn-primary" id="salvarEdicaoCategoria">Salvar Alterações</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal Excluir Categoria -->
    <div class="modal fade" id="modalExcluirCategoria" tabindex="-1" aria-labelledby="modalExcluirCategoriaLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalExcluirCategoriaLabel">Excluir Categoria</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                </div>
                <form id="categoria-excluir" name="categoria-excluir" method="post">
                    <div class="modal-body">
                        <p>Tem certeza de que deseja excluir esta categoria?</p>
                        <input type="hidden" id="idCategoriaExcluir" name="idCategoriaExcluir"> <!-- Campo oculto para armazenar o ID -->
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-danger" id="confirmarExcluirCategoria">Excluir</button>
                    </div>
                </form>
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
                <form id="produto-excluir" name="produto-excluir" method="post">
                    <div class="modal-body">
                        <p>Tem certeza de que deseja excluir este produto?
                            Ao confirmar, todas as entradas e saídas relacionadas a ele também serão removidas.</p>
                        <input type="hidden" id="idProdutoExcluir" name="idProdutoExcluir"> <!-- Campo oculto para armazenar o id -->
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-danger" id="confirmarExcluir">Excluir</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal Adicionar Nota -->
    <div class="modal" id="modalAdicionarDANFE" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Adicionar Nota DANFE</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form action="processarXmlNota" method="POST" enctype="multipart/form-data">
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="arquivoNota" class="form-label">Upload de Nota (XML)</label>
                            <input type="file" id="arquivoNota" name="arquivoNota" class="form-control" accept=".xml">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Adicionar Nota</button>
                    </div>
                </form>
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
                <form id="entrada-cadastro" name="entrada-cadastro" method="post">
                    <div class="modal-body">
                        <input name="produtoId" type="hidden" id="produtoId" value=""> <!-- Campo oculto para armazenar o id -->
                        <div class="mb-3 fornecedor-wrapper">
                            <label for="entradaFornecedor" class="form-label">Fornecedor</label>
                            <input name="fornecedor" type="text" class="form-control" id="entradaFornecedor" placeholder="Digite o nome do fornecedor" autocomplete="off">
                            <input type="hidden" id="idFornecedor" name="idFornecedor">
                            <div class="sugestoes-fornecedores" style="display: none; position: absolute; width: 100%; max-height: 200px; overflow-y: auto; background: white; border: 1px solid #ddd; border-radius: 4px; z-index: 1000;">
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="quantidade" class="form-label">Quantidade</label>
                            <input name="quantidade" type="number" min="0" step="0.001" class="form-control" id="quantidade" placeholder="Digite a quantidade">
                        </div>
                        <div class="mb-3">
                            <label for="precoEntrada" class="form-label">Preço</label>
                            <input name="preco" type="text" class="form-control" id="precoEntrada" value="0,00" data-tipo="preco">
                            <small id="precoHelp" class="form-text text-muted">Digite o valor do produto com separação de milhar (ex: R$ 1.000,00).</small>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        <button type="submit" class="btn btn-primary" id="salvarEntrada">Salvar Entrada</button>
                    </div>
                </form>
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
                <form id="saida-cadastro" name="saida-cadastro" method="post">
                    <div class="modal-body">
                        <input name="produtoId2" type="hidden" id="produtoId2" value=""> <!-- Campo oculto para armazenar o id -->
                        <!-- Campo Cliente -->
                        <div class="mb-3">
                            <label for="cliente" class="form-label">Cliente</label>
                            <div class="d-flex align-items-center justify-content-center" style="min-height: 100%;">
                                <input name="nome" type="text" class="form-control" id="cliente" placeholder="Digite o nome do cliente">
                            </div>
                            <div class="list-group mt-0 position-absolute w-100" id="clientes-lista" style="display: none; z-index: 1000;"></div>
                            <div class="form-check m-3">
                                <input class="form-check-input" type="checkbox" id="clienteNaoCadastrado">
                                <label class="form-check-label" for="clienteNaoCadastrado">Cliente não cadastrado</label>
                            </div>
                        </div>
                        <!-- Campo Quantidade -->
                        <div class="mb-3">
                            <label for="quantidadeSaida" class="form-label">Quantidade</label>
                            <input name="quantidade" type="number" min="0" step="0.001" class="form-control" id="quantidadeSaida" placeholder="Digite a quantidade">
                        </div>
                        <!-- Campo Preço -->
                        <div class="mb-3">
                            <label for="precoSaida" class="form-label">Preço</label>
                            <input name="preco" type="text" class="form-control" id="precoSaida" value="0,00" data-tipo="preco">
                            <small id="precoHelp" class="form-text text-muted">Digite o valor do produto com separação de milhar (ex: R$ 1.000,00).</small>
                        </div>
                    </div>
                    <!-- Botões -->
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        <button type="submit" class="btn btn-primary" id="salvarSaida">Salvar Saída</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal de Entradas -->
    <div class="modal fade" id="entradasModal" tabindex="-1" aria-labelledby="entradasModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="entradasModalLabel">Entradas</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row mb-3">
                        <div class="col-md-8">
                            <label for="buscarEntrada" class="form-label">Buscar</label>
                            <input type="text" class="form-control" id="buscarEntrada" placeholder="Digite para buscar..." oninput="buscarEntrada()">
                        </div>
                        <div class="col-md-4">
                            <label for="dataFiltroEntrada" class="form-label">Filtrar por Data</label>
                            <input type="date" class="form-control" id="dataFiltroEntrada" onchange="filtrarEntradasPorData()">
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Fornecedor</th>
                                    <th>Produto</th>
                                    <th>Quantidade</th>
                                    <th>Preço</th>
                                    <th>Data</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody id="corpoTabelaEntradas">
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <nav>
                            <ul class="pagination justify-content-center" id="paginacaoEntradas"></ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal de Saídas -->
    <div class="modal fade" id="saidasModal" tabindex="-1" aria-labelledby="saidasModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="saidasModalLabel">Saídas</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row mb-3">
                        <div class="col-md-8">
                            <label for="buscarSaida" class="form-label">Buscar</label>
                            <input type="text" class="form-control" id="buscarSaida" placeholder="Digite para buscar..." oninput="buscarSaida()">
                        </div>
                        <div class="col-md-4">
                            <label for="dataFiltroSaida" class="form-label">Filtrar por Data</label>
                            <input type="date" class="form-control" id="dataFiltroSaida" onchange="filtrarSaidasPorData()">
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Cliente</th>
                                    <th>Produto</th>
                                    <th>Quantidade</th>
                                    <th>Preço</th>
                                    <th>Data</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody id="corpoTabelaSaidas">
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <nav>
                            <ul class="pagination justify-content-center" id="paginacaoSaidas"></ul>
                        </nav>
                    </div>
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
                    <form id="entrada-editar" method="post">
                        <input name="idEntradaEditar" id="idEntradaEditar" type="hidden">
                        
                        <!-- Nome do Produto -->
                        <div class="mb-3">
                            <label for="entradaProduto" class="form-label">Produto</label>
                            <input name="nome" type="text" class="form-control" id="entradaProduto" readonly>
                        </div>

                        <!-- Quantidade -->
                        <div class="mb-3">
                            <label for="entradaQuantidade" class="form-label">Quantidade</label>
                            <input name="quantidade" type="number" min="0" step="0.001" class="form-control" id="entradaQuantidade" min="0">
                        </div>

                        <!-- Preço -->
                        <div class="mb-3">
                            <label for="entradaPreco" class="form-label">Preço</label>
                            <input name="preco" type="text" class="form-control" id="entradaPreco" value="0,00" data-tipo="preco">
                            <small class="form-text text-muted">Digite o valor do produto com separação de milhar (ex: R$ 1.000,00).</small>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                            <button type="submit" class="btn btn-primary">Salvar Alterações</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal de Saídas -->
    <div class="modal fade" id="saidasModal" tabindex="-1" aria-labelledby="saidasModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="saidasModalLabel">Saídas</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="d-flex justify-content-center ">
                        <div class="d-flex align-items-center">
                            <label for="filtroDataSaida">Filtrar pelo dia da saída:  </label>
                            <input type="date" id="filtroDataSaida" class="inputsBusca" onchange="filtrarSaidasPorData()" />
                        </div>
                        <div class="d-flex align-items-center">
                            <label for="buscarSaida" class="px-2">Procurar saída: </label>
                            <input type="text" name="buscarSaida" class="inputsBusca" id="buscarSaida" placeholder="Ex: produto...">
                        </div>
                    </div>

                    <div class="mb-3">
                        <div class="row">
                            <div class="col">
                                <label for="dataInicialSaida" class="form-label">Data Inicial</label>
                                <input type="date" class="form-control" id="dataInicialSaida">
                            </div>
                            <div class="col">
                                <label for="dataFinalSaida" class="form-label">Data Final</label>
                                <input type="date" class="form-control" id="dataFinalSaida">
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="buscarSaida" class="form-label">Buscar</label>
                        <input type="text" class="form-control" id="buscarSaida" placeholder="Buscar por produto ou cliente">
                    </div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Produto</th>
                                <th>Quantidade</th>
                                <th>Preço</th>
                                <th>Data</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="corpoTabelaSaidas">
                        </tbody>
                    </table>
                    <div>
                        <nav>
                            <ul class="pagination justify-content-center" id="paginacaoSaidas"></ul>
                        </nav>
                    </div>
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
                    <form id="saida-editar" method="post">
                        <!-- Nome do Produto (Somente leitura) -->
                        <input type="hidden" name="idEditarSaida" id="idEditarSaida">
                        <div class="mb-3">
                            <label for="saidaProduto" class="form-label">Produto</label>
                            <input type="text" class="form-control" id="saidaProduto" readonly> <!-- readonly torna o campo não editável -->
                        </div>

                        <!-- Quantidade -->
                        <div class="mb-3">
                            <label for="saidaQuantidade" class="form-label">Quantidade</label>
                            <input name="quantidade" type="number" min="0" step="0.001" class="form-control" id="saidaQuantidade" min="0">
                        </div>

                        <!-- Preço -->
                        <div class="mb-3">
                            <label for="saidaPreco" class="form-label">Preço</label>
                            <input name="preco" type="text" class="form-control" id="saidaPreco" value="0,00" data-tipo="preco" required>
                            <small id="precoHelp" class="form-text text-muted">Digite o valor do produto com separação de milhar (ex: R$ 1.000,00).</small>
                        </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                    <button type="submit" class="btn btn-primary">Salvar alterações</button>
                </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal Excluir Entrada -->
    <div class="modal fade" id="modalExcluirEntrada" tabindex="-1" aria-labelledby="modalExcluirEntradaLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalExcluirEntradaLabel">Excluir Entrada</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                </div>
                <form id="entrada-excluir" method="post">
                    <div class="modal-body">
                        <p>Tem certeza de que deseja excluir esta entrada?</p>
                        <input type="hidden" id="idEntradaExcluir" name="idEntradaExcluir"> <!-- Campo oculto para armazenar o id -->
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-danger">Excluir</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal Excluir Saída -->
    <div class="modal fade" id="modalExcluirSaida" tabindex="-1" aria-labelledby="modalExcluirSaidaLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalExcluirSaidaLabel">Excluir Saída</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                </div>
                <div class="modal-body">
                    <p>Tem certeza que deseja excluir esta saída?</p>
                    <input type="hidden" id="idSaidaExcluir">
                    <div id="saidaExcluir" data-produto-id="" data-quantidade=""></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-danger" onclick="confirmarExclusaoSaida()">Excluir</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js"></script>
    <script src="<?= url('assets/app/js/app.js') ?>"></script>
    <script src="<?= url('assets/app/js/formsCreate.js') ?>" async></script>
    <script src="<?= url('assets/app/js/formsDelete.js') ?>" async></script>
</body>