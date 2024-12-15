<?php

namespace Source\App;

use Dompdf\Dompdf;
use League\Plates\Engine;
use Source\Models\Categorias;
use Source\Models\Clientes;
use Source\Models\Entradas;
use Source\Models\Fornecedores;
use Source\Models\Produtos;
use Source\Models\Saidas;
use Source\Models\EstoqueFeatures;
use PDO;

class App
{
    private $view;
    private EstoqueFeatures $estoqueFeatures;

    public function __construct()
    {
        $this->view = new Engine(CONF_VIEW_APP, 'php');
        $this->estoqueFeatures = new EstoqueFeatures();
    }

    public function inicio(): void
    {
        $cliente = new Clientes();
        $clientes = $cliente->selectAll();

        $produto = new Produtos();
        $produtos = $produto->selectAll();

        $categoria = new Categorias();
        $categorias = $categoria->selectAll();

        $saidas = new Saidas();
        $saidas = $saidas->selectAll();

        echo $this->view->render("inicio", [
            "produtos" => $produtos,
            "categorias" => $categorias,
            "clientes" => $clientes,
            "saidas" => $saidas
        ]);
    }

    public function estoque(): void
    {
        $cliente = new Clientes();
        $clientes = $cliente->selectAll();

        $produto = new Produtos();
        $produtos = $produto->selectAll();

        $categoria = new Categorias();
        $categorias = $categoria->selectAll();

        $entradas = new Entradas();
        $entradas = $entradas->selectAll();

        $saidas = new Saidas();
        $saidas = $saidas->selectAll();

        echo $this->view->render("estoque", [
            "produtos" => $produtos,
            "categorias" => $categorias,
            "clientes" => $clientes,
            "entradas" => $entradas,
            "saidas" => $saidas
        ]);
    }

    public function fornecedores()
    {
        echo $this->view->render("fornecedores");
    }

    public function clientes()
    {
        echo $this->view->render("clientes");
    }

    public function login()
    {
        echo $this->view->render("login");
    }



    

    /* CRUD COMPLETO PRODUTO */

    public function estoquePc(?array $data): void
    {
        if (!empty($data)) {

            if (in_array("", $data)) {
                $json = [
                    "message" => "Informe todos os campos para cadastrar!",
                    "type" => "error"
                ];
                echo json_encode($json);
                return;
            }

            $newpreco = $data["preco"];

            // Remove o símbolo de moeda 'R$'
            $newpreco = str_replace('R$', '', $newpreco);

            // Remove os pontos (separadores de milhar)
            $newpreco = str_replace('.', '', $newpreco);

            // Substitui a vírgula decimal por um ponto
            $newpreco = str_replace(',', '.', $newpreco);

            // Converte para float
            $precoFloat = (float)$newpreco;

            $produto = new Produtos();

            if ($produto->validateProdutos($data["nome"], $data["categoria"])) {
                $json = [
                    "message" => "Produto já cadastrado!",
                    "type" => "warning"
                ];
                echo json_encode($json);
                return;
            }

            $produto = new Produtos(
                NULL,
                $data["categoria"],
                $data["nome"],
                $data["descricao"],
                $precoFloat,
                NULL,
                NULL,
                NULL
            );

            if ($produto->insert()) {

                $json = [
                    "produtos" => $produto->selectAll(),
                    "nome" => $data["nome"],
                    "categoria" => $data["categoria"],
                    "preco" => $precoFloat,
                    "descricao" => $data["descricao"],
                    "message" => "Produto cadastrado com sucesso!",
                    "type" => "success"
                ];
                echo json_encode($json);
                return;
            } else {
                $json = [
                    "message" => "Produto não cadastrado!",
                    "type" => "error"
                ];
                echo json_encode($json);
                return;
            }
        }
    }

    public function estoquePd(?array $data): void
    {
        if (!empty($data)) {

            if (in_array("", $data)) {
                $json = [
                    "message" => "Informe todos os campos para cadastrar!",
                    "type" => "error"
                ];
                echo json_encode($json);
                return;
            }

            $entradas = new Entradas();
            $entradas->delete($data["idProdutoExcluir"]);

            $saidas = new Saidas();
            $saidas->delete($data["idProdutoExcluir"]);

            $produtos = new Produtos();
            $produtoDeletado = $produtos->delete($data["idProdutoExcluir"]);

            if ($produtoDeletado) {
                $json = [
                    "entradas" => $entradas->selectAll(),
                    "saidas" => $saidas->selectAll(),
                    "produtos" => $produtos->selectAll(),
                    "message" => "Produto deletado com sucesso!",
                    "type" => "success"
                ];
                echo json_encode($json);
                return;
            } else {
                $json = [
                    "message" => "Produto não deletado!",
                    "type" => "error"
                ];
                echo json_encode($json);
                return;
            }
        }
    }

