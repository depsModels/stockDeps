<?php
$this->layout("_theme");

//PEGA OS DADOS DOS CLIENTES DO BANCO DE DADOS
echo '<script>';
echo 'var clientes = ' . json_encode($clientes) . ';';
echo '</script>';
?>
<!-- Carrega o Jquery-->
<head>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<!--Link biblioteca carrossel-->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css">

<!--Link css clientes-->
<link rel="stylesheet" href="<?= url('assets/app/css/styleSassClientes.css') ?>">
</head>
<body>
  
  <div class="container1">
   <!--  -->
       <div id="myModal" class="modal">
         <div class="modal-content">
           <span class="fecharModal">&times;</span>
            <h3 id='nomeCliente'></h3>
           
             <table id='tableHistorico'>
               <thead>
               <th>Categoria</th>
               <th>Produto</th>
               <th>Quantidade</th>
               <th>Data</th>
               </thead>
               <tbody id="historicoSaidas"></tbody>
             </table>
         </div>
       </div>
   <!--  -->
 <div class="titulo">
        <div class="radios">
          <input type="radio" class="botao-selecionavel" name="checks" id="checkCarrossel" checked>
            <label for="checkCarrossel">
            <p class="botao-produtos">
            Carrossel
            </p>
            </label>
            <input type="radio" class="botao-selecionavel" name="checks" id="checkBloco">
            <label for="checkBloco">
            <p class="botao-produtos">
            Bloco
            </p>
            </label>
        </div>
        <a href="#carousel" id="titulo-clientes"><h3>Clientes</h3></a>
    </div>
    <div id="carousel" class="owl-carousel">

    </div>
    <div class="bloco">

    </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js"></script>
<script src="<?= url('assets/app/js/clientes.js') ?>"></script>
<script src="<?= url('assets/app/js/procurarClientes.js') ?>"></script>
<script src="<?= url('assets/app/js/clientesHistorico.js') ?>"></script>

</body>