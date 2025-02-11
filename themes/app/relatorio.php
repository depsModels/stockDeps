<?php 
$this->layout("_theme");
?>

<link rel="stylesheet" href="<?= url('assets/app/css/relatorio.css') ?>">

<div class="container-relatorios">
    <h1 class="titulo-relatorios">Relatórios do Sistema</h1>
    
    <div class="card-group">
        <div class="card text-center" data-tipo="clientes">
            <div class="card-body">
                <h5 class="card-title">Relatório de Clientes</h5>
                <p class="card-text">Relatório com as informações de cada cliente do sistema, neste documento apresenta dados como: nome, cpf, celular.</p>
                <a href="<?= url("app/pdf-r-c") ?>" class="btn btn-relatorio">
                    <i class="fas fa-file-pdf"></i>
                    Baixar PDF
                </a>
            </div>
        </div>

        <div class="card text-center" data-tipo="fornecedores">
            <div class="card-body">
                <h5 class="card-title">Relatório de Fornecedores</h5>
                <p class="card-text">Relatório com as informações de cada fornecedor do sistema, neste documento apresenta dados como: nome, cnpj, endereço, entre outros.</p>
                <a href="<?= url("app/pdf-r-f") ?>" class="btn btn-relatorio">
                    <i class="fas fa-file-pdf"></i>
                    Baixar PDF
                </a>
            </div>
        </div>

        <div class="card text-center" data-tipo="produtos">
            <div class="card-body">
                <h5 class="card-title">Relatório de Produtos</h5>
                <p class="card-text">Relatório com as informações de cada produto do sistema, neste documento apresenta dados como: nome, preço, descrição, entre outros.</p>
                <a href="<?= url("app/pdf-r-p") ?>" class="btn btn-relatorio">
                    <i class="fas fa-file-pdf"></i>
                    Baixar PDF
                </a>
            </div>
        </div>
    </div>
</div>