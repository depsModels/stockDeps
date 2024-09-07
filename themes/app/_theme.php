<!doctype html>
<html lang="pt-br">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">

  <link rel="stylesheet" href="<?= url('assets/app/css/styleSassGeral.css') ?>">

  <!-- CSS only -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">

  <title>Stock Deps</title>
</head>

<body>


  <!--TOPO DA PÁGINA-->
  <nav class="navbar navbar-expand-lg ">
    <div class="container">
      <a class="navbar-brand" href="#">
        <p class="deps mt-3">Stock deps</p>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        &#9776;
      </button>
      <div class="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">

        <button class="close-button" type="button">&#10006;</button>
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link" href="<?= url('') ?>">Início</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="<?= url('estoque') ?>">Estoque</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="<?= url('cadastro') ?>">Cadastro</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="<?= url('relatorio') ?>">Relatórios</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="<?= url('clientes') ?>">Clientes</a>
          </li>
          <li class="nav-item">
            <div class="form-check form-switch tema">
              <input class="form-check-input" type="checkbox" id="darkmode-toggle">
              <label class="form-check-label" for="darkmode-toggle"></label>
            </div>
          </li>
        </ul>
     
        <form class="d-flex" role="search">
          <div class="inputPesquisa">
            <div class="block">
              <input id="procurar-cliente" class="form-control mt-1 mx-3" type="search" placeholder="Procurar cliente" aria-label="Search">
            </div>
          </div>
        </form>
      </div>
    </div>
  </nav>


  <div id="client-list">

  </div>


  <script src="<?= url('assets/app/js/tema.js') ?>"></script>

  <script src="<?= url('assets/app/js/hamburguer.js') ?>"></script>
</body>

</html>
<?php

echo $this->section("content");

?>