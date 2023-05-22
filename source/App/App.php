<?php

namespace Source\App;

use League\Plates\Engine;
use Source\Models\Categorias;
use Source\Models\Clientes;
use Source\Models\Entradas;
use Source\Models\Produtos;
use Source\Models\Saidas;

class App
{
    private $view;

    public function __construct()
    {
        $this->view = new Engine(CONF_VIEW_APP,'php');
    }

    public function inicio () : void 
    {
        $cliente = new Clientes();
        $clientes = $cliente->selectAll();
        $produto = new Produtos();
        $produtos = $produto->selectAll();
        $categoria = new Categorias();
        $categorias = $categoria->selectAll();

        echo $this->view->render("inicio",[
            "produtos" => $produtos,
            "categorias" => $categorias,
            "clientes" => $clientes
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

        echo $this->view->render("estoque",[
            "produtos" => $produtos,
            "categorias" => $categorias,
            "clientes" => $clientes
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
        if(!empty($data)){

            if(in_array("", $data)){
                $json = [
                    "message" => "<div style='color: red'>Informe todos os campos para dar saída neste produto!</div>",
                    "type" => "warning"
                ];
                echo json_encode($json);
                return;
            }

                $saidas = new Saidas(
                    NULL,
                    $data["categoria"],
                    $data["cliente"],
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
                    "message" => "<div style='margin-left: 25px; color: red'>Produto não retirado!</div>",
                    "type" => "error"
                ];
                echo json_encode($json);
                return;
            }
        }

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

}