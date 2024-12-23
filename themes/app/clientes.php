<?php
$this->layout("_theme");
?>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/inputmask/5.0.8/jquery.inputmask.min.js"></script>
<link rel="stylesheet" href="<?= url('assets/app/css/clientes.css') ?>">

<body>
    <div class="container-fluid">
        <div class="row justify-content-center">
            <div class="tabelaClientes">
                <h1 class="text-center p-4">
                    Clientes
                </h1>
                <div class="headerTabelaClientes p-3">
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalAdicionarCliente" id="adicionarClienteBtn">
                        Adicionar Cliente
                    </button>
                    <div class="d-flex">
                        <label for="buscarCliente" class="p-2">Procurar cliente:</label>
                        <input type="text" name="buscarCliente" id="buscarCliente" placeholder="Procurar cliente" class="form-control">
                    </div>
                </div>
                <table id="tabelaClientes" class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th id="ordenarNomeCliente">Nome <span class="seta" id="setaNomeCliente">⬍</span></th>
                            <th id="ordenarCpfCliente">CPF</th>
                            <th id="ordenarCelularCliente">Celular</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Linhas serão inseridas dinamicamente aqui -->
                    </tbody>
                </table>
            </div>
        </div>
        <nav>
            <ul class="pagination justify-content-center" id="paginationClientes"></ul>
        </nav>
    </div>
    
    <!-- Modal Adicionar Cliente -->
    <div class="modal fade" id="modalAdicionarCliente" tabindex="-1" aria-labelledby="modalAdicionarClienteLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg"> <!-- Aumentando a largura do modal -->
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalAdicionarClienteLabel">Adicionar Cliente</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="cadastro-clientes" name="cadastro-clientes" method="post">
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="nomeCliente" class="form-label">Nome</label>
                            <input name="nome" type="text" class="form-control" id="nomeCliente" placeholder="Digite o nome do cliente">
                        </div>
                        <div class="mb-3">
                            <label for="cpfCliente" class="form-label">CPF</label>
                            <input name="cpf" type="text" class="form-control" id="cpfCliente" placeholder="Digite o CPF do cliente" maxlength="14" oninput="formatarCPF(event)">
                        </div>
                        <div class="mb-3">
                            <label for="telefoneCliente" class="form-label">Celular</label>
                            <input name="celular" type="text" class="form-control" id="telefoneCliente" placeholder="Digite o celular do cliente">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        <button type="submit" class="btn btn-primary">Salvar Cliente</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal Editar Cliente -->
    <div class="modal fade" id="modalEditarCliente" tabindex="-1" aria-labelledby="modalEditarClienteLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalEditarClienteLabel">Editar Cliente</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="cliente-update" method="post">
                    <div class="modal-body">
                            <input type="hidden" id="idClienteUpdate" name="idClienteUpdate"> <!-- Campo oculto para armazenar o id -->
                        <div class="mb-3">
                            <label for="editarNomeCliente" class="form-label">Nome</label>
                            <input name="nome" type="text" class="form-control" id="editarNomeCliente">
                        </div>
                        <div class="mb-3">
                            <label for="editarCpfCliente" class="form-label">CPF</label>
                            <input name="cpf" type="text" class="form-control" id="editarCpfCliente">
                        </div>
                        <div class="mb-3">
                            <label for="editarTelefoneCliente" class="form-label">Celular</label>
                            <input name="celular" type="text" class="form-control" id="editarTelefoneCliente">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Salvar Alterações</button>
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
                <form id="cliente-excluir" name="cliente-excluir" method="post">
                    <div class="modal-body">
                        <p>Tem certeza de que deseja excluir este cliente?  
                        Ao confirmar, todas as vendas, transações e outros registros relacionados a ele também serão removidos.</p>
                        <input type="hidden" id="idClienteExcluir" name="idClienteExcluir"> <!-- Campo oculto para armazenar o id -->
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-danger" id="confirmarExcluir">Excluir</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="modal fade" id="modalHistoricoCliente" tabindex="-1" aria-labelledby="modalHistoricoClienteLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalHistoricoClienteLabel">Histórico de Compras</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p id="historicoCliente"></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                </div>
            </div>
        </div>
    </div>

    <script src="<?= url('assets/app/js/clientes.js') ?>"></script>
    <script src="<?= url('assets/app/js/formsCreate.js') ?>" async></script>
    <script src="<?= url('assets/app/js/formsDelete.js') ?>" async></script>
    <script src="<?= url('assets/app/js/formsUpdate.js') ?>" async></script>
    <script src="<?= url('assets/app/js/funcoesAuxiliares.js') ?>"></script>
</body>

</html>