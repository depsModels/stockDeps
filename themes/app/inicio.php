<?php
$this->layout("_theme");
echo '<script>';
echo 'var categorias = ' . json_encode($categorias) . ';';
echo '</script>';
//PEGA OS DADOS DOS PRODUTOS DO BANCO DE DADOS
echo '<script>';
echo 'var produtos = ' . json_encode($produtos) . ';';
echo '</script>';

echo '<script>';
echo 'var entradas = ' . json_encode($entradas) . ';';
echo '</script>';

echo '<script>';
echo 'var saidas = ' . json_encode($saidas) . ';';
echo '</script>';


echo '<script>';
echo 'var clientes = ' . json_encode($clientes) . ';';
echo '</script>';
?>

<link rel="stylesheet" href="<?= url('assets/app/css/styleSassHome.css') ?>">


<div class="container-fluid mt-3">
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-3 mb-3">
      <div class="card h-50">
        <div class="cartao-pequeno h-100">
          <p class="titulo-relatorio">Vendas</p>
          <p class="resposta" id="qtd-vendas"></p>
        </div>
      </div>


      <div class="card h-50">
        <div class="cartao-medio h-100">
          <p class="titulo-relatorio">Clientes</p>
          <p class="resposta" id="qtd-clientes"></p>
        </div>
      </div>
    </div>

    <div class="col-md-6 col-lg-4 ">
      <div class="card h-100">
        <div class="cartao-grande h-100" id="conta-itens">
          <p class="titulo-relatorio mb-4">Itens em cada categoria:</p>
          <p class="resposta-letra" id="lava-roupas-qtd">Lava roupas = 0</p>
          <p class="resposta-letra" id="lava-loucas-qtd">Lava louças = 0</p>
          <p class="resposta-letra" id="lava-carros-qtd">Lava carro = 0</p>
          <p class="resposta-letra" id="limpeza-ambiente-qtd">Limpeza de Ambiente = 0</p>
          <p class="resposta-letra" id="outros-qtd">Outros = 0</p>
          <p class="resposta mt-3" id="total-produtos-qtd">Total = 0</p>
        </div>
      </div>
    </div>
    <div class="col-md-6 col-lg-3 mb-3">
      <div class="card h-100">
        <div class="cartao-medio h-100">
          <p class="titulo-relatorio">Mais vendidos:</p>
          <p class="resposta-letra" id="ranking-categorias"></p>
        </div>
      </div>
    </div>
  </div>
</div>

<script src="<?= url('assets/app/js/home.js') ?>"></script>
<script src="<?= url('assets/app/js/procurarClientes.js') ?>"></script>