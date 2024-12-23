<?php
$this->layout("_theme");
?>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js"></script>
<link rel="stylesheet" href="<?= url('assets/app/css/fornecedores.css') ?>">

<body>
    <div class="container-fluid">
        <div class="row justify-content-center">
            <div class="tabelaFornecedores">
                <h1 class="text-center p-4">
                    Fornecedores
                </h1>
                <div class="headerTabelaFornecedores p-3">
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalAdicionarFornecedor" id="adicionarFornecedorBtn">
                        Adicionar Fornecedor
                    </button>
                    <div class="d-flex ">
                        <label for="buscarFornecedor" class="p-2">Procurar fornecedor:</label>
                        <input type="text" name="buscarFornecedor" id="buscarFornecedor" placeholder="Procurar fornecedor" class="form-control">
                    </div>
                </div>
                <table id="tabelaFornecedores" class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th id="ordenarNomeFornecedor">Nome <span class="seta" id="setaNomeFornecedor">⬍</span></th>
                            <th id="ordenarCnpjFornecedor">CNPJ</th>
                            <th id="ordenarEmailFornecedor">Email</th>
                            <th id="ordenarTelefoneFornecedor">Telefone</th>
                            <th id="ordenarEnderecoFornecedor">Endereço</th>
                            <th id="ordenarMunicipioFornecedor">Município</th>
                            <th id="ordenarCepFornecedor">CEP</th>
                            <th id="ordenarUfFornecedor">UF</th>
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
            <ul class="pagination justify-content-center" id="paginationFornecedores"></ul>
        </nav>
    </div>

    <!-- Modal Adicionar Fornecedor -->
    <div class="modal fade" id="modalAdicionarFornecedor" tabindex="-1" aria-labelledby="modalAdicionarFornecedorLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalAdicionarFornecedorLabel">Adicionar Fornecedor</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="formAdicionarFornecedor">
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="nomeFornecedor" class="form-label">Nome</label>
                            <input name="nome" type="text" class="form-control" id="nomeFornecedor" placeholder="Digite o nome do fornecedor">
                        </div>
                        <div class="mb-3">
                            <label for="cnpjFornecedor" class="form-label">CNPJ</label>
                            <input name="cnpj" type="text" class="form-control" id="cnpjFornecedor" maxlength="16" placeholder="Digite o CNPJ do fornecedor" oninput="formatarCNPJ(event)">
                        </div>
                        <div class="mb-3">
                            <label for="emailFornecedor" class="form-label">Email</label>
                            <input name="email" type="email" class="form-control" id="emailFornecedor" placeholder="Digite o email do fornecedor">
                        </div>
                        <div class="mb-3">
                            <label for="telefoneFornecedor" class="form-label">Telefone</label>
                            <input name="telefone" type="text" class="form-control" id="telefoneFornecedor" placeholder="Digite o telefone do fornecedor">
                        </div>
                        <div class="mb-3">
                            <label for="endereco" class="form-label">Endereço</label>
                            <input name="endereco" type="text" class="form-control" id="endereco" placeholder="Digite o endereço">
                        </div>
                        <div class="mb-3">
                            <label for="municipioFornecedor" class="form-label">Municipio</label>
                            <input name="municipio" type="text" class="form-control" id="municipioFornecedor" placeholder="Digite o municipio">
                        </div>
                        <div class="mb-3">
                            <label for="cepFornecedor" class="form-label">CEP</label>
                            <input name="cep" type="text" class="form-control" id="cepFornecedor" placeholder="Digite o CEP">
                        </div>
                        <div class="mb-3">
                            <label for="ufFornecedor" class="form-label">UF</label>
                            <select name="uf" class="form-control" id="ufFornecedor" placeholder="Digite a UF">
                                <option value="" disabled selected>Selecione o estado</option>
                                <option value="AC">Acre (AC)</option>
                                <option value="AL">Alagoas (AL)</option>
                                <option value="AP">Amapá (AP)</option>
                                <option value="AM">Amazonas (AM)</option>
                                <option value="BA">Bahia (BA)</option>
                                <option value="CE">Ceará (CE)</option>
                                <option value="DF">Distrito Federal (DF)</option>
                                <option value="ES">Espírito Santo (ES)</option>
                                <option value="GO">Goiás (GO)</option>
                                <option value="MA">Maranhão (MA)</option>
                                <option value="MT">Mato Grosso (MT)</option>
                                <option value="MS">Mato Grosso do Sul (MS)</option>
                                <option value="MG">Minas Gerais (MG)</option>
                                <option value="PA">Pará (PA)</option>
                                <option value="PB">Paraíba (PB)</option>
                                <option value="PR">Paraná (PR)</option>
                                <option value="PE">Pernambuco (PE)</option>
                                <option value="PI">Piauí (PI)</option>
                                <option value="RJ">Rio de Janeiro (RJ)</option>
                                <option value="RN">Rio Grande do Norte (RN)</option>
                                <option value="RS">Rio Grande do Sul (RS)</option>
                                <option value="RO">Rondônia (RO)</option>
                                <option value="RR">Roraima (RR)</option>
                                <option value="SC">Santa Catarina (SC)</option>
                                <option value="SP">São Paulo (SP)</option>
                                <option value="SE">Sergipe (SE)</option>
                                <option value="TO">Tocantins (TO)</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        <button type="submit" class="btn btn-primary">Salvar Fornecedor</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal Editar -->
    <div class="modal fade" id="modalEditarFornecedor" tabindex="-1" aria-labelledby="modalEditarFornecedorLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalAdicionarFornecedorLabel">Editar Fornecedor</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="formEditarFornecedor" name="formEditarFornecedor" method="post" class="p-3">
                        <input name="idFornecedorEditar" type="hidden" id="editarFornecedorId">
                    <div class="mb-3">
                        <label for="editarFornecedorNome" class="form-label">Nome</label>
                        <input name="nome" type="text" id="editarFornecedorNome" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label for="editarFornecedorCnpj" class="form-label">CNPJ</label>
                        <input name="cnpj" type="text" id="editarFornecedorCnpj" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label for="editarFornecedorEmail" class="form-label">Email</label>
                        <input name="email" type="email" id="editarFornecedorEmail" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label for="editarFornecedorTelefone" class="form-label">Telefone</label>
                        <input name="telefone" type="text" id="editarFornecedorTelefone" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label for="editarFornecedorEndereco" class="form-label">Endereco</label>
                        <input name="endereco" type="text" id="editarFornecedorEndereco" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label for="editarFornecedorMunicipio" class="form-label">Municipio</label>
                        <input name="municipio" type="text" id="editarFornecedorMunicipio" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label for="editarFornecedorCep" class="form-label">CEP</label>
                        <input name="cep" type="text" id="editarFornecedorCep" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label for="editarUfFornecedor" class="form-label">UF</label>
                        <select name="uf" class="form-control" id="editarUfFornecedor" placeholder="Digite a UF">
                            <option value="" disabled selected>Selecione o estado</option>
                            <option value="AC">Acre (AC)</option>
                            <option value="AL">Alagoas (AL)</option>
                            <option value="AP">Amapá (AP)</option>
                            <option value="AM">Amazonas (AM)</option>
                            <option value="BA">Bahia (BA)</option>
                            <option value="CE">Ceará (CE)</option>
                            <option value="DF">Distrito Federal (DF)</option>
                            <option value="ES">Espírito Santo (ES)</option>
                            <option value="GO">Goiás (GO)</option>
                            <option value="MA">Maranhão (MA)</option>
                            <option value="MT">Mato Grosso (MT)</option>
                            <option value="MS">Mato Grosso do Sul (MS)</option>
                            <option value="MG">Minas Gerais (MG)</option>
                            <option value="PA">Pará (PA)</option>
                            <option value="PB">Paraíba (PB)</option>
                            <option value="PR">Paraná (PR)</option>
                            <option value="PE">Pernambuco (PE)</option>
                            <option value="PI">Piauí (PI)</option>
                            <option value="RJ">Rio de Janeiro (RJ)</option>
                            <option value="RN">Rio Grande do Norte (RN)</option>
                            <option value="RS">Rio Grande do Sul (RS)</option>
                            <option value="RO">Rondônia (RO)</option>
                            <option value="RR">Roraima (RR)</option>
                            <option value="SC">Santa Catarina (SC)</option>
                            <option value="SP">São Paulo (SP)</option>
                            <option value="SE">Sergipe (SE)</option>
                            <option value="TO">Tocantins (TO)</option>
                        </select>
                    </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                    <button type="submit" class="btn btn-primary" id="btnSalvarEdicao">Editar</button>
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
                    <h5 class="modal-title" id="modalExcluirLabel">Excluir Fornecedor</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                </div>
                <form id="fornecedor-excluir" name="fornecedor-excluir" method="post">
                    <div class="modal-body">
                        <p>Tem certeza de que deseja excluir este fornecedor?  
                        Ao confirmar, todas as entradas, compras e outros registros relacionados a ele também serão removidos.</p>
                        <input type="hidden" id="idFornecedorExcluir" name="idFornecedorExcluir"> <!-- Campo oculto para armazenar o id -->
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-danger" id="confirmarExcluir">Excluir</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal Histórico -->
    <div class="modal fade" id="modalHistoricoFornecedor" tabindex="-1" aria-labelledby="modalHistoricoFornecedorLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalHistoricoFornecedorLabel">Histórico de Compras</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p id="historicoFornecedor"></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                </div>
            </div>
        </div>
    </div>

    <script src="<?= url('assets/app/js/fornecedores.js') ?>"></script>
    <script src="<?= url('assets/app/js/formsCreate.js') ?>" async></script>
    <script src="<?= url('assets/app/js/formsDelete.js') ?>" async></script>
    <script src="<?= url('assets/app/js/formsUpdate.js') ?>" async></script>
    <script src="<?= url('assets/app/js/funcoesAuxiliares.js') ?>" ></script>
</body>

</html>