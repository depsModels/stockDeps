<!doctype html>
<html lang="pt-br">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="<?= url('assets/app/css/globals.css') ?>">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
  <!-- Ícone do site -->
  <link rel="icon" href="<?= url('assets/web/images/logos/logo-without-background.png') ?>" type="image/png" />
  <title>Stock Deps</title>
</head>

<body>
  <nav class="navbar navbar-expand-lg  shadow-sm">
    <div class="container">
      <a class="navbar-brand d-flex align-items-center" href="<?= url('app') ?>">
        <span class="fw-bold brand">Stock Deps</span>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item mx-1">
            <a class="nav-link" aria-current="page" href="<?= url('app') ?>"><i class="bi bi-house-door-fill"></i> Início</a>
          </li>
          <li class="nav-item mx-1">
            <a class="nav-link" href="<?= url('app/estoque') ?>"><i class="bi bi-box-seam"></i> Estoque</a>
          </li>
          <li class="nav-item mx-1">
            <a class="nav-link" href="<?= url('app/clientes') ?>"><i class="bi bi-person-plus-fill"></i> Clientes</a>
          </li>
          <li class="nav-item mx-1">
            <a class="nav-link" href="<?= url('app/fornecedores') ?>"><i class="bi bi-truck"></i> Fornecedores</a>
          </li>
          <li class="nav-item mx-1">
            <a class="nav-link" href="<?= url('app/relatorio') ?>"><i class="bi bi-bar-chart-line-fill"></i> Relatórios</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</body>
</html>
<?php
echo $this->section("content");
?>