    public function estoquePu(?array $data): void
    {
        if (!empty($data)) {

            if (in_array("", $data)) {
                $json = [
                    "message" => "Informe todos os campos para atualizar!",
                    "type" => "error"
                ];
                echo json_encode($json);
                return;
            }

            $entradas = new Entradas();
            $saidas = new Saidas();
            $produtos = new Produtos();
            $produtoAtualizado = $produtos->update(
                $data["idProdutoUpdate"],
                $data["nome"],
                $data["descricao"],
                $data["preco"]
            );

            if ($produtoAtualizado) {
                $json = [
                    "entradas" => $entradas->selectAll(),
                    "saidas" => $saidas->selectAll(),
                    "produtos" => $produtos->selectAll(),
                    "message" => "Produto deletado com sucesso!",
                    "type" => "success"
                ];
                echo json_encode($json);
                return;
            } else {
                $json = [
                    "message" => "Produto não atualizado!",
                    "type" => "error"
                ];
                echo json_encode($json);
                return;
            }
        }
    }





    /*------------ CR CATEGORIA, falta UD ------------*/

    public function estoqueCc(?array $data): void
    {

        if (!empty($data)) {

            if (in_array("", $data)) {
                $json = [
                    "message" => "Informe todos os campos para cadastrar!",
                    "type" => "error"
                ];
                echo json_encode($json);
                return;
            }

            $categoria = new Categorias(
                NULL,
                $data["nome"],
                $data["descricao"]
            );

            if ($categoria->findByName($data["nome"])) {
                $json = [
                    "message" => "Categoria já cadastrada!",
                    "type" => "warning"
                ];
                echo json_encode($json);
                return;
            }

            if ($categoria->insert()) {

                $json = [
                    "categorias" => $categoria->selectAll(),
                    "nome" => $data["nome"],
                    "descricao" => $data["descricao"],
                    "message" => "Categoria cadastrada com sucesso!",
                    "type" => "success"
                ];
                echo json_encode($json);
                return;
            } else {
                $json = [
                    "message" => "Categoria não cadastrada!",
                    "type" => "error"
                ];
                echo json_encode($json);
                return;
            }
        }
    }

    /*------------ CR ENTRADAS, falta UD ------------*/

    public function estoqueEc(?array $data): void
    {
        if (!empty($data)) {

            if (in_array("", $data)) {
                $json = [
                    "message" => "Informe todos os campos para cadastrar!",
                    "type" => "error"
                ];
                echo json_encode($json);
                return;
            }

            $newpreco = $data["preco"];

            // Remove o símbolo de moeda 'R$'
            $newpreco = str_replace('R$', '', $newpreco);

            // Remove os pontos (separadores de milhar)
            $newpreco = str_replace('.', '', $newpreco);

            // Substitui a vírgula decimal por um ponto
            $newpreco = str_replace(',', '.', $newpreco);

            // Converte para float
            $precoFloat = (float)$newpreco;

            $fornecedor = new Fornecedores();
            $idFonecedor = $fornecedor->findByIdName($data["nome"]);

            if ($idFonecedor == false) {
                $json = [
                    "message" => "Fornecedor não encontrado!",
                    "type" => "warning"
                ];
                echo json_encode($json);
                return;
            }

            $entradas = new Entradas(
                NULL,
                $idFonecedor,
                $data["produtoId"],
                $data["quantidade"],
                $precoFloat
            );

            if ($entradas->insert()) {

                $produto = new Produtos();
                $produto->somaQuantidadeProdutos($data["produtoId"], $data["quantidade"]);

                $json = [
                    "entradas" => $entradas->selectAll(),
                    "produtos" => $produto->selectAll(),
                    "nome" => $data["nome"],
                    "idFornecedor" => $idFonecedor,
                    "idProdutos" => $data["produtoId"],
                    "quantidade" => $data["quantidade"],
                    "preco" => $data["preco"],
                    "message" => "Entrada cadastrada com sucesso!",
                    "type" => "success"
                ];
                echo json_encode($json);
                return;
            } else {
                $json = [
                    "message" => "Entrada não cadastrada!",
                    "type" => "error"
                ];
                echo json_encode($json);
                return;
            }
        }
    }

