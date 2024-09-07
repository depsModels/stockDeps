<?php

namespace Source\App;

use Dompdf\Dompdf;
use League\Plates\Engine;
use Source\Models\Categorias;
use Source\Models\Clientes;
use Source\Models\Entradas;
use Source\Models\Produtos;
use Source\Models\Saidas;
use Source\Models\EstoqueFeatures;


class App
{
    private $view;
    private EstoqueFeatures $estoqueFeatures;

    public function __construct()
    {
        $this->view = new Engine(CONF_VIEW_APP,'php');
        $this->estoqueFeatures = new EstoqueFeatures();
    }

    public function inicio () : void 
    {
        $cliente = new Clientes();
        $clientes = $cliente->selectAll();

        $produto = new Produtos();
        $produtos = $produto->selectAll();

        $categoria = new Categorias();
        $categorias = $categoria->selectAll();

        $saidas = new Saidas();
        $saidas = $saidas->selectAll();

        echo $this->view->render("inicio",[
            "produtos" => $produtos,
            "categorias" => $categorias,
            "clientes" => $clientes,
            "saidas" => $saidas
        ]);

    }

    public function estoque () : void 
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

        echo $this->view->render("estoque",[
            "produtos" => $produtos,
            "categorias" => $categorias,
            "clientes" => $clientes,
            "entradas" => $entradas,
            "saidas" => $saidas
        ]);

    }

    public function estoqueCadastro (?array $data) : void 
    {
        if(!empty($data)){

            if(in_array("", $data)){
                $json = [
                    "message" => "<div style='margin-left: 25px; color: red'>Informe todos os campos para cadastrar!</div>",
                    "type" => "warning"
                ];
                echo json_encode($json);
                return;
            }

            $produto = new Produtos();

            if($produto->validateProdutos($data["nome"], $data["categoria"])){
                $json = [
                    "message" => "<div style='margin-left: 25px; color: red'>Produto já cadastrado!</div>",
                    "type" => "warning"
                ];
                echo json_encode($json);
                return;
            }
            

            $produto = new Produtos(
                NULL,
                $data["categoria"],
                $data["nome"],
                $data["preco"],
                $data["descricao"]
            );

            if($produto->insert()){

                $json = [
                    "message" => "<div style='margin-left: 25px; color: green'>Produto cadastrado com sucesso!</div>",
                    "type" => "success"
                ];

                echo json_encode($json);
                return;

            } else {
                $json = [
                    "message" => "<div style='margin-left: 25px; color: red'>Produto não cadastrado!</div>",
                    "type" => "error"
                ];
                echo json_encode($json);
                return;
            }
        }

    }

    public function estoqueEntrada (?array $data) : void 
    {
        if(!empty($data)){

            if(in_array("", $data)){
                $json = [
                    "message" => "<div style='color: red'>Informe todos os campos para dar entrada neste produto!</div>",
                    "type" => "warning"
                ];
                echo json_encode($json);
                return;
            }

                $entrada = new Entradas(
                    NULL,
                    $data["categoria"],
                    $data["produto"],
                    $data["quantidade"]
                );


            if($entrada->insert()){

                $json = [
                    "message" => "<div style='margin-left: 25px; color: green'>Produtos adicionados com sucesso!</div>",
                    "type" => "success"
                ];

                echo json_encode($json);
                return;

            } else {
                $json = [
                    "message" => "<div style='margin-left: 25px; color: red'>Produto não adicionado!</div>",
                    "type" => "error"
                ];
                echo json_encode($json);
                return;
            }
        }

    }

    public function estoqueSaidas (?array $data) : void 
    {

        $cliente = new Clientes();

        $saidas = new Saidas(
            NULL,
            $data["categoria"],
            $cliente->findByIdName($data["cliente"]),
            $data["produto"],
            $data["quantidade"]
        );


        if(!empty($data)){

            if(in_array("", $data)){
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

            if($saidas->insert()){
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


    public function estoqueDeletar(?array $data){
        $output = $this->estoqueFeatures->deleteRegister($data['table'], $data['id']);
        echo json_encode($output);
    }

    public function estoqueAtualizar(?array $data){
        $output = $this->estoqueFeatures->updateRegister($data['table'], $data['id'], $data['quantidade'], $data['idProduto']);
        echo json_encode($output);
    }

    public function cadastro (?array $data) : void 
    {
        if(!empty($data)){

            if(in_array("", $data)){
                $json = [
                    "message" => "<div style='text-align: center; color: red'>Informe todos os campos para cadastrar!</div>",
                    "type" => "warning"
                ];
                echo json_encode($json);
                return;
            }

            if(!is_email($data["email"])){
                $json = [
                    "message" => "Informe um e-mail válido!",
                    "type" => "warning"
                ];
                echo json_encode($json);
                return;
            }

            $client = new Clientes(
                NULL,
                $data["name"],
                $data["cpf"],
                $data["email"],
                $data["celular"],
                $data["cidade"],
                $data["bairro"],
                $data["uf"]
            );

            if($client->findByCpf($data["cpf"])){
                $json = [
                    "message" => "Cpf já cadastrado!",
                    "type" => "error"
                ];
                echo json_encode($json);
                return;
            }

            if($client->insert()){

                $json = [
                    "name" => $data["name"],
                    "email" => $data["email"],
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
        
        echo $this->view->render("cadastro");
    }

    public function clientes () : void 
    {

        $cliente = new Clientes();
        $clientes = $cliente->selectAll();

        echo $this->view->render("clientes", [
            "clientes" => $clientes
        ]);

    }

    public function relatorio () : void 
    {

        echo $this->view->render("relatorio");

    }

    public function relatorioClientes () : void
    {

    $cliente = new Clientes();
    $clientes = $cliente->selectAll();

    $clienteList = "";
    foreach ($clientes as $cliente){
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

    public function relatorioProdutos () : void
    {

    $produto = new Produtos();
    $produtos = $produto->selectAll();

    $produtoList = "";
    foreach ($produtos as $produto){
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

    public function getHistoricoCliente(?array $data){
        $cliente = new Clientes();
        $historico = $cliente->getHistoricoSaidas($data['idCliente']);
        $nomeCliente = $cliente->getDadosCliente($data['idCliente'])[0]['nome'];

        $retorno = array("nomeCliente" => $nomeCliente, "historico" => $historico);
        echo json_encode($retorno);
    }

}