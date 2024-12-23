<?php
$this->layout("_theme");
?>

<link rel="stylesheet" href="<?= url('assets/app/css/home.css') ?>">
<!-- FontAwesome (Ícones) -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">

<body>
    <div class="container mt-3">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1>Dashboard</h1>
        </div>
        <!-- Cards -->
        <div class="row g-4">
            <div class="col-md-3">
                <div class="card text-center text-white bg-primary box-hover">
                    <div class="card-body statistic-cards">
                        <h5 class="card-title">Total de Produtos</h5>
                        <h3 id="total-produtos">0</h3>
                        <p><i class="fas fa-box"></i> Atualizado hoje</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center text-white bg-success box-hover">
                    <div class="card-body statistic-cards">
                        <h5 class="card-title">Produtos em Estoque</h5>
                        <h3 id="produtos-estoque">0</h3>
                        <p><i class="fas fa-check-circle"></i> Suficiente</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center text-white bg-warning box-hover">
                    <div class="card-body statistic-cards">
                        <h5 class="card-title">Estoque Baixo</h5>
                        <h3 id="estoque-baixo">0</h3>
                        <p><i class="fas fa-exclamation-triangle"></i> Repor itens</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center text-white bg-danger box-hover">
                    <div class="card-body">
                        <h5 class="card-title">Produtos Sem Estoque</h5>
                        <h3 id="produtos-sem-estoque">0</h3>
                        <p><i class="fas fa-times-circle"></i> Reabasteça urgentemente</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center text-light bg-dark box-hover">
                    <div class="card-body">
                        <h5 class="card-title">Total de Clientes</h5>
                        <h3 id="total-clientes">0</h3>
                        <p><i class="fas fa-users"></i> Base ativa</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center text-white bg-secondary box-hover">
                    <div class="card-body">
                        <h5 class="card-title">Total de Fornecedores</h5>
                        <h3 id="total-fornecedores">0</h3>
                        <p><i class="fas fa-truck"></i> Fornecedores ativos</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center text-white bg-info box-hover">
                    <div class="card-body">
                        <h5 class="card-title">Total de Entradas</h5>
                        <h3 id="total-entradas">0</h3>
                        <p><i class="fas fa-arrow-circle-up"></i> Entradas registradas</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center bg-light box-hover">
                    <div class="card-body">
                        <h5 class="card-title">Total de Saídas</h5>
                        <h3 id="total-saidas">0</h3>
                        <p><i class="fas fa-arrow-circle-down"></i> Saídas registradas</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Gráficos -->
        <div class="row mt-5 mb-5 d-flex align-items-stretch">
            <div class="col-md-5">
                <div class="card h-100 d-flex flex-column">
                    <div class="card-body">
                        <h3 class="card-title mt-3 text-center">Lucro por Período</h3>
                        <!-- Filtro para selecionar o período -->
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <div>
                                <label for="periodo" class="form-label mt-3">Selecione o Período</label>
                                <select id="periodo" class="form-select" onchange="calcularLucro()">
                                    <option value="total">Total</option>
                                    <option value="dia">Dia</option>
                                    <option value="tresDias">Tres dias</option>
                                    <option value="semana">Semana</option>
                                    <option value="duasSemanas">Duas semanas</option>
                                    <option value="mes">Mês</option>
                                    <option value="trimestre">Trimestre</option>
                                    <option value="semestre">Semestre</option>
                                    <option value="ano">Ano</option>
                                </select>
                            </div>
                            <div>
                                <button class="btn btn-primary mt-5" onclick="calcularLucro()">Calcular</button>
                            </div>
                        </div>
                    </div>
                    <!-- Exibindo Lucro Bruto e Lucro Líquido -->
                    <div class="row mt-auto mb-4 mx-1">
                        <div class="col-md-6">
                            <div class="card h-100 p-2">
                                <div class="card-body">
                                    <h5 class="card-title">Lucro Bruto</h5>
                                    <h3 id="lucro-bruto">R$ 0,00</h3> <!-- Exibirá o lucro bruto -->
                                </div>
                            </div>
                        </div>
                        <!-- Caixa de Lucro Líquido -->
                        <div class="col-md-6">
                            <div class="card h-100 p-2">
                                <div class="card-body">
                                    <h5 class="card-title">Lucro Líquido</h5>
                                    <h3 id="lucro-liquido">R$ 0,00</h3> <!-- Exibirá o lucro líquido -->
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div class="col-md-3">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">Distribuição por Categorias</h5>
                        <div class="chart-container">
                            <canvas id="chart-categorias"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
    <div class="card h-100 produtos-mais-vendidos-card">
        <div class="card-body">
            <h5 class="card-title text-center">Produtos Mais Vendidos</h5>
            <div class="produtos-mais-vendidos-container">
                <ul class="list-group list-group-flush" id="produtos-mais-vendidos">
                    <!-- Os itens serão inseridos dinamicamente pelo JavaScript -->
                </ul>
            </div>
        </div>
    </div>
</div>


        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="<?= url('assets/app/js/home.js') ?>"></script>
</body>