    /*------------ CR SAÍDAS, falta UD ------------*/

    public function estoqueSc(?array $data): void
    {
        if (!empty($data)) {

            if (($data["produtoId2"] && $data["quantidade"] && $data["preco"]) == null) {
                $json = [
                    "nome" => $data["nome"],
                    "idProdutos" => $data["produtoId2"],
                    "quantidade" => $data["quantidade"],
                    "preco" => $data["preco"],
                    "message" => "Informe todos os campos para cadastrar!",
                    "type" => "error"
                ];
                echo json_encode($json);
                return;
            }

            $newpreco = $data["preco"];

            // Remove o símbolo de moeda 'R$'
            $newpreco = str_replace('R$', '', $newpreco);

            // Remove os pontos (separadores de milhar)
            $newpreco = str_replace('.', '', $newpreco);

            // Substitui a vírgula decimal por um ponto
            $newpreco = str_replace(',', '.', $newpreco);

            // Converte para float
            $precoFloat = (float)$newpreco;

            $cliente = new Clientes();
            $idCliente = $cliente->findByIdName($data["nome"]);

            if ($idCliente == false) {
                $idCliente = null;
            }

            $produto = new Produtos();
            $quantidadeProduto = $produto->getQuantidadeById($data["produtoId2"]);

            if ($quantidadeProduto < $data["quantidade"]) {
                $json = [
                    "quantidadeProduto" => $quantidadeProduto,
                    "quantidade" => $data["quantidade"],
                    "message" => "Quantidade inválida!",
                    "type" => "warning"
                ];
                echo json_encode($json);
                return;
            }

            $saidas = new Saidas(
                NULL,
                $idCliente,
                $data["produtoId2"],
                $data["quantidade"],
                $precoFloat
            );

            if ($saidas->insert()) {

                $produto->subtraiQuantidadeProdutos($data["produtoId2"], $data["quantidade"]);

                $json = [
                    "saidas" => $saidas->selectAll(),
                    "produtos" => $produto->selectAll(),
                    "nome" => $data["nome"],
                    "idCliente" => $idCliente,
                    "idProdutos" => $data["produtoId2"],
                    "quantidade" => $data["quantidade"],
                    "preco" => $data["preco"],
                    "message" => "Saída cadastrada com sucesso!",
                    "type" => "success"
                ];
                echo json_encode($json);
                return;
            } else {
                $json = [
                    "message" => "Saída não cadastrada!",
                    "type" => "error"
                ];
                echo json_encode($json);
                return;
            }
        }
    }

    /*------------ CR CLIENTES, falta UD ------------*/

    public function cadastroClientes(?array $data): void
    {
        if (!empty($data)) {

            if (in_array("", $data)) {
                $json = [
                    "message" => "Informe todos os campos para cadastrar!",
                    "type" => "error"
                ];
                echo json_encode($json);
                return;
            }

            $client = new Clientes(
                NULL,
                $data["nome"],
                $data["cpf"],
                $data["celular"]
            );

            if ($client->findByCpf($data["cpf"])) {
                $json = [
                    "message" => "Cliente já cadastrado!",
                    "type" => "warning"
                ];
                echo json_encode($json);
                return;
            }

            if ($client->insert()) {

                $json = [
                    "clientes" => $client->selectAll(),
                    "nome" => $data["nome"],
                    "cpf" => $data["cpf"],
                    "message" => "Cliente cadastrado com sucesso!",
                    "type" => "success"
                ];
                echo json_encode($json);
                return;
            } else {
                $json = [
                    "message" => "Cliente não cadastrado!",
                    "type" => "error"
                ];
                echo json_encode($json);
                return;
            }
        }

        echo $this->view->render("clientes");
    }

    /*------------ CR FORNECEDORES, falta UD ------------*/

    public function cadastroFornecedores(?array $data): void
    {
        if (!empty($data)) {

            if (in_array("", $data)) {
                $json = [
                    "message" => "Informe todos os campos para cadastrar!",
                    "type" => "error"
                ];
                echo json_encode($json);
                return;
            }

            $fornecedor = new Fornecedores(
                NULL,
                $data["nome"],
                $data["cnpj"],
                $data["email"],
                $data["telefone"],
                $data["endereco"],
                $data["municipio"],
                $data["cep"],
                $data["uf"]
            );

            if ($fornecedor->findByCnpj($data["cnpj"])) {
                $json = [
                    "message" => "Fornecedor já cadastrado!",
                    "type" => "warning"
                ];
                echo json_encode($json);
                return;
            }

            if ($fornecedor->insert()) {

                $json = [
                    "fornecedores" => $fornecedor->selectAll(),
                    "nome" => $data["nome"],
                    "cnpj" => $data["cnpj"],
                    "message" => "Fornecedor cadastrado com sucesso!",
                    "type" => "success"
                ];
                echo json_encode($json);
                return;
            } else {
                $json = [
                    "message" => "Fornecedor não cadastrado!",
                    "type" => "error"
                ];
                echo json_encode($json);
                return;
            }
        }

        echo $this->view->render("fornecedores");
    }

    public function estoqueSaidas(?array $data): void
    {

        $cliente = new Clientes();

        $saidas = new Saidas(
            NULL,
            $data["categoria"],
            $cliente->findByIdName($data["cliente"]),
            $data["produto"],
            $data["quantidade"]
        );


        if (!empty($data)) {

            if (in_array("", $data)) {
                $json = [
                    "message" => "<div style='color: red'>Informe todos os campos para dar saída neste produto!</div>",
                    "type" => "warning"
                ];
                echo json_encode($json);
                return;
            }

            $cliente = new Clientes();

            $saidas = new Saidas(
                NULL,
                $data["categoria"],
                $cliente->findByIdName($data["cliente"]),
                $data["produto"],
                $data["quantidade"]
            );

            if ($saidas->insert()) {
                $json = [
                    "message" => "<div style='margin-left: 25px; color: green'>Produtos retirados com sucesso!</div>",
                    "type" => "success"
                ];
                echo json_encode($json);
                return;
            } else {
                $json = [
                    "message" => "<div style='margin-left: 25px; color: red'>Saldo insuficiente para retirada!</div>",
                    "type" => "error"
                ];
                echo json_encode($json);
                return;
            }
        }
    }

    public function estoqueDeletar(?array $data)
    {
        $output = $this->estoqueFeatures->deleteRegister($data['table'], $data['id']);
        echo json_encode($output);
    }

    public function estoqueAtualizar(?array $data)
    {
        $output = $this->estoqueFeatures->updateRegister($data['table'], $data['id'], $data['quantidade'], $data['idProduto']);
        echo json_encode($output);
    }

    public function relatorio(): void
    {

        echo $this->view->render("relatorio");
    }

    public function relatorioClientes(): void
    {

        $cliente = new Clientes();
        $clientes = $cliente->selectAll();

        $clienteList = "";
        foreach ($clientes as $cliente) {
            $clienteList .= "
            <tr>
                <td>{$cliente->nome}</td>
                <td>{$cliente->email}</td>
                <td>{$cliente->celular}</td>
                <td>{$cliente->cidade}</td>
                <td>{$cliente->bairro}</td>
                <td>{$cliente->uf}</td>
            </tr>
        ";
        }

        $dompdf = new Dompdf();

        $dompdf->loadHtml("<html>
    <body>
    <div>
        <h1>Relatório de Clientes</h1>
    </div>
    
    <h2>Lista de clientes cadastrados:</h2>
    <table>
        <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Cidade</th>
            <th>Bairro</th>
            <th>UF</th>
        </tr>
        $clienteList
    </table>
            
    </body>
    
    <style>
        body {
            font-family: arial, sans-serif;
        }
        h1 {
            text-align: center;margin-bottom: 100px;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 90px;
        }
        
        td, th {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
        }
        
        tr:nth-child(even) {
            background-color: #dddddd;
        }
    </style>
    
    </html>");

        // (Optional) Setup the paper size and orientation
        $dompdf->setPaper('A4', 'portrait');

        // Render the HTML as PDF
        $dompdf->render();

        // Output the generated PDF to Browser
        $dompdf->stream("relatório-clientes");
    }

    public function relatorioProdutos(): void
    {

        $produto = new Produtos();
        $produtos = $produto->selectAll();

        $produtoList = "";
        foreach ($produtos as $produto) {
            $produtoList .= "
            <tr>
                <td>{$produto->nome}</td>
                <td>{$produto->preco}</td>
                <td>{$produto->descricao}</td>
                <td>{$produto->created_at}</td>
            </tr>
        ";
        }

        $dompdf = new Dompdf();

        $dompdf->loadHtml("<html>
    <body>
    <div>
        <h1>Relatório de Produtos</h1>
    </div>
    
    <h2>Lista de Produtos em Estoque:</h2>
    <table>
        <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th>Descrição</th>
            <th>Data</th>
        </tr>
        $produtoList
    </table>
            
    </body>
    
    <style>
        body {
            font-family: arial, sans-serif;
        }
        h1 {
            text-align: center;margin-bottom: 100px;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 90px;
        }
        
        td, th {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
        }
        
        tr:nth-child(even) {
            background-color: #dddddd;
        }
    </style>
    
    </html>");

        // (Optional) Setup the paper size and orientation
        $dompdf->setPaper('A4', 'portrait');

        // Render the HTML as PDF
        $dompdf->render();

        // Output the generated PDF to Browser
        $dompdf->stream("relatório-produtos");
    }

    public function getHistoricoCliente(?array $data)
    {
        $cliente = new Clientes();
        $historico = $cliente->getHistoricoSaidas($data['idCliente']);
        $nomeCliente = $cliente->getDadosCliente($data['idCliente'])[0]['nome'];

        $retorno = array("nomeCliente" => $nomeCliente, "historico" => $historico);
        echo json_encode($retorno);
    }

    public function getProdutos()
    {
        $produto = new Produtos();
        echo json_encode($produto->selectAll());
    }

    public function getCategorias()
    {
        $categoria = new Categorias();
        echo json_encode($categoria->selectAll());
    }

    public function getClientes()
    {
        $cliente = new Clientes();
        echo json_encode($cliente->selectAll());
    }

    public function getFornecedores()
    {
        $fornecedores = new Fornecedores();
        echo json_encode($fornecedores->selectAll());
    }

    public function getEntradas()
    {
        $entradas = new Entradas();
        echo json_encode($entradas->selectAll());
    }

    public function getSaidas()
    {
        $saidas = new Saidas();
        echo json_encode($saidas->selectAll());
    }

    // public function buscarPorDataEntrada($dataInicio, $dataFim)
    // {
    //     $entradas = (new Entradas())->find(
    //         "created_at BETWEEN :inicio AND :fim",
    //         "inicio={$dataInicio}&fim={$dataFim}"
    //     )->fetch(true);

    //     echo json_encode($entradas);
    // }

    // // SaidasController.php
    // public function buscarPorDataSaida($dataInicio, $dataFim)
    // {
    //     $saidas = (new Saidas())->find(
    //         "created_at BETWEEN :inicio AND :fim",
    //         "inicio={$dataInicio}&fim={$dataFim}"
    //     )->fetch(true);

    //     echo json_encode($saidas);
    // }


    public function processarXmlNota($request)
    {
        $pdo = \Source\Core\Connect::getInstance();

        if (!isset($_FILES['arquivoNota']) || $_FILES['arquivoNota']['error'] != UPLOAD_ERR_OK) {
            echo json_encode(['error' => 'Erro no upload do arquivo XML']);
            return;
        }

        $xmlPath = $_FILES['arquivoNota']['tmp_name'];
        $xmlContent = file_get_contents($xmlPath);
        $xml = simplexml_load_string($xmlContent);

        if (!$xml) {
            echo json_encode(['error' => 'Arquivo XML inválido']);
            return;
        }

        $namespaces = $xml->getNamespaces(true);
        $xml->registerXPathNamespace('nfe', $namespaces['']);

        $emit = $xml->xpath('//nfe:emit')[0];
        $fornecedor = [
            'CNPJ' => (string)($emit->CNPJ ?? ''),
            'Nome' => (string)($emit->xNome ?? ''),
            'Endereco' => (string)($emit->enderEmit->xLgr ?? ''),
            'Municipio' => (string)($emit->enderEmit->xMun ?? ''),
            'CEP' => (string)($emit->enderEmit->CEP ?? ''),
            'UF' => (string)($emit->enderEmit->UF ?? ''),
            'Telefone' => (string)($emit->enderEmit->fone ?? ''),
        ];

        $produtos = [];
        foreach ($xml->xpath('//nfe:det') as $det) {
            $prod = $det->prod;
            $produtos[] = [
                'Descrição' => (string)($prod->xProd ?? ''),
                'Quantidade' => (float)($prod->qCom ?? 0),
                'Valor Unitário' => (float)($prod->vUnCom ?? 0),
            ];
        }

        $this->cadastrarNota($fornecedor, $produtos);
        echo "Nota processada com sucesso!";
    }

    public function cadastrarNota(array $fornecedorData, array $produtosData): void
    {
        $pdo = \Source\Core\Connect::getInstance();
        var_dump($fornecedorData, $produtosData);

        try {
            // Inicia a transação
            $pdo->beginTransaction();

            // Verifica se o fornecedor já existe
            $queryFornecedor = "SELECT id FROM fornecedores WHERE cnpj = :cnpj LIMIT 1";
            $stmtFornecedor = $pdo->prepare($queryFornecedor);
            $stmtFornecedor->execute(['cnpj' => $fornecedorData['CNPJ']]);
            $fornecedorId = $stmtFornecedor->fetchColumn();

            if (!$fornecedorId) {
                // Cadastra o fornecedor
                $queryInsertFornecedor = "
                INSERT INTO fornecedores (nome, cnpj, telefone, endereco, municipio, cep, uf, created_at) 
                VALUES (:nome, :cnpj, :telefone, :endereco, :municipio, :cep, :uf, NOW())
            ";
                $stmtInsertFornecedor = $pdo->prepare($queryInsertFornecedor);
                $stmtInsertFornecedor->execute([
                    'nome' => $fornecedorData['Nome'],
                    'cnpj' => $fornecedorData['CNPJ'],
                    'telefone' => $fornecedorData['Telefone'],
                    'endereco' => $fornecedorData['Endereco'], // Acessando diretamente
                    'municipio' => $fornecedorData['Municipio'], // Acessando diretamente
                    'cep' => $fornecedorData['CEP'], // Acessando diretamente
                    'uf' => $fornecedorData['UF'],
                ]);
                $fornecedorId = $pdo->lastInsertId();
            }

            // Processa cada produto
            foreach ($produtosData as $produto) {
                // Verifica se o produto já existe
                $queryProduto = "SELECT id FROM produtos WHERE nome = :nome LIMIT 1";
                $stmtProduto = $pdo->prepare($queryProduto);
                $stmtProduto->execute(['nome' => $produto['Descrição']]);
                $produtoId = $stmtProduto->fetchColumn();

                if (!$produtoId) {
                    // Cadastra o produto
                    $queryInsertProduto = "
                    INSERT INTO produtos (idCategoria, nome, descricao, preco, quantidade, created_at)
                    VALUES (:idCategoria, :nome, :descricao, :preco, :quantidade, NOW())
                ";
                    $stmtInsertProduto = $pdo->prepare($queryInsertProduto);
                    $stmtInsertProduto->execute([
                        'idCategoria' => 1, // Substitua por lógica para associar a categoria, se necessário
                        'nome' => $produto['Descrição'],
                        'descricao' => $produto['Descrição'],
                        'preco' => $produto['Valor Unitário'],
                        'quantidade' => $produto['Quantidade'],
                    ]);
                    $produtoId = $pdo->lastInsertId();
                } else {
                    // Atualiza a quantidade existente
                    $queryUpdateQuantidade = "
                    UPDATE produtos SET quantidade = quantidade + :quantidade WHERE id = :id
                ";
                    $stmtUpdateQuantidade = $pdo->prepare($queryUpdateQuantidade);
                    $stmtUpdateQuantidade->execute([
                        'quantidade' => $produto['Quantidade'],
                        'id' => $produtoId,
                    ]);
                }

                // Cadastra a entrada
                $queryInsertEntrada = "
                INSERT INTO entradas (idFornecedor, idProdutos, quantidade, preco, created_at)
                VALUES (:idFornecedor, :idProdutos, :quantidade, :preco, NOW())
            ";
                $stmtInsertEntrada = $pdo->prepare($queryInsertEntrada);
                $stmtInsertEntrada->execute([
                    'idFornecedor' => $fornecedorId,
                    'idProdutos' => $produtoId,
                    'quantidade' => $produto['Quantidade'],
                    'preco' => $produto['Valor Unitário'],
                ]);
            }

            // Finaliza a transação
            $pdo->commit();
            echo "Nota processada com sucesso!";
        } catch (\Exception $e) {
            $pdo->rollBack();
            echo "Erro ao processar a nota: " . $e->getMessage();
        }
        // var_dump($fornecedorData, $produtosData);
    }
}
